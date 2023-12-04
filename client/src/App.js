import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// pages & components
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile'
import StaffSignup from './pages/StaffSignup'
import Spending from './pages/Spending';
import Manage from './pages/Manage';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));
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
            <Route path='/spending' element= {<Spending />} ></Route>
            <Route path='/manage' element= {<Manage />} ></Route>
          </Routes>
        </div>
      </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
