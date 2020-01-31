const jwt = require("jsonwebtoken");
let db = require("./db.js");
let ObjectID = require("mongodb").ObjectID;

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, process.env.JWT_KEY);
    const user = await db.dbFind("profiles", {
      _id: ObjectID(data._id),
      tokens: token
    });

    if (!user) {
      throw new Error();
    }
    req.jwt_user = (({ _id, username, email }) => ({ _id, username, email }))(user);
    req.jwt_token = token;
    next();
  } catch (error) {
    console.log("!!Unauthorized!!");
    res.status(401).send({ error: "You are not authorized to access this resource" });
  }
};
module.exports = auth;

//ref http://bit.ly/2GErhno
