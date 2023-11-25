import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';

// pages & components
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile'
import StaffSignup from './pages/StaffSignup'

function App() {
  return (
    <div className="App">
      <header className="Skyhub">
        <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route path='/' element= {<Home />} ></Route>
            <Route path='/login' element= {<Login />} ></Route>
            <Route path='/signup' element= {<Signup />} ></Route>
            <Route path='/profile' element= {<Profile />} ></Route>
            <Route path='/staffsignup' element= {<StaffSignup />} ></Route>
          </Routes>
        </div>
      </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
