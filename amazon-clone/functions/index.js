const functions = require('firebase-functions');
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const stripe = require('stripe')('sk_test_51HYqPeFRocyscFUKFIa3qvveOkipA4g12Wxq05ocm20tL63Zic4fMexDNyFPexDT3JDlSTDzjCHKcKfZmpJClPEJ00H0kBD8hi')
// const { makepayment } = require("./controllers/stripepayment")

// App config
const app = express()

// Middlewares
app.use(cors({ Origin: true }))
app.use(express.json())
app.use(bodyParser.json());

// app.post("/stripepayment", makepayment)

// API routes
app.get('/', (request, response) => response.status(200).send("hello world"))

app.post('/payments/create', async (request, response) => {
    const total = request.query.total
    // const { id, amount } = request.body
   
    console.log("Payment Request received BOOM!!! for this amount >>>>", total)

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
        description: "Amazon Clone",
        shipping: {
            name: "Same as Billing",
            address: {
              line1: 'Same as Billing',
              postal_code: '98140',
              city: 'San Francisco',
              state: 'CA',
              country: 'US',
            },
        }
    })

    response.status(201).send({
        clientSecret: paymentIntent.client_secret
    })
})

// Listen command
exports.api = functions.https.onRequest(app)

// http://localhost:5001/clone-a205d/us-central1/api