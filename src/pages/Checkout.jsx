import React, {useState, useEffect} from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { Link , useNavigate} from "react-router-dom";
import { useForm } from "react-hook-form";
import { USstateOptions } from '../config/us_states';
import { checkUserSession } from "../config/auth";
import { updateData } from "../redux/reducer/authSlice";
import { emptyCart } from "../redux/action";
import {CardElement, useElements, useStripe} from '@stripe/react-stripe-js';



const Checkout = () => {
  const cart = useSelector((state) => state.handleCart);
  const auth = useSelector(state => state.authSlice);
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  
  const { register, handleSubmit, getValues,formState: { errors } ,reset} = useForm();
  const [OrderPlaced, setOrderPlaced] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
 
  useEffect(() => {
    checkUserSession();
    const user = localStorage.getItem("useremail");
    localStorage.removeItem("useremail");
    if(user){
      dispatch(
        updateData({
          name: user,
          email: user,
          signedin: true,
        })
      );
    }
    //alert(result);
        setOptions(USstateOptions);
    }, []);
  //const navigate = useNavigate();

  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">No item in Cart</h4>
            <Link to="/" className="btn btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  };
  const RequestLogin = () => {
    return(
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">Please login to view Cart.</h4>
            <Link to="/login" className="btn  btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Login
            </Link>
          </div>
        </div>
        </div>
    );
  };
  const OrderSuccess = () =>{
    return(
        <div className="container my-3 py-3">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">Order placed Successfully!</h4>
            <Link to="/" className="btn  btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continue to Home
            </Link>
          </div>
        </div>
        </div>
    );
  };

  const onSubmit = async (data) => {
    // Block native form submission.
    //event.preventDefault();
    //alert("In handle Submit");
    //alert(getValues("firstName"));
    //console.log(cart);
    //Send data to API call
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*' },
        body: JSON.stringify({ 
            userid:auth.userData.email,
            firstname:getValues("firstName"),
            lastname: getValues("lastname"),
            email: getValues("email"),
            address: getValues("address"),
            address2: getValues("address2"),
            country: getValues("country"),
            state: getValues("state"),
            zip: getValues("zip"),
            cardname: getValues("cardname"),
            cardnumber: getValues("cardnumber"),
            cardexpiration: getValues("cardexpiration"),
            cardcvv: getValues("cardcvv"),
            items:cart.map(item => ({ id: item.id, price: item.price, qty: item.qty , image: item.image, title: item.title})),
         })
    };
    //console.log(requestOptions.body);
    const result = await fetch('https://yfy16qf15i.execute-api.us-east-1.amazonaws.com/test/putOrder', requestOptions)
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson && await response.json();

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }
            console.log("Order Placed!");
            reset();
            //console.log(response);
            //cart.length = 0;
            dispatch(emptyCart());
            //console.log(cart.length);
            setOrderPlaced(true);
            //this.setState({ postId: data.id })
        })
        .catch(error => {
            //this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
            alert("Error processing order. Please try again!");
        });

  };

    

  const ShowCheckout = () => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;
    cart.map((item) => {
        subtotal += item.price * item.qty
      return subtotal;
    });
    cart.map((item) => {
      return (totalItems += item.qty);
    });

    //setTotal(subtotal);
    return (
      <>
        <div className="container py-5">
        <h1 className="text-center">Checkout</h1>
        <hr />
          <div className="row my-4">
            <div className="col-md-5 col-lg-4 order-md-last">
              <div className="card mb-4">
                <div className="card-header py-3 bg-light">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                      Products ({totalItems})<span>${Math.round(subtotal)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      Shipping
                      <span>${shipping}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div>
                        <strong>Total amount</strong>
                      </div>
                      <span>
                        <strong>${Math.round(subtotal + shipping)}</strong>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-7 col-lg-8">
              <div className="card mb-4">
                <div className="card-header py-3">
                  <h4 className="mb-0">Billing address</h4>
                </div>
                <div className="card-body">
                  <form className="needs-validation" onSubmit={handleSubmit(onSubmit)} >
                    <div className="row g-3">
                      <div className="col-sm-6 my-1">
                        <label htmlFor="firstName" className="form-label">
                          First name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          placeholder=""
                          required
                          {...register("firstName", { required: true })}
                          //onChange = {(e) =>{setFirstName(e.target.value);}}
                        />
                        <div className="invalid-feedback">
                          Valid first name is required.
                        </div>
                      </div>

                      <div className="col-sm-6 my-1">
                        <label htmlFor="lastName" className="form-label">
                          Last name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          placeholder=""
                          {...register("lastName", { required: true })}
                        />
                        <div className="invalid-feedback">
                          Valid last name is required.
                        </div>
                      </div>

                      <div className="col-12 my-1">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="you@example.com"
                          {...register("email", { required: true })}
                        />
                        <div className="invalid-feedback">
                          Please enter a valid email address for shipping
                          updates.
                        </div>
                      </div>

                      <div className="col-12 my-1">
                        <label htmlFor="address" className="form-label">
                          Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="address"
                          placeholder="1234 Main St"
                          required
                          {...register("address", { required: true })}
                        />
                        <div className="invalid-feedback">
                          Please enter your shipping address.
                        </div>
                      </div>

                      <div className="col-12">
                        <label htmlFor="address2" className="form-label">
                          Address 2{" "}
                          <span className="text-muted">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="address2"
                          placeholder="Apartment or suite"
                          {...register("address2", { required: false })}
                        />
                      </div>

                      <div className="col-md-5 my-1">
                        <label htmlFor="country" className="form-label">
                          Country
                        </label>
                        <br />
                        <select className="form-select" id="country" required
                        {...register("country", { required: true })} >
                          <option value="">Choose...</option>
                          <option>United States</option>
                        </select>
                        <div className="invalid-feedback">
                          Please select a valid country.
                        </div>
                      </div>

                      <div className="col-md-4 my-1">
                        <label htmlFor="state" className="form-label">
                          State
                        </label>
                        <br />
                        <select className="form-select" id="state" required
                            {...register("state", { required: true })} >
                          {options.map(option => (
                            <option key={option.key} value={option.value}>{option.text}</option>
                          ))}
                        </select>
                        <div className="invalid-feedback">
                          Please provide a valid state.
                        </div>
                      </div>

                      <div className="col-md-3 my-1">
                        <label htmlFor="zip" className="form-label">
                          Zip
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="zip"
                          placeholder=""
                          required
                          {...register("zip", { required: true })}
                        />
                        <div className="invalid-feedback">
                          Zip code required.
                        </div>
                      </div>
                    </div>

                    <hr className="my-4" />


                    <h4 className="mb-3">Payment</h4>
                    
                    <div className="row gy-3">
                    <div className="col-md-6">
                        <label htmlFor="cardname" className="form-label">
                        Name on card
                        </label>
                        <input
                        type="text"
                        className="form-control"
                        id="cardname"
                        placeholder=""
                        required
                        {...register("cardname", { required: true })}
                        />
                        <small className="text-muted">
                        Full name as displayed on card
                        </small>
                        <div className="invalid-feedback">
                        Name on card is required
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="cardnumber" className="form-label">
                        Credit card number
                        </label>
                        <input
                        type="text"
                        className="form-control"
                        id="cardnumber"
                        placeholder=""
                        required
                        {...register("cardnumber", { required: true })}
                        />
                        <div className="invalid-feedback">
                        Credit card number is required
                        </div>
                    </div>

                    <div className="col-md-3">
                        <label htmlFor="cardexpiration" className="form-label">
                        Expiration
                        </label>
                        <input
                        type="text"
                        className="form-control"
                        id="cardexpiration"
                        placeholder=""
                        required
                        {...register("cardexpiration", { required: true })}
                        />
                        <div className="invalid-feedback">
                        Expiration date required
                        </div>
                    </div>

                    <div className="col-md-3">
                        <label htmlFor="cardcvv" className="form-label">
                        CVV
                        </label>
                        <input
                        type="text"
                        className="form-control"
                        id="cardcvv"
                        placeholder=""
                        required
                        {...register("cardcvv", { required: true })}
                        />
                        <div className="invalid-feedback">
                        Security code required
                        </div>
                    </div>
                    </div>

                    <hr className="my-4" />

                    <button
                      className="w-100 btn btn-primary "
                      type="submit" //disabled={!stripe}
                    >
                      Continue to checkout
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <Navbar />
      {auth.userData.name !=''?
        <>{OrderPlaced  ?  <OrderSuccess />   :
        <><div className="container my-3 py-3">
            {cart.length ? <ShowCheckout /> : <EmptyCart />}
        </div></>
        }</>
        : <RequestLogin />
      }
      <Footer />
    </>
  );
};

export default Checkout;
