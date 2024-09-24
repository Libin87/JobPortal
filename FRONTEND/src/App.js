import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/HomePage';
import EmployeePage from './pages/employee/EmployeePage';
import EmployerPage from './pages/employer/EmployerPage'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import ResetPassword from './pages/ResetPassword';
import AdminPage from './pages/admin/AdminPage';
import ForgotPassword from './pages/ForgotPassword';
import Viewjob from './pages/Viewjob'
import NavbarAdmin from './pages/admin/NavbarAdmin';
import NavbarEmployee from './pages/employee/NavbarEmployee';
import NavbarEmployer from './pages/employer/NavbarEmployer';
import EmployerProfile from './pages/employer/EmployerProfile';
function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/navbar' element={<Navbar/>}/>
        <Route path='/footer' element={<Footer/>}/>
        <Route path='/contactus' element={<ContactUs/>}/>
        <Route path='/about' element={<AboutUs/>}/>

        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/forgotpassword' element={<ForgotPassword/>}/>
        <Route path="/user/resetpassword/:token" element={<ResetPassword />} />

        <Route path='/' element={<HomePage/>}/>
        <Route path='/viewjob' element={<Viewjob/>}/>

        <Route path='/employeepage' element={<EmployeePage/>}/>

        <Route path='/employerpage' element={<EmployerPage/>}/>
        <Route path='/employerprofile' element={<EmployerProfile/>}/>

        <Route path='/adminpage' element={<AdminPage/>}/>

        <Route path='/navbaradmin' element={<NavbarAdmin/>}/>
        <Route path='/navbaremployer' element={<NavbarEmployer/>}/>
        <Route path='/navbaremployee' element={<NavbarEmployee/>}/>

      </Routes>
    </div>
  );
}

export default App;
