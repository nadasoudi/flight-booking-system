import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav>
      <Link to="/" style={{ fontSize: '20px', fontWeight: 'bold' }}>✈️ FlightBooker</Link>
      <div>
        {token ? (
          <>
            <span style={{ color: 'white', marginRight: '15px' }}>Hi, {user?.name}</span>
            <Link to="/">Search Flights</Link>
            <Link to="/bookings">My Bookings</Link>
            <button
              onClick={handleLogout}
              style={{
                marginLeft: '20px',
                padding: '8px 16px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar