import { Footer, Navbar } from "../components";
import { checkUserSession } from "../config/auth";
import { updateData } from "../redux/reducer/authSlice";
import React, {useState, useEffect} from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";


const ViewReviews = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [reviews , setReviews]=useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const[reviewsLength,setReviewsLength]=useState();

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

  useEffect(() => {
    const getReviews = async () => {
      //const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      const response = await fetch(`https://izfxhr6n3g.execute-api.us-east-1.amazonaws.com/test/getReviews?productid=${id}`);
      const data = await response.json();
      //console.log(response);
      setReviews(data.Items);
      setTitle(data.Title);
      setDesc(data.desc);
      setReviewsLength(data.Items.length);
      //console.log(data.Items.length);
      
    };
    getReviews();
  }, [id]);


  let sum=0;
  let avg=0;
  if(reviewsLength!=0){
  reviews.map((item) => {
    sum += parseInt(item.Rating);
  return sum;
  });
  avg=Math.round((reviewsLength==0?avg:sum/reviewsLength)*10)/10;
  //alert(avg);
  }

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Product Reviews</h1>
        <hr />
        <div> <h4>{title}</h4></div>
        <div><p>{desc}</p></div>
        <div className="text-left">
          <p className="text-left">Average Rating : {avg} <i className="fa fa-star"></i>{" "} ({reviews.length})
          <Link to={"/get_products/"+id} className="text-right px-3">Back</Link>
          </p>
        </div>
        <hr />
        
          {reviewsLength==0?<><div><h5>No reviews to display.</h5></div> </>
          : reviews.map((rev) =>{
              return(
                <div className=" text-left" key={rev.index} >
                <div className="row">
                <div className="card-body col-md-12 col-sm-12 px-3 py-3">
                <div><h6 className="card-text"> {rev.UserID} </h6>  Rating: {rev.Rating}</div>
                <p className="card-text">
                {rev.Review}
                </p>
                </div></div></div>
              );
            })
          }
        
      </div>
     <Footer />
    </>
    
  );
};
        

export default ViewReviews;