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

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    const categoryCollection = client.db('furniture').collection('categories');
    const productCollection = client.db('furniture').collection('products');
    const userCollection = client.db('furniture').collection('users');
    const bookingCollection = client.db('furniture').collection('mybooking');

    try {

        // Get Category=======================
        app.get('/categories', async (req, res) => {
            const query = {};
            const cursor = categoryCollection.find(query);

            const services = await cursor.toArray();
            res.send(services);
        });


        // Get Products by category=======================
        app.get('/categories/:category', async (req, res) => {
            const category = req.params.category;
            const query = { category: category };
            const cursor = productCollection.find(query);

            const products = await cursor.toArray();
            res.send(products);
        });


        // Post Product
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        });


        // Post User
        app.post('/users', async (req, res) => {
            const product = req.body;
            const result = await userCollection.insertOne(product);
            res.send(result);
        });


        // Post My Booking
        app.post('/mybooking', async (req, res) => {
            const myBooking = req.body;
            const result = await bookingCollection.insertOne(myBooking);
            res.send(result);
        });


        // Get Products by user (email)=======================
        app.get('/productsbyemail', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = productCollection.find(query);

            const products = await cursor.toArray();
            res.send(products);
        });


        // // Get allsellers=======================
        // app.get('/products', async (req, res) => {
        //     const query = {};
        //     const cursor = categoryCollection.find(query);

        //     const services = await cursor.toArray();
        //     res.send(services);
        // });


        // Review Delete=================================
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })


        // Status Update for the my order page=================================
        app.patch('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const newStatus = req.body.status;
            const updatedStatus = {
                $set: {
                    status: newStatus,
                }
            }
            const result = await productCollection.updateOne(filter, updatedStatus);
            res.send(result);
        })



        // PRODUCT ADVERTISEMENT status change
        app.patch('/advertise/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: ObjectId(id) };
            const newStatus = req.body.adStatus;
            console.log(newStatus);
            const updatedStatus = {
                $set: {
                    adStatus: newStatus,
                }
            }
            const result = await productCollection.updateOne(filter, updatedStatus);
            res.send(result);
        })




    }

    finally {

    }
}

run().catch(err => console.error(err));


app.listen(port, () => {
    console.log(`Server is running in port number ${port}`);
})