import { User } from "../models/User.js";

// Create sample users
export const createUsers = async (req, res) => {
  try {
    await User.deleteMany({});
    const users = await User.insertMany([
      { name: "Alice", balance: 1000 },
      { name: "Bob", balance: 500 }
    ]);
    res.status(201).json({ message: "Users created", users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Transfer money logic
export const transferMoney = async (req, res) => {
  try {
    const { senderName, receiverName, amount } = req.body;

    // Validate input
    if (!senderName || !receiverName || !amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const sender = await User.findOne({ name: senderName });
    const receiver = await User.findOne({ name: receiverName });

    if (!sender || !receiver) {
      return res.status(404).json({ error: "Sender or receiver not found" });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Update balances sequentially
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    res.json({
      message: "Transfer successful",
      sender: { name: sender.name, balance: sender.balance },
      receiver: { name: receiver.name, balance: receiver.balance }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
