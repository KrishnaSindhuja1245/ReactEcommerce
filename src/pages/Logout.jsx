import React, { useEffect } from "react";
import { Footer, Navbar } from "../components";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { updateData } from "../redux/reducer/authSlice";
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";




const LogoutPage = () => {
    const navigate = useNavigate();
    const auth = useSelector(state => state.authSlice)
    const dispatch = useDispatch();
    const handleSignOut = () => {

        const userPool = new CognitoUserPool({
            UserPoolId: process.env.REACT_APP_AUTH_USER_POOL_ID,
            ClientId: process.env.REACT_APP_AUTH_USER_POOL_WEB_CLIENT_ID,
        });
        
        const cognitoUser = userPool.getCurrentUser();
        if (cognitoUser != null) {
        cognitoUser.signOut();
        
        dispatch(
            updateData({
            name: "",
            email: "",
            })
        );
        //console.log("Logging out");
        navigate("/");
        }
    }; 

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Logout</h1>
        <hr />
        <p className="lead text-center">
          SuccessFully Logged Out!
        </p>
      </div>
      
      <div className="text-center">
      <Link to="/" className="btn  btn-outline-dark mx-4" onClick={() => handleSignOut()}>
              <i className="fa fa-arrow-left"></i> Continue to Home
            </Link>
               
      </div>
      <Footer />
    </>
  );
};

export default LogoutPage;
