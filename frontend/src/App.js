import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './common/Home';
import Login from './common/Login';
import Reset_Email from './common/Reset_Email';
import Reset_Password from './common/Reset_Password';
import DashBoard from './common/DashBoard';

function App() {
  const location = useLocation(); // Only use location here, no need for Router in App.js

  return (
    <div className="App">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-email" element={<Reset_Email />} />
        <Route path="/reset-pass" element={<Reset_Password/>} />
        <Route path="/dashboard" element={<DashBoard/>} />
      </Routes>

      <div className="footer">
        <h6>Department of Information Technology - University of Sri Jayewardenepura</h6>
      </div>
    </div>
  );
}

export default App;
