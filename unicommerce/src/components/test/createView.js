const { MongoClient, ObjectId } = require('mongodb');

async function createView() {
  const uri = "mongodb+srv://jyfong2010:tZWwkIxm4Iw3FtGM@cluster0.od9idzi.mongodb.net/unicommerceapp?retryWrites=true&w=majority&appName=Cluster0?directConnection=true";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('unicommerceapp');
    const orders = database.collection('orders');

    await database.createCollection('ordersWithDetails', {
      viewOn: 'orders',
      pipeline: [
        {
          $lookup: {
            from: 'suppliers',
            localField: 'supplierId',
            foreignField: '_id',
            as: 'supplierDetails'
          }
        },
        {
          $unwind: '$supplierDetails'
        },
        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: 'sku_id',
            as: 'productDetails'
          }
        },
        {
          $unwind: '$productDetails'
        },
        {
          $project: {
            id: 1,
            total: 1,
            date: 1,
            status: 1,
            customerUsername: 1,
            'supplierDetails.name': 1,
            'supplierDetails.email': 1,
            'supplierDetails.phone': 1,
            'supplierDetails.address': 1,
            'productDetails.product_name': 1,
            'productDetails.price': 1,
            'productDetails.category': 1,
            'productDetails.subcategory': 1
          }
        }
      ]
    });

    console.log('View created successfully');
  } catch (error) {
    console.error('Error creating view:', error);
  } finally {
    await client.close();
  }
}

createView().catch(console.error);
