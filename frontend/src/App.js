import logo from './logo.svg';
import './App.css';
import Home from './common/Home';
import Login from './common/Login';
import Reset_Email from './common/Reset_Email'
import Reset_Password from './common/Reset_Password'
import Otp from './common/Otp'
import StRegister from './student/StRegister';
import LecRegister from './lecturer/LecRegister';


function App() {
  return (
    <div className="App">
      <Home/>
      <Login/>
      <Reset_Email/>
      <Reset_Password/>
      <Otp/>
      <StRegister/>


      <div className='footer'>
        <h6>Department of information Technology - University of Sri Jayewardenepura</h6>
      </div>
    </div>
  );
}

export default App;
