const Express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const multer = require("multer");
const OpenAI = require("openai");

const app = Express();
app.use(cors());
app.use(Express.json());

const CONNECTION_STRING = "mongodb+srv://jyfong2010:tZWwkIxm4Iw3FtGM@cluster0.od9idzi.mongodb.net/unicommerceapp?retryWrites=true&w=majority&appName=Cluster0?directConnection=true";
const DATABASENAME = "unicommerceapp";
let database;

const openai = new OpenAI({
  apiKey: 'sk-fypjy-Kp448rl3XJjZsicjeE5HT3BlbkFJWsMBDpO6Ljpar6eLD5Qf', 
});

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

// Function to generate caption using OpenAI
const generateCaption = async (productName, keyword) => {
  const prompt = `Generate a creative and engaging caption for a product named "${productName}" targeting customers interested in "${keyword}".`;

  try {
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo",
      prompt: prompt,
      max_tokens: 60,
    });

    const caption = response.choices[0].text.trim();
    return caption;
  } catch (error) {
      console.error('Error generating caption with OpenAI:', error.response ? error.response.data : error.message);
      throw new Error(`Failed to generate caption: ${error.response ? error.response.data : error.message}`);
  }
};

// New endpoint to generate caption
app.post('/fyp/unicommerceapp/GenerateCaption', async (req, res) => {
  try {
    const { productName, keyword } = req.body;
    if (!productName || !keyword) {
      return res.status(400).send({ error: 'Product name and keyword are required' });
    }

    const generatedCaption = await generateCaption(productName, keyword);
    res.send({ caption: generatedCaption });
  } catch (error) {
    console.error('Error generating caption:', error);
    res.status(503).send({ error: 'Failed to generate caption' });
  }
});

// Existing routes
app.get('/fyp/unicommerceapp/GetSupplier', async (request, response) => {
  try {
    const result = await database.collection("suppliers").find({}).toArray();
    response.send(result);
  } catch (error) {
    response.status(500).send({ error: 'Failed to fetch suppliers' });
  }
});

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

app.put('/fyp/unicommerceapp/EditSupplier/:id', async (request, response) => {
  try {
    const id = request.params.id;
    if (!ObjectId.isValid(id)) {
      return response.status(400).json({ error: 'Invalid supplier ID' });
    }
    const updateData = request.body;
    const result = await database.collection("suppliers").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    if (result.matchedCount === 0) {
      return response.status(404).json({ error: 'Supplier not found' });
    }
    response.json("Updated Supplier.");
  } catch (error) {
    response.status(500).send({ error: 'Failed to update supplier' });
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
