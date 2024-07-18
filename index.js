const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors({origin: "*"}))
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ts8x6gb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const touristsSpotCollect = client.db('touristsSpot').collection('touristsSpot');
    const userCollect = client.db('touristsSpot').collection('user');
    const countriesCollect = client.db('touristsSpot').collection('countries')

    app.post('/TouristsSpot', async(req, res) =>{
      const newTouristsSpot = req.body;
      console.log('newTouristsSpot', newTouristsSpot);
      const result = await touristsSpotCollect.insertOne(newTouristsSpot);
      res.send(result)
    })
    app.get('/TouristsSpot', async(req, res) =>{
      const cursor = touristsSpotCollect.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    app.get('/users', async(req, res) =>{
      const cursor = userCollect.find();

      const users = await cursor.toArray();
      res.send(users)
    })
    app.get('/TouristsSpot/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await touristsSpotCollect.findOne(query);
      res.send(result)
      
    })
    app.get('/countries', async(req, res) =>{
      const cursor = countriesCollect.find()
      const result = await cursor.toArray();
      res.send(result)
    })
    app.delete('/TouristsSpot/:id', async(req, res) =>{
      const id = req.params.id;
      console.log('please delete from database', id);
      const query = {_id: new ObjectId(id)}
      const result = await touristsSpotCollect.deleteOne(query);
      res.send(result)
    })
    // update a  in db
    app.put('/TouristsSpot/:id', async (req, res) => {
      const id = req.params.id
      const updatedTouristsSpot = req.body
      const query = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          ...updatedTouristsSpot
        },
      }
      const result = await touristsSpotCollect.updateOne(query, updateDoc, options)
      res.send(result)
    })

    // user related apis
    app.post('/user', async(req, res) =>{
      const user = req.body;
      console.log(user);

      const result = await userCollect.insertOne(user);
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('Assignment-10 server in running')
}) 

app.listen(port, () =>{
    console.log(`Assignment-10 server in running on port: ${port}`)
})


