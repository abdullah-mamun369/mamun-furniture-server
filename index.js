const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
const port = process.env.port || 7000;



app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Furniture server is running')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@assignment-12.eafhkau.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    const serviceCollection = client.db('furniture').collection('categories');

    try {
        app.get('/categories', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);

            const services = await cursor.toArray();
            res.send(services);
        });
    }

    finally {

    }
}

run().catch(err => console.error(err));


app.listen(port, () => {
    console.log(`Server is running in port number ${port}`);
})