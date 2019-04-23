module.exports = (req, res, next) => {

  const ApiToTest = require('../models/ApiToTest');

  ApiToTest.findOneAndDelete(
    { _id: req.body.appId },
  )
  .then((API) => {
    res.send("success");
  })
  .catch((error) => {
    res.status(500).send('database error');
    console.log(error);
  })
} 