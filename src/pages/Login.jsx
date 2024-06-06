import React from "react";
import { Link } from "react-router-dom";
import { Footer, Navbar } from "../components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateData } from "../redux/reducer/authSlice";
import { useFormik } from 'formik';
import * as Yup from "yup";
import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails,
  } from "amazon-cognito-identity-js";


const userPool = new CognitoUserPool({
    UserPoolId: process.env.REACT_APP_AUTH_USER_POOL_ID,
    ClientId: process.env.REACT_APP_AUTH_USER_POOL_WEB_CLIENT_ID,
  });

const Login = () => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (values) => {
    const cognitoUser = new CognitoUser({
      Username: values.email,
      Pool: userPool,
    });

    const authenticationDetails = new AuthenticationDetails({
      Username: values.email,
      Password: values.password,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
  
        cognitoUser.getUserAttributes(function (err, result) {
          if (err) {
            console.log("err", err);
            return;
          }
          dispatch(
            updateData({
              name: result[2].Value,
              email: values.email,
            })
          );
          navigate("/");
        });
      },
      onFailure: (err) => {
        console.log("login failed", err);
      },
    });
  };
  
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("No password provided."),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Login</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={formik.handleSubmit}>
              <div className="my-3">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
              </div>
              {formik.touched.email && formik.errors.email ? (
                  <div className="text-danger">{formik.errors.email}</div>
              ) : null}
              <div className="my-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
              </div>
              {formik.touched.email && formik.errors.email ? (
                  <div className="text-danger">{formik.errors.email}</div>
              ) : null}
              <div className="my-3">
                <p>New Here? <Link to="/register" className="text-decoration-underline text-info">Register</Link> </p>
              </div>
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit" onClick={() => handleSubmit(formik.values)}>
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
