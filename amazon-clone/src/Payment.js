import React, { useState, useEffect } from 'react'
import './Payment.css'
import { useStateValue } from "./StateProvider"
import CheckoutProduct from './CheckoutProduct'
// import StripeCheckout from "./StripeCheckout"
import { Link, useHistory } from "react-router-dom"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from './reducer';
import { db } from "./firebase"
import axios from "./axios"



function Payment() {

    const history = useHistory()

    const [{ basket, user }, dispatch] = useStateValue()

    const stripe = useStripe()
    const elements = useElements()

    const [succeeded, setSucceeded] = useState(false)
    const [processing, setProcessing] = useState("")
    const [error, setError] = useState(null)
    const [disabled, setDisabled] = useState(true)
    const [clientSecret, setClientSecret] = useState(true)

    const [values, setValues] = useState({
        name: "",
        email: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        country: "",
        zip: "",
        phone: ""
    })
    
    const { name, email, address1, address2, city, state, country, zip, phone } = values

    useEffect(() => {
        
        // const getClientSecret = async () => {
        //     const response = await axios({
        //         method: 'post',
        //         url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
        //     })
        //     setClientSecret(response.data.clientSecret)
        // }

        const getClientSecret = async () => {
            const response = await axios.post(
                `/payments/create?total=${getBasketTotal(basket) * 100}`
            )
            setClientSecret(response.data.clientSecret)
        }

        getClientSecret()
    }, [basket])

    console.log("THE SECRET IS >>>", clientSecret)

    const handleSubmit = async (event) => {

        event.preventDefault();
        setProcessing(true);
        setValues({...values})

        const paymentIntent = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: name,
                    address: {
                        line1: address1,
                        line2: address2
                    },
                    email: email,
                    phone: phone,
                    
                }
            }
        }).then(({ paymentIntent }) => {
            // paymentIntent = payment confirmation
            db
                .collection('users')
                .doc(user?.uid)
                .collection('orders')
                .doc(paymentIntent.id)
                .set({
                    basket: basket,
                    amount: paymentIntent.amount,
                    created: paymentIntent.created
                })

            setSucceeded(true)
            setError(null)
            setProcessing(false)

            dispatch({
                type: "EMPTY_BASKET"
            })

            setValues({
                ...values,
                name: "",
                email: "",
                address: "",
                city: "",
                state: "",
                country: "",
                zip: ""
            })

            history.replace('/orders')
        })
    }

    const onHandleChange = event => {
        //Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setDisabled(event.empty)
        setError(event.error ? event.error.message : "")
    }

    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value})
        setError(event.error ? event.error.message : "")
    }

    return (
        <div className="payment">
            <div className="payment__container">
                
                <h1>
                    Checkout (<Link to="/checkout">{basket?.length} items</Link>)
                </h1>
                
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Delivery Address</h3>
                    </div>
                    <div className="payment__address">
                        {/* <p>{user?.email}</p>
                        <p>123 React Lane</p>
                        <p>Los Angeles, CA</p>
                        <BillingDetailsFields />   */}
                        <div className="billingDetails">
                            <div className="billingDetails__InputText">
                                <label for="name">Name</label>
                                <input name="name" type="text" placeholder="Enter your Name..." className="billingDetails__Input" onChange={handleChange("name")} value={name} required />
                            </div>

                            <div className="billingDetails__InputText">
                                <label for="email">Email</label>
                                <input name="email" type="email" placeholder="Enter your Email..." value={email} className="billingDetails__Input" onChange={handleChange("email")} required />
                            </div>
      
                            <div className="billingDetails__InputText">
                                <label for="address1">Address Line1</label>
                                <input name="address1" type="text" placeholder="Enter your Address..." className="billingDetails__Input" onChange={handleChange("address1")} value={address1} required />
                            </div>

                            <div className="billingDetails__InputText">
                                <label for="address2">Address Line2</label>
                                <input name="address2" type="text" placeholder="Enter your Address..." className="billingDetails__Input" onChange={handleChange("address2")} value={address2} required />
                            </div>

                            <div className="billingDetails__InputText">
                                <label for="phone">Mobile</label>
                                <input name="phone" type="text" placeholder="Enter your Mobile No..." className="billingDetails__Input" onChange={handleChange("phone")} value={phone} required />
                            </div>
{/*       
                            <div className="billingDetails__InputText">
                                <label for="city">City</label>
                                <input name="city" type="text" placeholder="Enter City Here..." className="billingDetails__Input" onChange={handleChange("city")} value={city} required />
                            </div>
      
                            <div className="billingDetails__InputText">
                                <label for="state">State</label>
                                <input name="state" type="text" placeholder="Enter State Here..." className="billingDetails__Input" onChange={handleChange("state")} value={state} required />
                            </div>

                            <div className="billingDetails__InputText">
                                <label for="country">Country</label>
                                <input name="country" type="text" placeholder="Enter Country Here..." className="billingDetails__Input" onChange={handleChange("country")} value={country} required />
                            </div> */}

                            <div className="billingDetails__InputText">
                                <label for="zip">Zip</label>
                                <input name="zip" type="text" placeholder="Enter Zip Code..." className="billingDetails__Input" onChange={handleChange("zip")} value={zip} required />
                            </div>
                            {error && <div>{error}</div>}
                            {/* {JSON.stringify(values)} */}
                        </div>
                    </div>
                </div>
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Review items and delivery</h3>
                    </div>
                    <div className="payment__items">
                        {
                            basket.map(item => (
                                <CheckoutProduct
                                    id={item.id}
                                    title={item.title}
                                    image={item.image}
                                    price={item.price}
                                    rating={item.rating}
                                />
                            ))
                        }
                    </div>
                </div>
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Payment Method</h3>
                    </div>
                    <div className="payment__details">
                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={onHandleChange}  />
                            <div className="payment__priceContainer">
                                <CurrencyFormat
                                    renderText={(value) => (
                                        <h3>Order Total: {value}</h3>
                                    )}
                                    decimalScale={2}
                                    value={getBasketTotal(basket)} 
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"$"}
                                />
                                <button disabled={processing || disabled || succeeded}>
                                    <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                                </button>
                            </div>
                            {error && <div>{error}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment
