import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './common/Home';
import Login from './common/Login';
import Reset_Email from './common/Reset_Email';
import Reset_Password from './common/Reset_Password';
import DashBoard from './common/DashBoard';
import Profile from './common/Profile';
import RequestLetter from './student/RequestLetter';
import Container from 'react-bootstrap/Container';
import Letter from './HOD/Letter';
import NewsDashboard from './News/NewsDashboard';
import AddEditNews from './News/AddEditnews';
import SingleNewsView from './News/SingeNewsView';
import Header from './common/Header';
import BulkUpload from './HOD/BulkUpload';

function App() {
  const location = useLocation();

  return (
    <div className="App">
    <Container className='d-flex flex-column justify-content-between vh-90 mt-5'>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-email" element={<Reset_Email />} />
        <Route path="/reset-pass" element={<Reset_Password/>} />
        <Route path="/dashboard" element={<><Header /><DashBoard/></>} />
        <Route path="/profile" element={<><Header /><Profile/></>} />
        <Route path="/letter-request" element={<><Header /><RequestLetter/></>} />
        <Route path="/letter" element={<><Header /><Letter/></>} />
        <Route path="/news-edit" element={<AddEditNews/>} />
        <Route path="/news" element={<><Header /><NewsDashboard /></>}/>
        <Route path="/addusers" element={<><Header /><BulkUpload/></>}/>
      </Routes>
    </Container>

      <div className="footer">
        <h6>Department of Information Technology - University of Sri Jayewardenepura</h6>
      </div>
    </div>
  );
}

export default App;
