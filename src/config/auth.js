import { CognitoUserPool, CognitoUser, AuthenticationDetails , CognitoUserAttribute} from 'amazon-cognito-identity-js';

// Create User Pool instance
const poolData = {
    UserPoolId: process.env.REACT_APP_AUTH_USER_POOL_ID,
    ClientId: process.env.REACT_APP_AUTH_USER_POOL_WEB_CLIENT_ID,
};

const userPool = new CognitoUserPool(poolData);

export const signUpUser = (user_name, password, email) => {
  return new Promise((resolve, reject) => {
    const attributeList = [
        new CognitoUserAttribute({
            Name: "email",
            Value: email,
            }),
            new CognitoUserAttribute({
            Name: "name",
            Value: user_name,
            }),
    ];

    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export const authenticateUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const authenticationData = {
      Username: email,
      Password: password,
    };
   
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    //console.log(authenticationDetails);
    const userData = {
      Username: email,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        /*cognitoUser.getUserAttributes(function (err, result) {
            if (err) {
              console.log("err", err);
              return;
            }
            //console.log(result);
            //localStorage.setItem("username",JSON.stringify(result[2].Value));
          });*/
        
        resolve(result);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};


//import { delCart } from '../redux/action'; // Import the delCart action

  export const checkUserSession = () => {
    const currentUser = userPool.getCurrentUser();
    //console.log(currentUser);

    if (currentUser) {
      currentUser.getSession((err, session) => {
        if (err || !session.isValid()) {
          console.error('Error fetching user session:', err);
          //alert('Login is required to access the checkout page.');
          //navigate('/login');
          return ;
        }

        const userEmail = session.getIdToken().payload.email;
        //setValue('email', userEmail);
       //console.log("Logged-in user's email:", userEmail); // Log the email of the logged-in user
        localStorage.setItem("useremail",userEmail);
        return ;
      });
    } else {
      console.log('No current user');
      return("No user");
      //alert('Login is required to access the checkout page.');
      //navigate('/login');
    }
  };

export const confirmUserRegistration = (email, confirmcode) => {
    const userData = {
        Username: email,
        Pool: userPool
      };
  
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(confirmcode, true, function(err, result) {
        if (err) {
         alert(err.message || JSON.stringify(err));
         return;
        }
        console.log('call result: ' + result);
       });
};
