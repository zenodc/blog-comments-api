const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const app = express();
const postsRoutes = require('./routes/posts');

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);

app.get('/', (req, res) => {
  res.send('Blog API is running');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connesso'))
  .catch(err => console.error('Errore connessione MongoDB:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
