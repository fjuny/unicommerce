const Express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

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

const getImageBufferBySKU = (imageFolder, skuId) => {
  const imagePath = path.join(imageFolder, `${skuId}.jpeg`);
  if (fs.existsSync(imagePath)) {
    return fs.readFileSync(imagePath);
  }
  return null; // or handle missing image case
};

const uploadData = async () => {
  try {
    const collection = database.collection('products'); // Ensure your collection name is 'products'

    // Read JSON data from the products.json file
    const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));

    // Directory containing images
    const imageFolder = path.join(__dirname, 'images');

    // Iterate over the products
    for (let product of products) {
      // Assign the image to the product by SKU ID
      const imageBuffer = getImageBufferBySKU(imageFolder, product.sku_id);
      if (imageBuffer) {
        product.image = imageBuffer.toString('base64'); // Convert buffer to base64 string for storage
      } else {
        console.warn(`No image found for SKU ID: ${product.sku_id}`);
      }

      // Insert the product into the database
      await collection.insertOne(product);
      console.log(`Inserted product with SKU ID: ${product.sku_id}`);
    }

    console.log('All products have been uploaded successfully');
  } catch (err) {
    console.error('Error uploading data:', err);
  }
};

app.listen(5038, async () => {
  await connectToDatabase();
  console.log("Server is running on port 5038");
});

app.use(ensureDatabaseConnection);

// Add a new route for uploading data
app.post('/fyp/unicommerceapp/upload-data', async (req, res) => {
  try {
    await uploadData();
    res.status(200).send({ message: 'Data uploaded successfully' });
  } catch (error) {
    console.error('Error uploading data:', error);
    res.status(500).send({ error: 'Error uploading data' });
  }
});
