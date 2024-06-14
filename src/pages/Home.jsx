import { Navbar, Main, Product, Footer } from "../components";
import React, {useEffect,useState} from 'react';
import { checkUserSession } from "../config/auth";
import { updateData } from "../redux/reducer/authSlice";
import { useDispatch } from "react-redux";


function Home() {
  const dispatch= useDispatch();

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
  },[]);
  return (
    <>
      <Navbar />
      <Main />
      <Product />
      <Footer />
    </>
  )
}

export default Home