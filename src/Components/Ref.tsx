import './FullHeightComponent.css'; // Import your CSS file
import '../index.css';
import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { FcLink } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useInitData } from '@vkruglikov/react-telegram-web-app';

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  language_code: string;
}

interface InitDataUnsafe {
  query_id: string;
  user: User;
  auth_date: number;
  hash: string;
}


const Ref = () => {
  const [showModal, setShowModal] = useState(false);
  const [url, setUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [norefermm, setNoOfRefer] = useState(0);
  const [referred, setReferred] = useState(false);
  const [points, setPoints] = useState<number>(() => {
    const storedPoints = localStorage.getItem("poinin");
    return Number(storedPoints) || 0;
  });
  const [initDataUnsafe] = useInitData() as readonly [InitDataUnsafe | undefined, unknown];

  if (!initDataUnsafe) {
    return <div>No initialization data available. Please ensure you are using the Telegram app.</div>;
  }

  const user = initDataUnsafe.user;

  if (!user) {
    return <div>No user data available. Initialization data: {JSON.stringify(initDataUnsafe)}</div>;
  }

  const UserId = user.id;

  useEffect(() => {
    setUrl('https://t.me/NOT_COIN_A_BOT?start=r_' + user.id);
    
  }, [user.id]);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleMod = () => {
    setShowModal(true);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch('/refral.php', {
          method: 'POST',
          body: JSON.stringify({ UserId }),
          headers: { 'Content-Type': 'application/json' },
        }); // Replace with your API endpoint

        if (response.ok) {
          const data = await response.json();

          const storedNoRefer = localStorage.getItem('norefermm');
          const previousNoRefer = storedNoRefer ? parseInt(storedNoRefer, 10) : 0;

          if (storedNoRefer === null) {
            // First time visiting, calculate points based on the current number of referrals
            const initialPoints = data.referal * 50000;
            localStorage.setItem('poinin', initialPoints.toString()+points);
            
          } else if (data.referal > previousNoRefer) {
            // If the number of referrals has increased
            const referralDifference = data.referal - previousNoRefer;
            const additionalPoints = referralDifference * 50000;
            const newPoints = points + additionalPoints;
            localStorage.setItem('poinin', newPoints.toString());
            setPoints(newPoints);

            // Update the server with the new points
            try {
              const pointsGained = additionalPoints;
              const secondResponse = await fetch("main.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ pointsGained, UserId }),
              });

              if (secondResponse.ok) {
                const secondData = await secondResponse.json();
                console.log("Server response:", secondData);
              } else {
                console.error("Error fetching data from server");
              }
            } catch (error) {
              console.error("An error occurred:", error);
            }
          }

          // Update the number of referrals in the state and local storage
          setNoOfRefer(data.referal);
          localStorage.setItem('norefermm', data.referal.toString());
          setReferred(data.referal !== 0);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchInitialData();
  }, []);

  return (
    <div>
      <div className="absolute inset-0 h-1/2 fullHeightContainer z-0">
        <div style={{ justifyContent: 'center', marginTop: '80px', padding: '10px' }}>
          {referred ? (
            <div className='HeaderC'>
              <h1 className="headerText" style={{ textAlign: 'center' }}>Congrats!</h1>
              <p className='Sp'>You referred {norefermm} people</p>
            </div>
          ) : (
            <div className='HeaderC'>
              <h1 className="headerText">No frens yet </h1>
              <p className='Sp'>Hope you will have some soon.</p>
            </div>
          )}
          <div className='card2'>
            <p className="subHeaderText">Refer a friend to get 50,000 bonus.</p>
            <span className="coinIcon">🪙</span>
          </div>
        </div>
        <button onClick={handleMod} className="inviteButton">Invite a fren</button>
      </div>

      <ReactModal className="modal" isOpen={showModal} contentLabel="Warning Modal">
        <div className="modal-content">
          <IoIosCloseCircleOutline onClick={handleCloseModal} style={{ float: 'right', fontSize: '39px', margin: '3px' }} />
          <br />
          <div className="modal-header">
            <FcLink style={{ marginLeft: '38%', fontSize: '80px', marginBottom: '2px' }} />
            <h1>Invite a friend</h1>
            <p>Send invite directly in telegram or use your personal link to invite friends</p>
          </div>
          <div className="modal-body">
            <p style={{ border: '0.2px red solid', fontSize: '18px' }}>{url}</p>
            <button onClick={handleCopyClick}>
              {isCopied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default Ref;
