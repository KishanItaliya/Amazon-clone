import React, { useEffect } from 'react';
import './App.css';
import Header from './Header';
import Home from './Home';
import Checkout from "./Checkout";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Login from './Login'
import Payment from './Payment'
import Orders from './Orders'
import { auth } from "./firebase"
import { useStateValue } from "./StateProvider"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

const promise = loadStripe("pk_test_51HTlbuFm8AspTnLCo1CASakomhH70UeWiYPzEgEH4QXiBeoKYfsSc5OvjhlsrIBMfp4A05mxxSXnEqwJzcZzoMY500nQrqQ0Rw")

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
          <Route path="/orders" exact>
            <Header />
            <Orders />
          </Route>
          <Route path="/login" exact>
            <Login />
          </Route>
          <Route path="/checkout" exact>
            <Header />
            <Checkout />
          </Route>
          <Route path="/payment" exact>
            <Header />
            <Elements stripe={promise}>
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
