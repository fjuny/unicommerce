const Express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const multer = require("multer");
const fetch = require('node-fetch');

const app = Express();
app.use(cors());
app.use(Express.json());

const CONNECTION_STRING = "mongodb+srv://jyfong2010:tZWwkIxm4Iw3FtGM@cluster0.od9idzi.mongodb.net/unicommerceapp?retryWrites=true&w=majority&appName=Cluster0?directConnection=true";
const DATABASENAME = "unicommerceapp";
let database;

const connectToDatabase = async () => {
  try {
    const client = new MongoClient(CONNECTION_STRING, { tls: true, tlsAllowInvalidCertificates: true });
    await client.connect();
    database = client.db(DATABASENAME);
    console.log("Successfully connected to the database");
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1);
  }
};

const ensureDatabaseConnection = (req, res, next) => {
  if (!database) {
    console.error('Database connection not established');
    return res.status(503).send({ error: 'Database connection not established' });
  }
  next();
};

app.listen(5038, async () => {
  await connectToDatabase();
  console.log("Server is running on port 5038");
});

app.use(ensureDatabaseConnection);

app.get('/fyp/unicommerceapp/GetInfluencers', async (req, res) => {
  try {
    const influencers = await database.collection("influencers").find({}).toArray();
    res.json(influencers);
  } catch (error) {
    console.error('Failed to fetch influencers:', error);
    res.status(500).send({ error: 'Failed to fetch influencers' });
  }
});

app.get('/fyp/unicommerceapp/GetProducts', async (req, res) => {
  try {
    const products = await database.collection("products").find({}).toArray();
    res.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    res.status(500).send({ error: 'Failed to fetch products' });
  }
});

app.post('/fyp/unicommerceapp/AddProduct', multer().none(), async (req, res) => {
  try {
    const newProduct = req.body;
    await database.collection("products").insertOne(newProduct);
    res.status(201).send("Product added successfully.");
  } catch (error) {
    console.error('Failed to add product:', error);
    res.status(500).send({ error: 'Failed to add product' });
  }
});

app.put('/fyp/unicommerceapp/EditProduct/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    const updateData = req.body;
    const result = await database.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.send("Product updated successfully.");
  } catch (error) {
    console.error('Failed to update product:', error);
    res.status(500).send({ error: 'Failed to update product' });
  }
});

app.delete('/fyp/unicommerceapp/DeleteProduct/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    const result = await database.collection('products').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.send("Product deleted successfully.");
  } catch (error) {
    console.error('Failed to delete product:', error);
    res.status(500).send({ error: 'Failed to delete product' });
  }
});

app.post('/fyp/unicommerceapp/AddSupplier', multer().none(), async (req, res) => {
  try {
    const numOfDocs = await database.collection("suppliers").countDocuments({});
    await database.collection("suppliers").insertOne({
      id: (numOfDocs + 1).toString(),
      desc: req.body.newSupplier
    });
    res.json("Added Supplier.");
  } catch (error) {
    res.status(500).send({ error: 'Failed to add supplier' });
  }
});

app.put('/fyp/unicommerceapp/EditSupplier/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid supplier ID' });
    }
    const updateData = req.body;
    const result = await database.collection("suppliers").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json("Updated Supplier.");
  } catch (error) {
    res.status(500).send({ error: 'Failed to update supplier' });
  }
});

app.delete('/fyp/unicommerceapp/DeleteSupplier/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new ObjectId(id);
    const result = await database.collection('suppliers').deleteOne({ _id: objectId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete supplier', error: error.message });
  }
});

app.get('/fyp/unicommerceapp/GetOrders', async (req, res) => {
  try {
    const orders = await database.collection("ordersWithDetails").find({}).toArray();
    res.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).send({ error: 'Failed to fetch orders' });
  }
});

app.get('/fyp/unicommerceapp/GetSuppliers', async (req, res) => {
  try {
    const suppliers = await database.collection("suppliers").find({}).toArray();
    res.json(suppliers);
  } catch (error) {
    console.error('Failed to fetch suppliers:', error);
    res.status(500).send({ error: 'Failed to fetch suppliers' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const ollamaApiEndpoint = "http://localhost:11434/api/chat";
    
    console.log('Request body:', req.body);

    const response = await fetch(ollamaApiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2',
        messages: [{ role: 'user', content: req.body.text }],
        stream: false 
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    let finalMessage = '';
    const jsonLines = responseText.split('\n').filter(line => line.trim() !== '');

    for (const line of jsonLines) {
      try {
        const parsed = JSON.parse(line);
        if (parsed.message && parsed.message.content) {
          finalMessage += parsed.message.content;
        }
      } catch (error) {
        console.error('Error parsing JSON line:', error, 'Line:', line);
      }
    }

    console.log('Final processed message:', finalMessage);

    res.json({ role: 'assistant', content: finalMessage });
  } catch (error) {
    console.error('Error querying the model:', error);
    res.status(500).json({ error: error.message });
  }
});