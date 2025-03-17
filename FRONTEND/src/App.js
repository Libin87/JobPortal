import './App.css';
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/HomePage';
import EmployeePage from './pages/employee/EmployeePage';
import EmployerPage from './pages/employer/EmployerPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import ResetPassword from './pages/ResetPassword';
import AdminPage from './pages/admin/AdminPage';
import ForgotPassword from './pages/ForgotPassword';
import Viewjob from './pages/Viewjob';
import NavbarAdmin from './pages/admin/NavbarAdmin';
import NavbarEmployee from './pages/employee/NavbarEmployee';
import NavbarEmployer from './pages/employer/NavbarEmployer';
import EmployerProfile from './pages/employer/EmployerProfile';
import PostedJobs from './pages/employer/PostedJobs';
import AdminApplicants from './pages/admin/AdminApplicants';
import ManageUsers from './pages/admin/ManageUsers';
import SiteReport from './pages/admin/SiteReport';
import PostedJobsAdmin from './pages/admin/PostedJobsAdmin';
import AdminJobApproval from './pages/admin/AdminJobApproval';
import ApprovedJobs from './pages/employer/ApprovedJobs';
import EmployeeProfile from './pages/employee/EmployeeProfile';
import GoogleLoginComponent from './pages/GoogleLoginComponent';
import ApplicantPage from './pages/employer/ApplicantPage';
import JobApplications from './pages/employee/JobApplications';
import PaymentComponent from './pages/employer/PaymentComponent';
import JobSearchPage from './pages/JobSearchPage';
import CreateTest from './pages/employer/CreateTest';
import TakeTest from './pages/employee/TakeTest';
import Selection from './pages/employer/Selection';
import TestComplete from './pages/employee/TestComplete';
import ContactMessages from './pages/admin/ContactMessages';
import JobSuggestionsPage from './pages/employee/JobSuggestionsPage';
import PaymentManagement from './pages/admin/PaymentManagement';
import AdminNotifications from './pages/admin/AdminNotifications';
import Chat from './pages/chat/Chat';
// Add this to your routes


const ProtectedRoute = ({ redirectPath = '/login', allowedRole }) => {
  const isLoggedIn = sessionStorage.getItem('userId') !== null;
  const userRole = sessionStorage.getItem('role');

  if (!isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  } else if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <div className='App'>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<HomePage />} />
        <Route path='/search' element={<JobSearchPage/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/resetpassword/:token' element={<ResetPassword />} />
        <Route path='/viewjob' element={<Viewjob />} />
        <Route path='/navbar' element={<Navbar />} />
        <Route path='/footer' element={<Footer />} />
        <Route path='/googlelogin' element={<GoogleLoginComponent />} />
        <Route path='/selection' element={<Selection />} />
        <Route path='/contactus' element={<ContactUs />} />

        {/* Protected Routes for Common Pages */}
        <Route element={<ProtectedRoute redirectPath="/" />}>
          <Route path='/about' element={<AboutUs />} />
        </Route>

        {/* Protected Routes for Admin */}
        <Route element={<ProtectedRoute redirectPath="/login" allowedRole="admin" />}>
          <Route path='/adminpage' element={<AdminPage />} />
          <Route path='/adminpage1' element={<AdminApplicants />} />
          <Route path='/manageUsers' element={<ManageUsers />} />
          <Route path='/siteReport' element={<SiteReport />} />
          <Route path='/postedJobsAdmin' element={<PostedJobsAdmin />} />
          <Route path='/adminJobApproval' element={<AdminJobApproval />} />
          <Route path='/navbaradmin' element={<NavbarAdmin />} />
          <Route path='/adminJobAprooval' element={<AdminJobApproval />} />
          <Route path='/contact-messages' element={<ContactMessages />} />
          <Route path='/payment-management' element={<PaymentManagement />} />
          <Route path='/admin-notifications' element={<AdminNotifications />} />
        </Route>

        {/* Protected Routes for Employer */}
        <Route element={<ProtectedRoute redirectPath="/login" allowedRole="employer" />}>
          <Route path='/employerpage' element={<EmployerPage />} />
          <Route path='/employerprofile' element={<EmployerProfile />} />
          <Route path='/postedJobs' element={<PostedJobs />} />
          <Route path='/approvedJobs' element={<ApprovedJobs />} />
          <Route path='/navbaremployer' element={<NavbarEmployer />} />
          <Route path='/Applicants' element={<ApplicantPage />} />
          <Route path='/payment' element={<PaymentComponent/>}/>
          <Route path='/createTest' element={<CreateTest/>}/>
        </Route>

        {/* Protected Routes for Employee */}
        <Route element={<ProtectedRoute redirectPath="/login" allowedRole="employee" />}>
          <Route path='/employeepage' element={<EmployeePage />} />
          <Route path='/navbaremployee' element={<NavbarEmployee />} />
          <Route path='/EmployeeProfile' element={<EmployeeProfile />} />
          <Route path='/jobApplications' element={<JobApplications />} />
          <Route path='/take-test/:testId' element={<TakeTest/>}/>
          <Route path="/test-complete" element={<TestComplete />} />
<Route path="/job-suggestions" element={<JobSuggestionsPage />} />
          // ... in your routes ...
        </Route>

        <Route element={<ProtectedRoute redirectPath="/login" />}>
          <Route path="/chat" element={<Chat />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

