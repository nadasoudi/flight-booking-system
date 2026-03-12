const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const protect = require('../middleware/auth');
router.post('/', protect, async (req, res) => {
  try {
    const { flightId, numberOfSeats } = req.body;
    const seats = numberOfSeats || 1;

    
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    
    if (flight.availableSeats < seats) {
      return res.status(400).json({ 
        message: `Only ${flight.availableSeats} seats available` 
      });
    }

    
    const totalPrice = flight.price * seats;

    
    flight.availableSeats -= seats;
    await flight.save();

    
    const booking = await Booking.create({
      user: req.user.id,
      flight: flightId,
      numberOfSeats: seats,
      totalPrice,
      status: 'confirmed'
    });

    res.status(201).json({ message: 'Flight booked successfully!', booking });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('flight', 'flightNumber from to date price availableSeats');

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status === 'canceled') {
      return res.status(400).json({ message: 'Booking already canceled' });
    }

    
    const flight = await Flight.findById(booking.flight);
    if (flight) {
      flight.availableSeats += booking.numberOfSeats;
      await flight.save();
    }

    booking.status = 'canceled';
    await booking.save();

    res.json({ message: 'Booking canceled successfully', booking });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;