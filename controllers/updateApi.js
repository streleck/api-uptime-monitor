module.exports = (req, res, next) => {

  const ApiToTest = require('../models/ApiToTest');
  
  const updateObject = JSON.parse(req.body.updateObject);

  console.log(req.body);
  
  ApiToTest.findOneAndUpdate(
    { _id: req.body.apiId },
    updateObject
  )
  .then((API) => {
    res.send("success");
  })
  .catch((error) => {
    res.status(500).send('database error');
    console.log(error);
  })
} 