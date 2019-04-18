module.exports = (req, res, next) => {

  const ApiToTest = require('../models/ApiToTest');
 
  const requestBody = JSON.parse(req.body.requestBody);

  requestBody.emails = requestBody.emails ? requestBody.emails.split(',') : [];

  // Since the top level url field is just for display, strip off 'http'/'https'
  if(requestBody.url.startsWith('http')){
    requestBody.url = requestBody.url.split('//')[1];
  }
  
  const newApi = new ApiToTest(requestBody);
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