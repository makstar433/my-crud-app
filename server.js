const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/my-crud-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
});

const db = mongoose.connection;
db.on('error', (error) => {
  console.error('Connection to Database Failed:', error.message);
});
db.once('open', () => {
  console.log('Connected to Database');
});


const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model('Item', itemSchema);

app.use(express.static(path.join(__dirname)));

app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/items', async (req, res) => {
  const item = new Item({
    name: req.body.name,
    description: req.body.description,
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.param('id', async (req, res, next, id) => {
  try {
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    req.item = item;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.get('/items/:id', (req, res) => {
  res.json(req.item);
});

app.put('/items/:id', async (req, res) => {
  if (req.body.name != null) {
    req.item.name = req.body.name;
  }

  if (req.body.description != null) {
    req.item.description = req.body.description;
  }

  try {
    const updatedItem = await req.item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    await req.item.remove();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});