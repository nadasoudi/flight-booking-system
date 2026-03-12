import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

function Home() {
  const navigate = useNavigate()
  const [flights, setFlights] = useState([])
  const [search, setSearch] = useState({ from: '', to: '', date: '' })
  const [loading, setLoading] = useState(false)
  const [bookingMsg, setBookingMsg] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchFlights()
  }, [])

  const fetchFlights = async () => {
    setLoading(true)
    try {
      const res = await api.get('/flights')
      setFlights(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    setLoading(true)
    setBookingMsg('')
    try {
      const params = new URLSearchParams()
      if (search.from) params.append('from', search.from)
      if (search.to) params.append('to', search.to)
      if (search.date) params.append('date', search.date)
      const res = await api.get(`/flights/search?${params.toString()}`)
      setFlights(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

const [seats, setSeats] = useState({})

const handleBook = async (flightId) => {
  if (!token) {
    navigate('/login')
    return
  }
  const numberOfSeats = seats[flightId] || 1
  try {
    await api.post('/bookings', { flightId, numberOfSeats })
    setBookingMsg('Flight booked successfully! ')
    fetchFlights()
  } catch (err) {
    setBookingMsg(err.response?.data?.message || 'Booking failed')
  }
}

  return (
    <div className="home">
      <h2 style={{ marginBottom: '20px' }}>Search Flights</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="From (e.g. Dubai)"
          value={search.from}
          onChange={(e) => setSearch({ ...search, from: e.target.value })}
        />
        <input
          type="text"
          placeholder="To (e.g. Cairo)"
          value={search.to}
          onChange={(e) => setSearch({ ...search, to: e.target.value })}
        />
        <input
          type="date"
          value={search.date}
          onChange={(e) => setSearch({ ...search, date: e.target.value })}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={fetchFlights} style={{ backgroundColor: '#6b7280' }}>
          Show All
        </button>
      </div>

      {bookingMsg && (
        <div className={`message ${bookingMsg.includes('✅') ? 'success' : 'error'}`}>
          {bookingMsg}
        </div>
      )}

      {loading && <p style={{ textAlign: 'center' }}>Loading flights...</p>}

      {!loading && flights.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666' }}>No flights found.</p>
      )}

  {flights.map((flight) => (
  <div className="flight-card" key={flight._id}>
    <div className="flight-info">
      <h3>{flight.from} → {flight.to}</h3>
      <p>Flight: {flight.flightNumber} &nbsp;|&nbsp; Date: {new Date(flight.date).toLocaleDateString()}</p>
      <p>Available Seats: {flight.availableSeats} &nbsp;|&nbsp; Price: ${flight.price}</p>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <input
        type="number"
        min="1"
        max={flight.availableSeats}
        value={seats[flight._id] || 1}
        onChange={(e) => setSeats({ ...seats, [flight._id]: parseInt(e.target.value) })}
        style={{ width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
      />
      <button onClick={() => handleBook(flight._id)}>Book</button>
    </div>
  </div>
))}
    </div>
  )
}

export default Home