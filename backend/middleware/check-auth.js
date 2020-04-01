/***********************************
; Title:  Check Authorization
; Author: Kurt Leadley
; Date:   15 March 2020
; Description: using jwt to check authorization around
; the site to restrict / enable crud
***************************************************************/
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // split the header and grab our token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    // if everything matches, we are authorized
    req.employeeData = {email: decodedToken.email, eId: decodedToken.eId};
    next();
  } catch (error) {
    res.status(401).json({
      // message: "Auth Failed - check-auth.js"
      message: req.headers.authorization
    });
  }
};
