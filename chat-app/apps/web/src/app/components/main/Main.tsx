import { Route, Routes } from 'react-router-dom';
import PageNotFound from './page-not-found/PageNotFound';
import Home from './home/Home';
import Chat from './chat/Chat';
import Profile from './profile/Profile';
import About from './about/About';
import Register from './register/Register';
import Login from './login/Login';

import './Main.scss';

const Main = () => {
  return (
    <div className="main sm-col-12 col-lg-9">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default Main;
