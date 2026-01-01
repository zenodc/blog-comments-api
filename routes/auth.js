const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Credenziali mancanti' });
  }

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: 'Credenziali non valide' });
  }

  const token = jwt.sign(
    {
      username,
      role: 'admin'
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '2h'
    }
  );

  res.json({ token });
});

module.exports = router;
