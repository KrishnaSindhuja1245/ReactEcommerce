import React from 'react';
import ReactDOM from 'react-dom/client';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import getStripe from './config/getStripe';
import { Elements } from '@stripe/react-stripe-js';



import { Home, Product, Products, AboutPage, ContactPage, Cart, Login, Register, Checkout, PageNotFound, Logout, OrderSummary ,AddReview, ViewReviews} from "./pages"

const stripePromise = getStripe();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/get_products" element={<Products />} />
        <Route path="/get_products/:id" element={<Product />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Elements stripe={stripePromise}><Checkout /></Elements>} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/get_products/*" element={<PageNotFound />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/ordersummary" element ={<OrderSummary />}/>
        <Route path="/addreview/:prodid/:orderid" element ={<AddReview />}/>
        <Route path="/viewreview/:id" element ={<ViewReviews />}/>
      </Routes>
    </Provider>
  </BrowserRouter>
);
//<Route path="/checkout" element={<Elements stripe={stripePromise}><Checkout /></Elements>} />
//<Route path="/checkout" element={<Checkout />} />