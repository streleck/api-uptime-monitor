module.exports = (req, res, next) => {

  const ApiToTest = require('../models/ApiToTest');
  const monitorAPI = require('../helper-functions/monitorApi')
 
  const requestBody = JSON.parse(req.body.requestBody);

  requestBody.emails = requestBody.emails ? requestBody.emails.split(',') : [];

  // Since the top level url field is just for display, strip off 'http'/'https'
  if(requestBody.url.startsWith('http')){
    requestBody.url = requestBody.url.split('//')[1];
  }
  
  const newApi = new ApiToTest({...requestBody, tests: {wasSuccessful: true, timestamp: Date.now()}});
  newApi.save(function(err, API) {
    if(err){
      console.log(err);
      res.json({'success': false});
    }
    else {
      monitorAPI(API)
      res.json({'success': true});
    }
 });
}