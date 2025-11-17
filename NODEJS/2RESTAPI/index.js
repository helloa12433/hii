// index.js
const express = require("express");
const app = express();

app.use(express.json()); // body parser for JSON

// In-memory card store
let cards = [
  { id: 1, suit: "Hearts", value: "Ace" },
  { id: 2, suit: "Spades", value: "King" },
  { id: 3, suit: "Diamonds", value: "Queen" }
];

// Helper to get next id
function getNextId() {
  return cards.length === 0 ? 1 : Math.max(...cards.map(c => c.id)) + 1;
}

// GET /cards  -> return all cards
app.get("/cards", (req, res) => {
  res.json(cards);
});

// GET /cards/:id -> return single card or 404
app.get("/cards/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const card = cards.find(c => c.id === id);
  if (!card) {
    return res.status(404).json({ error: `Card with ID ${id} not found` });
  }
  res.json(card);
});

// POST /cards -> create card, expects { suit, value }
app.post("/cards", (req, res) => {
  const { suit, value } = req.body;
  if (!suit || !value) {
    return res.status(400).json({ error: "Both 'suit' and 'value' are required" });
  }

  const newCard = {
    id: getNextId(),
    suit: String(suit),
    value: String(value)
  };
  cards.push(newCard);
  res.status(201).json(newCard);
});

// DELETE /cards/:id -> remove card and return removed card or 404
app.delete("/cards/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = cards.findIndex(c => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: `Card with ID ${id} not found` });
  }
  const removed = cards.splice(idx, 1)[0];
  res.json({ message: `Card with ID ${id} removed`, card: removed });
});

// Optional: allow resetting data (dev helper)
app.post("/__reset", (req, res) => {
  cards = [
    { id: 1, suit: "Hearts", value: "Ace" },
    { id: 2, suit: "Spades", value: "King" },
    { id: 3, suit: "Diamonds", value: "Queen" }
  ];
  res.json({ message: "Reset to initial cards", cards });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Playing cards API running on http://localhost:${PORT}`);
});
