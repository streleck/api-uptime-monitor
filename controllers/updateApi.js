module.exports = (req, res, next) => {

  const ApiToTest = require('../models/ApiToTest');
  const monitorApi = require('../helper-functions/monitorApi');
  
  let updateObject = JSON.parse(req.body.updateObject);
   
  if(req.body.operation === 'push'){
    updateObject = { "$push": updateObject };
  }
  else if(req.body.operation === 'pull'){
    updateObject = { "$pull": updateObject};
  }

  ApiToTest.findOneAndUpdate(
    { _id: req.body.apiId },
    updateObject
  )
  .then((API) => {
    if(req.body.operation === 'unpause'){
      monitorApi(API);
    }
    res.send("success");
  })
  .catch((error) => {
    res.status(500).send('database error');
    console.log(error);
  })
  
} 