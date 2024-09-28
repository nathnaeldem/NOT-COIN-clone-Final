import { useEffect, useState } from "react";
import "../index.css";
import Arrow from "../icons/Arrow";
import { bear, coin, highVoltage, notcoin, trophy } from "../images";
import { Link } from "react-router-dom";
import { useHapticFeedback } from "@vkruglikov/react-telegram-web-app";
import wallet from "../images/wallet.png";
import "./Hm.css";
import { useInitData } from "@vkruglikov/react-telegram-web-app";

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

interface Click {
  id: number;
  x: number;
  y: number;
}

const Home = () => {
  const [points, setPoints] = useState<number>(() => {
    const storedPoints = localStorage.getItem("poinin");
    return Number(storedPoints) || 0;
  });

  const [initDataUnsafe] = useInitData() as readonly [
    InitDataUnsafe | undefined,
    unknown
  ];

  if (!initDataUnsafe) {
    return (
      <div>
        No initialization data available. Please ensure you are using the
        Telegram app.
      </div>
    );
  }

  const user = initDataUnsafe.user;

  if (!user) {
    return (
      <div>
        No user data available. Initialization data:{" "}
        {JSON.stringify(initDataUnsafe)}
      </div>
    );
  }

  const UserId = user.id;

  const [energy, setEnergy] = useState<number>(() => {
    const storedEnergy = localStorage.getItem("energy");
    const lastUpdateTime = localStorage.getItem("lastUpdateTime");
    const now = Date.now();

    if (storedEnergy && lastUpdateTime) {
      const energyValue = parseInt(storedEnergy, 10);
      const lastUpdate = parseInt(lastUpdateTime, 10);
      const timeElapsed = Math.floor((now - lastUpdate) / 1000); // Time elapsed in seconds
      const energyGained = Math.min(timeElapsed * 10, 6500); // 10 energy points per second
      return Math.min(energyValue + energyGained, 6500);
    }
    return 2532; // Default starting energy
  });

  const [clicks, setClicks] = useState<Click[]>([]);
  const [level, setLevel] = useState<string>("Plebeians");
  const [clickCount, setClickCount] = useState<number>(0);
  const [impactOccurred] = useHapticFeedback();
  const [showPopup, setShowPopup] = useState(false); // New state for wallet popup
  const pointsToAdd = 12;
  const energyToReduce = 12;

  // Track initial points
  const [initialPoints, setInitialPoints] = useState<number>(points);

  useEffect(() => {
    localStorage.setItem("energy", energy.toString());
    localStorage.setItem("lastUpdateTime", Date.now().toString());
  }, [energy]);

  const getLevel = (points: number): string => {
    if (points < 500000) {
      return "Plebeians";
    } else if (points >= 500000 && points < 5000000) {
      return "Patricians";
    } else {
      return "Senatorial Class";
    }
  };

  const handleClick = async (x: number, y: number) => {
    setClickCount((prevCount) => prevCount + 1);
    impactOccurred("light");

    if (energy - energyToReduce < 0) {
      return;
    }

    if (clickCount % 20 === 0 && clickCount !== 0) {
      const pointsGained = points - initialPoints; // Calculate the points gained since last submission
      console.log(pointsGained);
      try {
        const response = await fetch("main.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pointsGained, UserId }),
        });
        

        if (response.ok) {
          const data = await response.json();
          console.log("Server response:", data);
          setInitialPoints(points); // Update initial points after successful submission
        } else {
          console.error("Error fetching data from server");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }

    setPoints((prevPoints) => {
      const newPoints = prevPoints + pointsToAdd;
      localStorage.setItem("poinin", newPoints.toString());
      return newPoints;
    });

    setEnergy((prevEnergy) =>
      prevEnergy - energyToReduce < 0 ? 0 : prevEnergy - energyToReduce
    );

    setClicks((prevClicks) => [...prevClicks, { id: Date.now(), x, y }]);
    setLevel(getLevel(points + pointsToAdd)); // Update level immediately after click
  };

  const handleMouseClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    handleClick(x, y);
  };

  const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    Array.from(e.touches).forEach((touch) => {
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      handleClick(x, y);
    });
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };

  // useEffect hook to restore energy over time
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => {
        const newEnergy = Math.min(prevEnergy + 10, 6500); // Restore 10 energy points every second
        localStorage.setItem("energy", newEnergy.toString());
        localStorage.setItem("lastUpdateTime", Date.now().toString());
        return newEnergy;
      });
    }, 1000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const handleWalletClick = () => {
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
  };

  return (
    <div>
      <div className="absolute inset-0 h-1/2 bg-gradient-overlay z-0"></div>
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="radial-gradient-overlay"></div>
      </div>

      <div className="w-full z-10 min-h-screen flex flex-col items-center text-white">
        <Link to="/admin">
          <div className="fixed top-0 left-0 w-full px-4 pt-8 z-10 flex flex-col items-center text-white">
            <div className="w-full cursor-pointer">
              <div className="bg-[#1f1f1f] text-center py-2 rounded-xl">
                <p style={{ fontWeight: "bold" }} className="text-lg">
                <strong style={{fontWeight:"bolder",fontSize:"20px"}}>🎁</strong> Weekly winners
                  <Arrow size={18} className="ml-0 mb-1 inline-block" />
                </p>
              </div>
            </div>

            <div className="mt-12 text-5xl font-bold flex items-center">
              <img src={coin} width={44} height={44} />
              <span className="ml-2">{points.toLocaleString()}</span>
            </div>
            <div className="text-base mt-2 flex items-center">
              <img src={trophy} width={24} height={24} />
              <span className="ml-1">
                {level} <Arrow size={18} className="ml-0 mb-1 inline-block" />
              </span>
            </div>
          </div>
        </Link>

        <div
          style={{ background: "transparent" }}
          className="fixed bottom-0 left-0 w-full px-4 pb-4 z-10"
        >
          <div className="w-full flex justify-between gap-2">
            <div className="w-1/3 flex items-center justify-start max-w-32">
              <div className="flex items-center justify-center">
                <img
                  src={highVoltage}
                  width={44}
                  height={44}
                  alt="High Voltage"
                />
                <div className="ml-2 text-left">
                  <span className="text-white text-2xl font-bold block">
                    {energy}
                  </span>
                  <span className="text-white text-large opacity-75">
                    / 6500
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-grow flex items-center max-w-60 text-sm">
              <div
                style={{ boxShadow: " 0 2px 4px #ab5463" }}
                className="w-full bg-[#fad258] py-4 rounded-2xl flex justify-around"
              >
                <button className="flex flex-col items-center gap-1">
                  <Link to="/ref">
                    <img src={bear} width={24} height={24} alt="High Voltage" />
                    <span>Frens</span>
                  </Link>
                </button>

                <div className="h-[48px] w-[2px] bg-[#fddb6d]"></div>
                <button className="flex flex-col items-center gap-1">
                  <Link to="/Task">
                    <img src={coin} width={24} height={24} alt="High Voltage" />
                    <span>Tasks</span>
                  </Link>
                </button>

                <div className="h-[48px] w-[2px] bg-[#fddb6d]"></div>

                <button
                  className="flex flex-col items-center gap-1"
                  onClick={handleWalletClick}
                >
                  <img src={wallet} width={24} height={24} alt="High Voltage" />
                  <span>Wallet</span>
                </button>
              </div>
            </div>
          </div>
          <div className="w-full bg-[#f9c035] rounded-full mt-4">
            <div
              className="bg-gradient-to-r from-[#f3c45a] to-[#fffad0] h-4 rounded-full"
              style={{ width: `${(energy / 6500) * 100}%` }}
            ></div>
          </div>
        </div>

        <div
          className="flex-grow flex items-center justify-center"
          onMouseDown={handleMouseClick}
          onTouchStart={handleTouch}
        >
          <div className="relative mt-4">
            <img src={notcoin} width={256} height={256} alt="notcoin" />
            {clicks.map((click) => (
              <div
                key={click.id}
                className="absolute text-5xl font-bold opacity-0"
                style={{
                  top: `${click.y - 256}px`, // Adjusting to be above the current vertical coordinate
                  left: `${click.x - 28}px`,
                  animation: `float 1s ease-out`,
                }}
                onAnimationEnd={() => handleAnimationEnd(click.id)}
              >
                12
              </div>
            ))}
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <p>Coming soon, collect more scores!</p>
        </div>
      )}
    </div>
  );
};

export default Home;
