import Tasks from "./Tasks"; // Assuming Tasks is imported correctly
import { FaYoutube, FaTelegram } from "react-icons/fa";
import { useState, useEffect } from "react";
import sorry from '../images/sor.png';
import React from 'react';
import { RiTwitterXFill } from "react-icons/ri";
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

const Task: React.FC = () => { 
  const [ip, setIp] = useState('');
  const [disallow, setDisallow] = useState(false);
  const [point, setPoint] = useState(0);
  const [ytSubs, setYtSubs] = useState<{ [key: string]: boolean }>({
    youtubesubscribe: false,
    youtubewatched: false,
    telegrammcom4567: false,
    twitterfollow: false
  });
  const [timerId, setTimerId] = useState<number>(0);

  const [initDataUnsafe] = useInitData() as readonly [InitDataUnsafe | undefined, unknown];

  if (!initDataUnsafe) {
    return <div>No initialization data available. Please ensure you are using the Telegram app.</div>;
  }

  const user = initDataUnsafe.user;

  if (!user) {
    return <div>No user data available. Initialization data: {JSON.stringify(initDataUnsafe)}</div>;
  }
  const UserId = user.id;

  const startTimer = () => {
    const duration = 5 * 60 * 1000; // 5 minutes in milliseconds
    const id = window.setTimeout(() => {
      YtSub('youtubewatched', 20000);
      console.log("Done!"); // Log "Done!" after 5 minutes
    }, duration);
    setTimerId(id);
  };

  const handleWindowClose = () => {
    if (timerId) {
      clearTimeout(timerId);
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleWindowClose);
    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
    };
  }, [timerId]);

  const getIp = async () => {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    setIp(data.country_code);
  };

  useEffect(() => {
    const handleLocalStorage = () => {
      Object.keys(ytSubs).forEach(key => {
        const localStorageValue = localStorage.getItem(key);
        if (localStorageValue === 'true') {
          setYtSubs(prevSubs => ({
            ...prevSubs,
            [key]: true
          }));
        }
      });
    };
    handleLocalStorage();
  }, []);

  useEffect(() => {
    const storedPoints = localStorage.getItem('poinin');
    if (storedPoints) {
      setPoint(parseInt(storedPoints, 10));
    }
  }, []);

  useEffect(() => {
    console.log('Updated points:', point);
  }, [point]);

  const YtSub = async (title: string, score: number) => {
    console.log(title, score);
    console.log('ytsubbbbbbbbb', ytSubs[title]);
    const pointsGained = score;
    if (ytSubs[title] === false) {
      try {
        

        const response = await fetch('/main.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pointsGained , UserId }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Server response:', data);
          setPoint(data.points); // Update the state with the new points from the server
          localStorage.setItem('poinin', data.points); // Update local storage with the new points
        } else {
          console.error('Error fetching data from server');
        }

        localStorage.setItem(title, 'true');
        setYtSubs(prevSubs => ({
          ...prevSubs,
          [title]: true
        }));
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  };

  useEffect(() => {
    getIp();
  }, []);

  useEffect(() => {
    if (ip === 'ET') {
      setDisallow(true);
    }
  }, [ip]);

  return (
    <div>
      {disallow ? (
        <div className="absolute inset-0 h-1/2 fullHeightContainer z-0">
          <img src={sorry} alt="sorry" />
          <p style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '30px', fontFamily: "impact", fontSize: '20px' }}>Content not available in this region.</p>
        </div>
      ) : (
        <div className="fullHeightContainer" style={{ marginBottom: '16px', width: "100vw" }}>
          <a style={{ marginLeft: '18%' }} onClick={() => YtSub('telegrammcom4567', 120000)} href="https://t.me/aureus_coin" target="_blank">
            <Tasks
              title={'Join our community'}
              icon={<FaTelegram style={{ marginBottom: '20px', color: '#0b9be0', fontSize: '75px' }} />}
              reward={'Complete the task and earn 120,000 points!'}
              isDone={ytSubs.telegrammcom4567}
            />
          </a>
          <a style={{ marginLeft: '18%' }} onClick={() => YtSub('youtubesubscribe', 200000)} href="https://www.youtube.com/@NOT_COIN_A?sub_confirmation=1" target="_blank">
            <Tasks
              title={'Subscribe to our YouTube channel'}
              icon={<FaYoutube style={{ marginBottom: '30px', fontSize: '100px', color: 'red' }} />}
              reward={'Complete the task and earn 200,000 points!'}
              isDone={ytSubs.youtubesubscribe}
            />
          </a>
          <a href="https://youtu.be/YwDavU4Pla4?si=4j00T-MfKpXCKYgb" target="_blank" style={{ marginLeft: '5%' }} onClick={() => startTimer()}>
            <Tasks
              title={'Watch our new video to the end'}
              icon={<FaYoutube style={{ marginBottom: '30px', fontSize: '100px', color: 'red' }} />}
              reward={'Complete the task and earn 60,000 points!'}
              isDone={ytSubs.youtubewatched}
            />
          </a>
          <a href="https://x.com/@aureuscoinx" target="_blank" style={{ marginLeft: '5%' }} onClick={() => YtSub('twitterfollow', 50000)}>
            <Tasks
              title={'Follow our Twitter(X) page'}
              icon={<RiTwitterXFill style={{ marginBottom: '15px', fontSize: '80px' }} />}
              reward={'Complete the task and earn 50,000 points!'}
              isDone={ytSubs.twitterfollow}
            />
          </a>
        </div>
      )}
    </div>
  );
};

export default Task;
