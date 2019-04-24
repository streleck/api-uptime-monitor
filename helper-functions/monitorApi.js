module.exports = function(apiRecord){
  
  const axios = require('axios');
  const https = require('https');
  
  const sendEmails = require('./sendEmails');
  const ApiToTest = require('../models/ApiToTest');
 
  // To allow http requests
  const agent = new https.Agent({  
    rejectUnauthorized: false
  });

  function logTest(status, errorInfo){
    ApiToTest.findOneAndUpdate(
      { _id: apiRecord._id }, 
      { $push: { tests: 
        { 
          wasSuccessful: status,
          timestamp: Date.now(),
          error: errorInfo
        }
      }})
      .catch(function(err){
        console.log('error writing test to database\n', err);
      })
  };

  let monitor = setInterval(function(){
    // Get most recent status of api
    ApiToTest.findOne({_id: apiRecord._id})
    .catch(function(error){
      console.log('error retrieving record. does it exist?', err);
      clearInterval(monitor);
    })
    .then(function(API){
      if(API.isPaused){
        clearInterval(monitor);
      }
      axios(apiRecord.requestBody)
      .then(function(response) {
        logTest(true, undefined);
      })
      .catch(function(error) {
        //console.log(`${apiRecord.requestBody.method} fail!`, error.message);
        const errorInfo = {
          message: error.message,
          code: error.code
        }
        logTest(false, errorInfo);
        let hasFailedLastThreeTests =
          API.tests.length >= 3 && (
          API.tests[API.tests.length -1].wasSuccessful ||
          API.tests[API.tests.length -2].wasSuccessful ||
          API.tests[API.tests.length -3].wasSuccessful);
        if(hasFailedLastThreeTests){
           sendEmails(
             apiRecord.emails,
             apiRecord.displayName ? apiRecord.displayName : apiRecord.url,
            `has failed a ${apiRecord.requestBody.method} attempt`,
            `Error Code: ${errorInfo.code} 
            Error Message: ${errorInfo.message}`
          );
        }
      });
    });
    //run check every 5 minutes
  }, (1000 * 60 * 5));
}