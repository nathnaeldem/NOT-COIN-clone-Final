import './index.css';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './Components/Home';
import Ref from './Components/Ref';
import Task from './Components/Task';
import Loade1 from './Components/Loade';
import Admin from './Components/Admin';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import TelegramUsername from './Components/userId';

const App = () => {
  return (
    <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium">
      <HashRouter>
        <BackButtonWrapper />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/ref" element={<Ref />} />
          <Route path="/Task" element={<Task />} />
          <Route path="/:refid" element={<Loade1 />} />
          <Route path="/admin" element={<Admin />} />
          <Route path='/.' element={<TelegramUsername/>} />
        </Routes>
      </HashRouter>
    </div>
  );
};

const BackButtonWrapper = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 left-0 m-4">
      <BackButton onClick={() => navigate('/home')} />
    </div>
  );
};

export default App;
