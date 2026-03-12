import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Register from './pages/Register'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import Home from './pages/Home'
import BookingHistory from './pages/BookingHistory'

function App() {
  const token = localStorage.getItem('token')

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/bookings" element={token ? <BookingHistory /> : <Navigate to="/login" />} />
      </Routes>
    </>
  )
}

export default App