import './App.css';
import { Route, Routes, useLocation, BrowserRouter as Router, Navigate } from 'react-router-dom';
import Home from './common/Home';
import Login from './common/Login';
import Reset_Email from './common/Reset_Email';
import Reset_Password from './common/Reset_Password';
import Container from 'react-bootstrap/Container';
import NewsDashboard from './News/NewsDashboard';
import AddEditNews from './News/AddEditnews';
import SingleNewsView from './News/SingeNewsView';
import BulkUpload from './HOD/BulkUpload';
import Header from './common/Header';

// HOD
import HODDashboard from './HOD/HODDashboard';

// Students
import StudentDashboard from './student/StudentDashboard';
import StudentProfile from './student/StudentProfile';

// Lecturers
import LecturerDashboard from './lecturer/LecturerDashboard';
import LecturerProfile from './lecturer/LecturerProfile';
import RequestLetter from './student/RequestLetter';

function App() {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="App">
      <div className="content">
        <Container className='d-flex flex-column justify-content-between vh-90 mt-5'>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-email" element={<Reset_Email />} />
            <Route path="/reset-pass" element={<Reset_Password />} />
            <Route path="/news-edit" element={<AddEditNews />} />
            <Route path="/news" element={<NewsDashboard />} />
            <Route path="/addusers" element={<BulkUpload />} />
            <Route path="/letter-requests" element={<RequestLetter />} />
            <Route path="/hod-dashboard" element={isLoggedIn ? <><Header /><HODDashboard /></> : <Navigate to="/login" />} />
            <Route path="/student-dashboard" element={isLoggedIn ? <><Header /><StudentDashboard /></> : <Navigate to="/login" />} />
            <Route path="/lecturer-dashboard" element={isLoggedIn ? <><Header /><LecturerDashboard /></> : <Navigate to="/login" />} />
            <Route path="/student-profile" element={isLoggedIn ? <><Header /><StudentProfile /></> : <Navigate to="/login" />} />
            <Route path="/lecturer-profile" element={isLoggedIn ? <><Header /><LecturerProfile /></> : <Navigate to="/login" />} />
          </Routes>
        </Container>
      </div>
      <div className="footer">
        <h6>Department of Information Technology - University of Sri Jayewardenepura</h6>
      </div>
    </div>
  );
}

export default App;