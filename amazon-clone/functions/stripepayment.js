const stripe = require("stripe")("sk_test_51HYqPeFRocyscFUKFIa3qvveOkipA4g12Wxq05ocm20tL63Zic4fMexDNyFPexDT3JDlSTDzjCHKcKfZmpJClPEJ00H0kBD8hi")
const uuid = require("uuid/v4")

exports.makepayment = (req, res) => {
    const total = req.query.total

    const idempotencyKey = uuid()

    return stripe.customers.create({
        email: user.email,
        source: user.uid
    }).then(customer => {
        stripe.charges.create({
            amount: total,
            currency: "usd",
            customer: customer.id,
            receipt_email: user.email,
            description: "a test account",

            shipping: {
                name: token.card.name,
                address: {
                    line1: token.card.address_line1,
                    line2: token.card.address_line2,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    postal_code: token.card.address_zip
                }
            }
        }, {idempotencyKey})
            .then(result => res.status(200).json(result))
            .catch(err => console.log(err))
    })
}