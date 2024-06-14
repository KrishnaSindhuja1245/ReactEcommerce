import React, { useEffect} from "react";
import { useDispatch } from "react-redux";
import { checkUserSession } from "../config/auth";
import { updateData } from "../redux/reducer/authSlice";
import { Footer, Navbar, Product } from "../components";


const Products = () => {
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
      <Product />
      <Footer />
    </>
  )
}

export default Products