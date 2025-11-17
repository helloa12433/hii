const jwt = require("jsonwebtoken");
const SECRET_KEY = "mySecretKey";

exports.login = (req, res) => {
  const { id, username, password, role } = req.body;

  // Simple static check
  if (!username || !password || !role) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  // Just assume valid user for demo
  const token = jwt.sign(
    { id, username, role },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.status(200).json({ token });
};
