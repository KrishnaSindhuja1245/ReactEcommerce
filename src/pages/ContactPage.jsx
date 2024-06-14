import React,{useEffect} from "react";
import { Footer, Navbar } from "../components";
import { checkUserSession } from "../config/auth";
import { updateData } from "../redux/reducer/authSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const ContactPage = () => {
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
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">Contact Us</h4>
            <hr />
            <h6>Send an email to admin@reactecommerce.shop for any queries. We are happy to assit you.</h6>
            <h6>Please note it takes 3-4 working days to get back to you.</h6>
            <Link to="/" className="btn btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
/**      <div className="container my-3 py-3">
        <h1 className="text-center">Contact Us</h1>
        <hr />
        <div class="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form>
              <div class="form my-3">
                <label for="Name">Name</label>
                <input
                  type="email"
                  class="form-control"
                  id="Name"
                  placeholder="Enter your name"
                />
              </div>
              <div class="form my-3">
                <label for="Email">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="Email"
                  placeholder="name@example.com"
                />
              </div>
              <div class="form  my-3">
                <label for="Password">Message</label>
                <textarea
                  rows={5}
                  class="form-control"
                  id="Password"
                  placeholder="Enter your message"
                />
              </div>
              <div className="text-center">
                <button
                  class="my-2 px-4 mx-auto btn btn-dark"
                  type="submit"
                  disabled
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div> */