module.exports = (req, res, next) => {

  const ApiToTest = require('../models/ApiToTest');
 
  const requestBody = JSON.parse(req.body.requestBody);

  requestBody.emails = requestBody.emails ? requestBody.emails.split(',') : [];
  
  const newApi = new ApiToTest(requestBody);
  console.log('txxz: ', newApi);
  newApi.save(function(err, doc) {
    if(err){
      console.log(err);
      res.json({'success': false});
    }
    else {
      res.json({'success': true});
    }
 });
}