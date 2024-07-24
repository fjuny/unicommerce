const { MongoClient } = require('mongodb');

// const uri = "mongodb+srv://jyfong2010:tZWwkIxm4Iw3FtGM@cluster0.od9idzi.mongodb.net/unicommerceapp?retryWrites=true&w=majority&appName=Cluster0?directConnection=true";
// const dbName = 'unicommerceapp'; // Replace with your database name

async function removeRedundantEntries() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to database');

    const db = client.db(dbName);
    const collection = db.collection('influencers');

    // Find all documents
    const allInfluencers = await collection.find().toArray();

    // Create a map to keep track of seen names
    const seen = new Map();
    // Array to collect deleted document IDs
    const deletedIds = [];

    // Iterate over all influencers and delete duplicates
    for (const influencer of allInfluencers) {
      const name = influencer.name;
      
      if (seen.has(name)) {
        // If this name has already been seen, it's a duplicate
        await collection.deleteOne({ _id: influencer._id });
        console.log(`Deleted duplicate influencer with ID: ${influencer._id}`);
        deletedIds.push(influencer._id); // Collect deleted ID
      } else {
        // Otherwise, add the name to the seen map
        seen.set(name, influencer._id);
      }
    }

    console.log('Redundant entries removed');
    // Display all deleted IDs
    if (deletedIds.length > 0) {
      console.log('Deleted redundant entries with IDs:', deletedIds);
    } else {
      console.log('No redundant entries were found.');
    }
  } catch (error) {
    console.error('Error removing redundant entries:', error);
  } finally {
    await client.close();
  }
}

removeRedundantEntries();
