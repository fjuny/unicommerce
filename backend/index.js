const Express = require("express");
const { MongoClient, ObjectId } = require("mongodb"); // Ensure ObjectId is imported
const cors = require("cors");
const multer = require("multer");

const app = Express(); // Instance of Express app
app.use(cors());
app.use(Express.json());

const CONNECTION_STRING = "mongodb+srv://jyfong2010:tZWwkIxm4Iw3FtGM@cluster0.od9idzi.mongodb.net/unicommerceapp?retryWrites=true&w=majority&appName=Cluster0?directConnection=true";

const DATABASENAME = "unicommerceapp";
let database;

// Function to connect to the database
const connectToDatabase = async () => {
  try {
    const client = new MongoClient(CONNECTION_STRING, { tls: true, tlsAllowInvalidCertificates: true });
    await client.connect();
    database = client.db(DATABASENAME);
    console.log("Successfully connected to the database");
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1); // Exit process with failure
  }
};

// Middleware to ensure database is connected before handling requests
const ensureDatabaseConnection = (req, res, next) => {
  if (!database) {
    return res.status(503).send({ error: 'Database connection not established' });
  }
  next();
};

// Start the server and connect to the database
app.listen(5038, async () => {
  await connectToDatabase();
  console.log("Server is running on port 5038");
});

// Use the middleware for routes that require database connection
app.use(ensureDatabaseConnection);

// Route to get suppliers
app.get('/fyp/unicommerceapp/GetSupplier', async (request, response) => {
  try {
    const result = await database.collection("suppliers").find({}).toArray();
    response.send(result);
  } catch (error) {
    response.status(500).send({ error: 'Failed to fetch suppliers' });
  }
});

// Route to add a supplier
app.post('/fyp/unicommerceapp/AddSupplier', multer().none(), async (request, response) => {
  try {
    const numOfDocs = await database.collection("suppliers").countDocuments({});
    await database.collection("suppliers").insertOne({
      id: (numOfDocs + 1).toString(),
      desc: request.body.newSupplier
    });
    response.json("Added Supplier.");
  } catch (error) {
    response.status(500).send({ error: 'Failed to add supplier' });
  }
});

// Route to update a supplier
app.put('/fyp/unicommerceapp/EditSupplier/:id', async (request, response) => {
  try {
    const id = request.params.id;
    console.log('Attempting to update supplier with ID:', id);

    if (!ObjectId.isValid(id)) {
      console.error('Invalid ObjectId:', id);
      return response.status(400).json({ error: 'Invalid supplier ID' });
    }

    const updateData = request.body;
    console.log('Updated supplier data:', updateData);

    const result = await database.collection("suppliers").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    console.log('Update result:', result);

    if (result.matchedCount === 0) {
      console.log('Supplier not found');
      return response.status(404).json({ error: 'Supplier not found' });
    }

    console.log('Supplier updated successfully');
    response.json("Updated Supplier.");
  } catch (error) {
    console.error('Error updating supplier:', error);
    response.status(500).send({ error: 'Failed to update supplier' });
  }
});

// Route to delete a supplier
app.delete('/fyp/unicommerceapp/DeleteSupplier/:id', async (req, res) => {
  try {
    if (!db) {
      console.error('Database connection not established');
      return res.status(500).json({ message: 'Database connection error' });
    }

    const { id } = req.params;
    const objectId = new ObjectId(id);
    const result = await db.collection('suppliers').deleteOne({ _id: objectId });

    console.log('Delete result:', result);

    if (result.deletedCount === 0) {
      console.log('Supplier not found');
      return res.status(404).json({ message: 'Supplier not found' });
    }

    console.log('Supplier deleted successfully');
    res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    console.error('Error response:', error.response);
    res.status(500).json({ message: 'Failed to delete supplier', error: error.message });
  }
});