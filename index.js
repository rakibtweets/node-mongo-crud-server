const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());

// user: myDbUser1
// password: s0o7ojxrSs3b67tV

// database connection url
const uri =
  'mongodb+srv://myDbUser1:s0o7ojxrSs3b67tV@cluster0.i9ovm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db('foodMaster'); // database name
    const usersCollections = database.collection('users');

    // GET API
    app.get('/users', async (req, res) => {
      const cusor = usersCollections.find({});
      const user = await cusor.toArray();
      res.send(user);
    });

    // GET SINGLE USER API
    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await usersCollections.findOne(query);
      // console.log('load user with id', id);
      res.send(user);
    });

    // POST API
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const result = await usersCollections.insertOne(newUser);
      // recieve user data from home page
      console.log('Got new user', req.body);
      console.log('added user', result);
      res.json(result);
    });

    // UPDATE API
    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      // finding updated id using fitter method
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      };
      const result = await usersCollections.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log('updating user id:', req.body);
      res.json(result);
    });

    // DELETE API
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollections.deleteOne(query);
      console.log('deleteing user with id', result);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Running My Crud server');
});

// listening

app.listen(port, () => {
  console.log('Running server port on', port);
});
