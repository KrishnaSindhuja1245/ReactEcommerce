import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Footer, Navbar } from "../components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkUserSession } from "../config/auth";
import { updateData } from "../redux/reducer/authSlice";


const OrderSummary = () => {
  const state = useSelector((state) => state.handleCart);
  const auth = useSelector(state => state.authSlice);
  const dispatch = useDispatch();
  const [orders, setOrders] = useState("");
  //useState([{OrderID:"ORD001",Products:[{price:"23.99",id:"2",qty:"2"},{price:"23.99",id:"4",qty:"2"}],OrderDate:"06/11/24",UserID:"test@example.com"},{OrderID:"ORD002",Products:[{price:"23.99",id:"2",qty:"2"},{price:"23.99",id:"4",qty:"2"}],OrderDate:"06/11/24",UserID:"test@example.com"}]);

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
  //},[]);
  //useEffect(() => {
    //alert("in UseEffect");
    //const userID=auth.userData.email;
    
    const getOrders = async () => {
      //const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      const response = await fetch(`https://yfy16qf15i.execute-api.us-east-1.amazonaws.com/test/getOrders?email=${user}`);
      const data = await response.json();
      //console.log(response);
      setOrders(data);
      //console.log(data);
      
    };
    getOrders();
    /*[...orders].sort((a,b) => {
      alert(a.orderDate);
      return new Date(a.OrderDate).getTime() - 
          new Date(b.OrderDate).getTime()
      }).reverse();*/
      //alert(orders.length);
  },[]);

  const NoOrders = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">No previous Orders </h4>
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
            <h4 className="p-3 display-5">Please login to continue view your orders.</h4>
            <Link to="/login" className="btn  btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Login
            </Link>
          </div>
        </div>
        </div>
    );
  }

 /**  const showOrderDetails =() => {
    return(
      <>
         <div className="container my-3 py-3">
            <p>
              Order Details:
            </p>
         </div>
      </>
    );
  };*/
  const ShowOrderList = () => {
    return (
      <>
        <div className="container py-3">
          <h1 className="text-center">Your Orders</h1>
          <hr />
          {orders.map((ord) => {
              return(
                <div id={ord.OrderID} key={ord.OrderID} className="col-md-12 col-sm-6 col-xs-8 col-12 mb-2">
                  <div className="card text-left h-100" key={ord.OrderID}>
                    <div className="card-body">
                      <h5 className="card-title">
                        Order ID: {ord.OrderID}
                      </h5>
                      <p className="card-text">
                        Order Status: {ord.OrderDetails.OrderStatus}{" "}Order Date: {ord.OrderDate}
                      </p>
                      <p>
                        <Link >View Order Details</Link>

                      </p>
                      <p className="card-text">
                       
                      </p>
                      {ord.Products.map((product) =>{
                        return(
                          <div id={product.id} key={product.id} className="col-md-11 col-sm-5 col-xs-7 col-11 mb-1" 
                          style={{border:0, height: '200px', overflow: 'scroll' }}>
                            <div className="card text- h-100" key={product.id}>
                            <div className="row ">
                              <div className="col-md-2 col-sm-5 py-2"> 
                              <img 
                                className="card-img-top p-2"
                                src={product.image}
                                alt="Card"
                                height={120}
                                //width={17}
                              />
                              </div>
                              
                              <div className="card-body col-md-4 col-sm-12 py-3">
                              <h5 className="card-title">
                                {product.title} 
                              </h5>
                              <p className="card-text">
                                Quantity:{product.qty}
                              </p>
                              <p className="card-text">
                                <Link to={"/addreview/"+product.id+"/"}>Rate your Purchase</Link>
                              </p>
                              </div>
                            </div>
                            </div>
                          </div>
                        );
                        }
                      )}
                    </div>
                  </div>
              </div>
              );
            }
          )}
      </div>
    </> 
    );
  };
  return (
    <>
      <Navbar />
      {auth.userData.signedin ?
       <> {orders.length  ? <ShowOrderList /> : <NoOrders/> } </>
       : <RequestLogin />}

      
      <Footer />
    </>
  );
};

export default OrderSummary;
