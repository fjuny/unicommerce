const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const url = 'mongodb://localhost:27017';
const dbName = 'unicommerceapp';
let db;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) return console.error(err);
  db = client.db(dbName);
  console.log(`Connected to database ${dbName}`);
});

const corsOptions = {
  origin: 'http://localhost:3000',  // Adjust this to your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

app.get('/fyp/unicommerceapp/GetSupplier', async (req, res) => {
  const suppliers = await db.collection('suppliers').find().toArray();
  res.json(suppliers);
});

app.post('/fyp/unicommerceapp/AddSupplier', async (req, res) => {
  const { newSupplier } = req.body;
  await db.collection('suppliers').insertOne(newSupplier);
  res.sendStatus(201);
});

app.put('/fyp/unicommerceapp/EditSupplier/:id', async (req, res) => {
  const { id } = req.params;
  const { desc } = req.body;
  await db.collection('suppliers').updateOne({ _id: ObjectId(id) }, { $set: desc });
  res.sendStatus(200);
});

app.delete('/fyp/unicommerceapp/DeleteSupplier', async (req, res) => {
  const { id } = req.query;
  await db.collection('suppliers').deleteOne({ _id: ObjectId(id) });
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
