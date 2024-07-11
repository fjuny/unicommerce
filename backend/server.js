const Express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const supplierRoutes = require('./routes');

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
    return res.status(503).send({ error: 'Database connection not established' });
  }
  next();
};

app.listen(5038, async () => {
  await connectToDatabase();
  console.log("Server is running on port 5038");
});

app.use(ensureDatabaseConnection);
app.use('/fyp/unicommerceapp', supplierRoutes);