// We get the token from the frontend and verify if it's valid
// Note that we encode the email and id in the token

import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    // Note!! we should use req.headers.authorization here, not Authorization...

    // console.log("In auth middleware we show req.headers.authorization: ");
    // console.log(req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1];

    let decodedData;
    // If the token exists,
    if (token) {
      // jwt.verify(): Synchronously verify given token using a secret
      // or a public key to get a decoded token token
      decodedData = jwt.verify(token, "test");

      // header auth -> token -> decoded user id -> save to req.userId
      req.userId = decodedData?.id;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
