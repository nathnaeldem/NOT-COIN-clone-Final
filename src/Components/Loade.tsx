import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useExpand } from '@vkruglikov/react-telegram-web-app';
import { tailspin } from 'ldrs';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
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

tailspin.register();

function Loade1() {
  const [isExpanded, expand] = useExpand();
  const { refid } = useParams();
  const referralLink = `https://t.me/aureus_coin_bot?start=r_${refid}`;
  const navigate = useNavigate();
  const [initDataUnsafe] = useInitData() as readonly [InitDataUnsafe | undefined, unknown];

  if (!initDataUnsafe) {
    return <div>No initialization data available. Please ensure you are using the Telegram app.</div>;
  }

  const user = initDataUnsafe.user;
  const tetekami = user.id;
  const sir = user.username;

  if (!user) {
    return <div>No user data available. Initialization data: {JSON.stringify(initDataUnsafe)}</div>;
  }

  const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, delay = 1000): Promise<any> => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error(`Attempt ${i + 1} failed. Retrying...`, error);
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          window.location.reload();
        }
      }
    }
  };

  useEffect(() => {
    if (!isExpanded) expand();

    console.log('reflink:', referralLink);
    if (referralLink) {
      async function fetchInitialData() {
        try {
          const data = await fetchWithRetry('/loader.php', {
            method: 'POST',
            body: JSON.stringify({ referralLink, tetekami, sir }),
            headers: { 'Content-Type': 'application/json' },
          });

          if (data.messa === true) {
            localStorage.setItem("poinin", data.points);
          }
        } catch (error) {
          console.error('Error fetching initial data:', error);
        }
      }
      fetchInitialData();
    }
  }, [isExpanded, referralLink, tetekami, sir]);

  useEffect(() => {
    setTimeout(() => {
      handleLogin();
      console.log("Waited 9 seconds!");
    }, 9000);
  }, []);

  const handleLogin = () => {
    navigate('/home');
  };

  return (
    <div className="absolute inset-0 h-1/2 fullHeightContainer1 z-0">
      <div style={{ marginTop: '68%', textAlign: "center" }}>
        <l-tailspin size="40" stroke="5" speed="0.9" color="white" />
        <br />
        <h3 style={{ marginTop: '15px', fontSize: '35px' }}>Probably something!</h3>
        <p style={{ marginTop: '60px', fontFamily: 'Sofia', fontSize: '22px' }}>Hello {user.first_name}</p>
      </div>
      <footer>
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      </footer>
    </div>
  );
}

export default Loade1;
