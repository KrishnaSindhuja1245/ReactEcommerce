import React, { useEffect, useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { Footer, Navbar } from "../components";
import { authenticateUser,getUserAttributes } from '../config/auth'
import { useLocalStorage } from '../config/useLocalStorage';
import { useDispatch } from "react-redux";
import { updateData } from "../redux/reducer/authSlice";
import { useFormik } from 'formik'
import * as Yup from "yup"

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useLocalStorage("username","");
  
  
  const handleSubmit = (values) => {

    try {
      const data = authenticateUser(values.email, values.password);
      console.log('Sign in success:', data);
      dispatch(
        updateData({
          name : values.email,
          email: values.email,
          signedin: true,
        })
      );
      navigate("/");
    } catch (err) {
      console.error(err.message);
    }
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
