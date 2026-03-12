const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');
const protect = require('../middleware/auth');


router.post('/', protect, async (req, res) => {
  try {
    const { flightNumber, from, to, date, totalSeats, availableSeats, price } = req.body;

    const existingFlight = await Flight.findOne({ flightNumber });
    if (existingFlight) {
      return res.status(400).json({ message: 'Flight number already exists' });
    }

    const flight = await Flight.create({
      flightNumber,
      from,
      to,
      date,
      totalSeats,
      availableSeats,
      price
    });

    res.status(201).json({ message: 'Flight created successfully', flight });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── GET ALL FLIGHTS ─────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── SEARCH FLIGHTS (by from, to, date) ──────────────────
router.get('/search', async (req, res) => {
  try {
    const { from, to, date } = req.query;
    const filter = {};

    if (from) filter.from = { $regex: from, $options: 'i' };
    if (to) filter.to = { $regex: to, $options: 'i' };
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const flights = await Flight.find(filter);
    res.json(flights);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── GET SINGLE FLIGHT ───────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ message: 'Flight not found' });
    res.json(flight);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── UPDATE FLIGHT (Protected) ───────────────────────────
router.put('/:id', protect, async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!flight) return res.status(404).json({ message: 'Flight not found' });
    res.json({ message: 'Flight updated successfully', flight });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── DELETE FLIGHT (Protected) ───────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) return res.status(404).json({ message: 'Flight not found' });
    res.json({ message: 'Flight deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;