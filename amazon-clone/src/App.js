import React, { useEffect } from 'react';
import './App.css';
import Header from './Header';
import Home from './Home';
import Checkout from "./Checkout";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Login from './Login'
import Payment from './Payment'
import Orders from './Orders'
import { auth }from "./firebase"
import { useStateValue } from "./StateProvider"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

const stripePromise = loadStripe("pk_test_51HYqPeFRocyscFUKyeikkwRp69xHx1Y8TIC8ru0PHbXtMIrDregO68Uv0r35iVG6WHznwcwUy6SxfWyV3FD7l3rb00vYIt2npf")

function App() {

  const [{}, dispatch] = useStateValue()

  useEffect(() => {

    auth.onAuthStateChanged((authUser) => {
      console.log('THE USER IS >>>', authUser)
      if(authUser) {
        dispatch({
          type: "SET_USER",
          user: authUser
        })
      }
      else {
        dispatch({
          type: "SET_USER",
          user: null
        })
      }
    })
   
  }, [])

  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/orders">
            <Header />
            <Orders />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/checkout">
            <Header />
            <Checkout />
          </Route>
          <Route path="/payment">
            <Header />
            <Elements stripe={stripePromise}>
              <Payment />
            </Elements>
          </Route>
          <Route path="/">
            <Header />
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
