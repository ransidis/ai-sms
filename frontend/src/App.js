import './App.css';
import { Route, Routes, useLocation, BrowserRouter as Router, Navigate } from 'react-router-dom';
import Home from './common/Home';
import Login from './common/Login';
import ResetEmail from './common/ResetEmail';
import ResetPassword from './common/ResetPassword';
import NewsDashboard from './News/NewsDashboard';
import SingleNewsView from './News/SingleNewsView'; // Import SingleNewsView
import EditNewsView from './News/EditNewsView'; // Import EditNewsView

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
import AddNews from './News/AddNews';

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
            <Route path="/reset-email" element={<ResetEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />
           
            <Route path="/news" element={<NewsDashboard />} />
            <Route path="/news/:id" element={<SingleNewsView />} /> {/* Add route for SingleNewsView */}
            <Route path="/add-news" element={<AddNews />} />
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
            <Route path="/edit-news/:id" element={isLoggedIn ? <EditNewsView /> : <Navigate to="/login" />} /> {/* Add route for EditNewsView */}
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