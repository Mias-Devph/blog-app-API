const jwt = require("jsonwebtoken");
const User = require('./models/User'); // adjust path
// [SECTION] Environment Setup
require('dotenv').config();


//[Section] Token Creation

module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };

    // Make sure the secret key is correctly set in your .env file
    return jwt.sign(data, process.env.JWT_SECRET_KEY);
};




//[SECTION] Token Verification



module.exports.verify = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
      return res.status(403).json({ auth: "Failed. No Token" });
  }

  token = token.replace("Bearer ", "");

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Fetch full user from DB using id from token
    const user = await User.findById(decodedToken.id).select('-password'); // exclude sensitive fields

    if (!user) return res.status(404).json({ auth: "Failed", message: "User not found" });

    req.user = user; // assign full user doc here
    next();
  } catch (err) {
    return res.status(403).json({ auth: "Failed", message: err.message });
  }
};

//[SECTION] Verify Admin

module.exports.verifyAdmin = (req, res, next) => {

    // console.log("result from verifyAdmin method");
    // console.log(req.user);

    // Checks if the owner of the token is an admin.
    if(req.user.isAdmin){
        // If it is, move to the next middleware/controller using next() method.
        next();
    } else {
        // Else, end the request-response cycle by sending the appropriate response and status code.
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden"
        })
    }
}


// [SECTION] Error Handler
module.exports.errorHandler = (err, req, res, next) => {
    // Log the error
    console.error(err);

    // it ensures there's always a clear error message, either from the error itself or a fallback
    const statusCode = err.status || 500;
    const errorMessage = err.message || 'Internal Server Error';

    // Send a standardized error response
    //We construct a standardized error response JSON object with the appropriate error message, status code, error code, and any additional details provided in the error object.
    res.status(statusCode).json({
        error: {
            message: errorMessage,
            errorCode: err.code || 'SERVER_ERROR',
            details: err.details || null
        }
    });
};


