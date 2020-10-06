const functions = require('firebase-functions');
const express = require("express")
const cors = require("cors")
const stripe = require('stripe')('sk_test_51HYqPeFRocyscFUKFIa3qvveOkipA4g12Wxq05ocm20tL63Zic4fMexDNyFPexDT3JDlSTDzjCHKcKfZmpJClPEJ00H0kBD8hi')
// const { makepayment } = require("./stripepayment")
// API


// App config
const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// API routes
app.get('/', (request, response) => response.status(200).send("hello world"))

// app.use("/payments/create", makepayment);

app.post('/payments/create', async (request, response) => {
    const total = request.query.total

    console.log("Payment Request received BOOM!!! for this amount >>>>", total)

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
        description: "a test account",
        shipping: {
            name: 'Jenny Rosen',
            address: {
              line1: '510 Townsend St',
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