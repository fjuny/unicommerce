const Express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const multer = require("multer");

const app = Express(); // Instance of Express app
app.use(cors());
app.use(Express.json());

const CONNECTION_STRING = "mongodb+srv://jyfong2010:tZWwkIxm4Iw3FtGM@cluster0.od9idzi.mongodb.net/unicommerceapp?retryWrites=true&w=majority&appName=Cluster0";
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

// Route to delete a supplier
app.delete('/fyp/unicommerceapp/DeleteSupplier', async (request, response) => {
  try {
    await database.collection("suppliers").deleteOne({
      id: request.query.id
    });
    response.json("Deleted Supplier.");
  } catch (error) {
    response.status(500).send({ error: 'Failed to delete supplier' });
  }
});
