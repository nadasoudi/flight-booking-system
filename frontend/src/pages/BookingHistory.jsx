import { useState, useEffect } from 'react'
import api from '../api'

function BookingHistory() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my')
      setBookings(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/cancel`)
      setMessage('Booking canceled successfully')
      fetchBookings()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Cancel failed')
    }
  }

  if (loading) return <p style={{ textAlign: 'center', marginTop: '40px' }}>Loading your bookings...</p>

  return (
    <div className="home">
      <h2 style={{ marginBottom: '20px' }}>My Bookings</h2>

      {message && <div className="message success" style={{ marginBottom: '15px' }}>{message}</div>}

      {bookings.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666' }}>You have no bookings yet.</p>
      )}

      {bookings.map((booking) => (
        <div className="booking-card" key={booking._id}>
          <div>
            <h3>{booking.flight?.from} → {booking.flight?.to}</h3>
            <p>Flight: {booking.flight?.flightNumber} &nbsp;|&nbsp; Date: {new Date(booking.flight?.date).toLocaleDateString()}</p>
            <p>Seats: {booking.numberOfSeats} &nbsp;|&nbsp; Total: ${booking.totalPrice}</p>
            <p>Status: <span className={booking.status}>{booking.status}</span></p>
          </div>
          {booking.status === 'confirmed' && (
            <button onClick={() => handleCancel(booking._id)}>Cancel</button>
          )}
        </div>
      ))}
    </div>
  )
}

export default BookingHistory