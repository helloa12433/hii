// index.js
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

/**
 Seat model:
 {
   id: Number,
   status: 'available' | 'locked' | 'booked',
   lockToken: string | null,
   lockExpiresAt: number | null, // epoch ms
   lockTimeoutId: Timeout | null
 }
*/

// Create initial seats (1..10)
const NUM_SEATS = 10;
let seats = Array.from({ length: NUM_SEATS }, (_, i) => ({
  id: i + 1,
  status: 'available',
  lockToken: null,
  lockExpiresAt: null,
  lockTimeoutId: null
}));

const LOCK_TTL_MS = 60 * 1000; // 1 minute

// Helper: refresh seat state by clearing an expired lock (synchronously)
function refreshSeatState(seat) {
  if (seat.status === 'locked' && seat.lockExpiresAt) {
    if (Date.now() >= seat.lockExpiresAt) {
      // lock expired -> release
      clearTimeoutSafe(seat.lockTimeoutId);
      seat.status = 'available';
      seat.lockToken = null;
      seat.lockExpiresAt = null;
      seat.lockTimeoutId = null;
    }
  }
}

// Helper: clear timeout safely
function clearTimeoutSafe(id) {
  try {
    if (id) clearTimeout(id);
  } catch (e) {
    // ignore
  }
}

// GET /seats -> list all seats
app.get('/seats', (req, res) => {
  // Refresh all seats before returning
  seats.forEach(refreshSeatState);

  // Return minimal info: id and status and expiresAt when locked
  const out = seats.map(s => ({
    id: s.id,
    status: s.status,
    lockExpiresAt: s.lockExpiresAt ? new Date(s.lockExpiresAt).toISOString() : null
  }));
  res.json(out);
});

// GET /seats/:id -> single seat info
app.get('/seats/:id', (req, res) => {
  const id = Number(req.params.id);
  const seat = seats.find(s => s.id === id);
  if (!seat) return res.status(404).json({ error: `Seat ${id} not found` });

  refreshSeatState(seat);

  res.json({
    id: seat.id,
    status: seat.status,
    lockExpiresAt: seat.lockExpiresAt ? new Date(seat.lockExpiresAt).toISOString() : null
  });
});

// POST /lock/:id -> lock a seat (if available). returns token.
app.post('/lock/:id', (req, res) => {
  const id = Number(req.params.id);
  const seat = seats.find(s => s.id === id);
  if (!seat) return res.status(404).json({ error: `Seat ${id} not found` });

  // refresh state (auto-release expired lock)
  refreshSeatState(seat);

  if (seat.status === 'booked') {
    return res.status(400).json({ message: `Seat ${id} is already booked` });
  }
  if (seat.status === 'locked') {
    return res.status(400).json({ message: `Seat ${id} is already locked` });
  }

  // atomically lock the seat (no awaits in between)
  const token = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
  seat.status = 'locked';
  seat.lockToken = token;
  seat.lockExpiresAt = Date.now() + LOCK_TTL_MS;

  // create timeout to auto-release after TTL
  seat.lockTimeoutId = setTimeout(() => {
    // Only release if still locked and token unchanged
    if (seat.status === 'locked' && seat.lockToken === token) {
      seat.status = 'available';
      seat.lockToken = null;
      seat.lockExpiresAt = null;
      seat.lockTimeoutId = null;
      // Note: no external notification; client must re-check
    }
  }, LOCK_TTL_MS);

  res.json({
    message: `Seat ${id} locked successfully. Confirm within ${LOCK_TTL_MS / 1000} seconds.`,
    id,
    token,
    lockExpiresAt: new Date(seat.lockExpiresAt).toISOString()
  });
});

// POST /confirm/:id -> confirm the booking for a locked seat. Requires { token } in JSON body.
app.post('/confirm/:id', (req, res) => {
  const id = Number(req.params.id);
  const { token } = req.body || {};

  const seat = seats.find(s => s.id === id);
  if (!seat) return res.status(404).json({ error: `Seat ${id} not found` });

  // refresh state (auto-release expired lock)
  refreshSeatState(seat);

  if (seat.status !== 'locked') {
    return res.status(400).json({ message: `Seat ${id} is not locked and cannot be booked` });
  }

  if (!token || token !== seat.lockToken) {
    return res.status(400).json({ message: 'Invalid or missing token. Cannot confirm booking.' });
  }

  // Confirm (atomically)
  clearTimeoutSafe(seat.lockTimeoutId);
  seat.lockTimeoutId = null;
  seat.lockToken = null;
  seat.lockExpiresAt = null;
  seat.status = 'booked';

  res.json({ message: `Seat ${id} booked successfully!`, id });
});

// POST /unlock/:id -> optional: release a lock (if same token). Accepts { token } in body.
// Useful for manual cancelling by the locker.
app.post('/unlock/:id', (req, res) => {
  const id = Number(req.params.id);
  const { token } = req.body || {};
  const seat = seats.find(s => s.id === id);
  if (!seat) return res.status(404).json({ error: `Seat ${id} not found` });

  refreshSeatState(seat);

  if (seat.status !== 'locked') {
    return res.status(400).json({ message: `Seat ${id} is not locked` });
  }

  if (!token || token !== seat.lockToken) {
    return res.status(400).json({ message: 'Invalid or missing token. Cannot unlock.' });
  }

  clearTimeoutSafe(seat.lockTimeoutId);
  seat.lockTimeoutId = null;
  seat.lockToken = null;
  seat.lockExpiresAt = null;
  seat.status = 'available';

  return res.json({ message: `Seat ${id} unlocked successfully` });
});

// Dev helper: reset seats to initial state
app.post('/__reset', (req, res) => {
  // clear running timeouts
  seats.forEach(s => clearTimeoutSafe(s.lockTimeoutId));
  seats = Array.from({ length: NUM_SEATS }, (_, i) => ({
    id: i + 1,
    status: 'available',
    lockToken: null,
    lockExpiresAt: null,
    lockTimeoutId: null
  }));
  res.json({ message: 'Reset seats', seats: seats.map(s => ({ id: s.id, status: s.status })) });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Seat booking API running at http://localhost:${PORT}`);
  console.log(`GET /seats  | POST /lock/:id  | POST /confirm/:id`);
});
