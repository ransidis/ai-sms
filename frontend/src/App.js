import './App.css';
import { Route, Routes, useLocation, BrowserRouter as Router, Navigate } from 'react-router-dom';
import Home from './common/Home';
import Login from './common/Login';
import Reset_Email from './common/Reset_Email';
import Reset_Password from './common/Reset_Password';
import NewsDashboard from './News/NewsDashboard';
import AddEditNews from './News/AddEditnews';
import SingleNewsView from './News/SingeNewsView';
import BulkUpload from './HOD/BulkUpload';
import Header from './common/Header';
import SearchStudents from './lecturer/SearchStudents';

// HOD
import HODDashboard from './HOD/HODDashboard';
import DisplayLetter from './HOD/DisplayLetter';
import EditLetter from './HOD/EditLetter';

// Students
import StudentDashboard from './student/StudentDashboard';
import StudentProfile from './student/StudentProfile';
import RequestLetter from './student/RequestLetter';

// Lecturers
import LecturerDashboard from './lecturer/LecturerDashboard';
import LecturerProfile from './lecturer/LecturerProfile';

function App() {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="App">
      <div className='d-flex flex-column min-vh-100'>
        {location.pathname !== '/' && location.pathname !== '/login' && <Header />}
        <div className="content flex-grow-1">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-email" element={<Reset_Email />} />
            <Route path="/reset-pass" element={<Reset_Password />} />
            <Route path="/news-edit" element={<AddEditNews />} />
            <Route path="/news" element={<NewsDashboard />} />
            <Route path="/addusers" element={<BulkUpload />} />
            
            <Route path="/hod-dashboard" element={isLoggedIn ? <HODDashboard /> : <Navigate to="/login" />} />
            <Route path="/student-dashboard" element={isLoggedIn ? <StudentDashboard /> : <Navigate to="/login" />} />
            <Route path="/lecturer-dashboard" element={isLoggedIn ? <LecturerDashboard /> : <Navigate to="/login" />} />
            <Route path="/student-profile" element={isLoggedIn ? <StudentProfile /> : <Navigate to="/login" />} />
            <Route path="/lecturer-profile" element={isLoggedIn ? <LecturerProfile /> : <Navigate to="/login" />} />
            <Route path="/search-students" element={isLoggedIn ? <SearchStudents /> : <Navigate to="/login" />} />
            <Route path="/request-letter" element={isLoggedIn ? <RequestLetter /> : <Navigate to="/login" />} />
            <Route path="/letter-requests" element={isLoggedIn ? <DisplayLetter /> : <Navigate to="/login" />} />
            <Route path="/edit/:id" element={isLoggedIn ? <EditLetter /> : <Navigate to="/login" />} />
          </Routes>
        </div>
        <div className="footer">
          <h6>Department of Information Technology - University of Sri Jayewardenepura</h6>
        </div>
      </div>
    </div>
  );
}

export default App;