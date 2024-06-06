import React from 'react'
import { Footer, Navbar } from "../components";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from "yup";
import {
    CognitoUserPool,
    CognitoUserAttribute,
  } from "amazon-cognito-identity-js";


const userPool = new CognitoUserPool({
    UserPoolId: process.env.REACT_APP_AUTH_USER_POOL_ID,
    ClientId: process.env.REACT_APP_AUTH_USER_POOL_WEB_CLIENT_ID,
  });
  
  const Register = () => {
    const navigate = useNavigate();
  
    const handleSubmit = (values) => {
      const email = values.email.trim();
      const password = values.password.trim();
      const attributeList = [
        new CognitoUserAttribute({
          Name: "email",
          Value: email,
        }),
        new CognitoUserAttribute({
          Name: "name",
          Value: values.name,
        }),
        /*new CognitoUserAttribute({
          Name: "custom:telnum",
          Value: values.telnum,
        }),*/
      ];
      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("call result: ", result);
        navigate("/login");
      });
    };
  
    const formik = useFormik({
      initialValues: {
        name: "",
        //telnum: "",
        email: "",
        password: "",
        confirmpassword:"",
      },
      validationSchema: Yup.object({
        name: Yup.string()
          .max(30, "Must be 15 characters or less")
          .required("Required"),
        //telnum: Yup.string()
          //.max(10, "Must be 10 characters or less")
          //.required("Required"),
        email: Yup.string().email("Invalid email address").required("Required"),
        password: Yup.string()
          .required("No password provided.")
          .matches(/[0-9]/, "Password requires a number")
          .matches(/[a-z]/, "Password requires a lowercase letter")
          .matches(/[A-Z]/, "Password requires an uppercase letter")
          .matches(/[^\w]/, "Password requires a symbol")
          .min(8, "Password is too short. There should be 8 chars minimum."),
        confirmpassword: Yup.string()
          .label('confirm password').required()
          .oneOf([Yup.ref('password'), null], 'Passwords must match'),
      }),
      onSubmit: (values) => {
        handleSubmit(values);
      },
    });


    return (
        <>
            <Navbar />
            <div className="container my-3 py-3">
                <h1 className="text-center">Register</h1>
                <hr />
                <div className="row my-4 h-100">
                    <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="form my-3">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Enter Your Name"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                />
                            </div>
                            {formik.touched.name && formik.errors.name ? (
                                <div className="text-danger">{formik.errors.name}</div>
                            ) : null}
                            <div className="form my-3">
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
                            <div className="form  my-3">
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
                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-danger">{formik.errors.password}</div>
                            ) : null}
                            <div className="form  my-3">
                                <label htmlFor="confirmpassword">Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmpassword"
                                    placeholder="Confirm Password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.confirmpassword}
                                />
                            </div>
                            {formik.touched.confirmpassword && formik.errors.confirmpassword ? (
                                <div className="text-danger">{formik.errors.confirmpassword}</div>
                            ) : null}
                            <div className="my-3">
                                <p>Already has an account? <Link to="/login" className="text-decoration-underline text-info">Login</Link> </p>
                            </div>
                            <div className="text-center">
                                <button className="my-2 mx-auto btn btn-dark" type="submit" onClick={() => handleSubmit(formik.values)} >
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Register