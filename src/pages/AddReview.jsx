import React,{useEffect} from "react";
import { Footer, Navbar } from "../components";
import { checkUserSession } from "../config/auth";
import { updateData } from "../redux/reducer/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useParams, useHistory ,useNavigate} from "react-router-dom";

const AddReview = () => {
  const {prodid, orderid} = useParams();
  const auth = useSelector(state => state.authSlice);
  const navigate=useNavigate();
  const { register, handleSubmit, getValues,formState: { errors } ,reset} = useForm();
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
            orderid:orderid,
            productid:prodid,
            rating:getValues("rating"),
            review:getValues("review")
         })
    };
    //console.log(requestOptions.body);
    const result = await fetch('https://izfxhr6n3g.execute-api.us-east-1.amazonaws.com/test/putReview', requestOptions)
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson && await response.json();

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }
            handleCancel();
        })
        .catch(error => {
            //this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
            alert("Error processing order. Please try again!");
        });

  };

  const handleCancel = () => {
    reset(); // This will reset all the fields in the form
    navigate(-1); // This will navigate to the previous page
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h3 className="text-center">Add Review</h3>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form my-3">
                <label for="rating">Rating</label>
                <select
                  className="form-control"
                  id="rating"
                  {...register("rating", { required: true })}
                >
                <option value="">Choose rating</option>
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
                </select>
              </div>
              <div className="form  my-3">
                <label for="review">Review</label>
                <textarea
                  rows={5}
                  className="form-control"
                  id="review"
                  placeholder="Type your Review"
                  {...register("review", { required: true })}
                />
              </div>
              <div className="text-center">
              <button
                  className="my-2 px-4 mx-auto btn btn-dark"
                  type="cancel"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              {" "}
                <button
                  className="my-2 px-4 mx-auto btn btn-dark"
                  type="submit"
                >
                  Add review
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

export default AddReview;
