import React from 'react'
import { Route, Routes } from 'react-router-dom'
import './index.css'
import styles from './components/Navbar'

import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Registraion from './pages/Registration'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointment from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Footer from './components/Footer'
import Admin from './pages/AdminLogin'
import UserList from './pages/UserList'
import AdminDashboard from './pages/AdminDashboard'
import UserPanel from './pages/UserPanel'
import DoctorPanel from './pages/DoctorPanel'
import DoctorProfile from './pages/DoctorProfile'
import DoctorAppointments from './pages/DoctorAppointments'
import UserLayout from './layouts/UserLayout'
import NewAppointment from './pages/NewAppointment'
import DoctorTomography from './pages/DoctorTomography'
import DoctorTomographyUpload from './pages/DoctorTomographyUpload'
import DoctorPatientResults from './pages/DoctorPatientResults'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Routes>
        <Route path='/' element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />
        <Route path='/doctors' element={
          <>
            <Navbar />
            <Doctors />
            <Footer />
          </>
        } />
        <Route path='/doctors/:speciality' element={
          <>
            <Navbar />
            <Doctors />
            <Footer />
          </>
        } />
        <Route path='/AdminLogin' element={
          <>
            <Navbar />
            <Admin />
            <Footer />
          </>
        } />
        <Route path='/registration' element={
          <>
            <Navbar />
            <Registraion />
            <Footer />
          </>
        } />
        <Route path='UserList' element={
          <>
            <Navbar />
            <UserList />
            <Footer />
          </>
        } />
        <Route path='/login' element={
          <>
            <Navbar />
            <Login />
            <Footer />
          </>
        } />
        <Route path="/admin/dashboard" element={
          <>
            <Navbar />
            <AdminDashboard />
            <Footer />
          </>
        } />
        <Route path="/user-panel" element={<UserLayout />}>
          <Route index element={<UserPanel />} />
          <Route path="appointments" element={<MyAppointment />} />
          <Route path="appointments/new" element={<NewAppointment />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="doctors" element={<Doctors />} />
        </Route>
        <Route path="/doctor-panel" element={<DoctorPanel />} />
        <Route path="/doctor-panel/profile" element={<DoctorProfile />} />
        <Route path="/doctor-panel/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor-panel/tomography" element={<DoctorTomography />} />
        <Route path="/doctor-panel/tomography/upload" element={<DoctorTomographyUpload />} />
        <Route path="/doctor/tomography/upload/:userId" element={<DoctorTomographyUpload />} />
        <Route path="/doctor/patient-results" element={<DoctorPatientResults />} />
        <Route path='/about' element={
          <>
            <Navbar />
            <About />
            <Footer />
          </>
        } />
        <Route path='/contact' element={
          <>
            <Navbar />
            <Contact />
            <Footer />
          </>
        } />
        <Route path='/my-profile' element={
          <>
            <Navbar />
            <MyProfile />
            <Footer />
          </>
        } />
        <Route path='/my-appointments' element={
          <>
            <Navbar />
            <MyAppointment />
            <Footer />
          </>
        } />
        <Route path='/appointment/:docId' element={
          <>
            <Navbar />
            <Appointment />
            <Footer />
          </>
        } />
      </Routes>
    </div>
  )
}

export default App