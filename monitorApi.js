module.exports = function(apiRecord){
  
  const axios = require('axios');
  const https = require('https');
  const sgMail = require('@sendgrid/mail');
  var ApiToTest = require('./models/ApiToTest');

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  // To allow http requests
  const agent = new https.Agent({  
    rejectUnauthorized: false
  });

  function sendEmails(subjectText, bodyText){ 
    for(let address of apiRecord.emails){
      let msg = {
        to: address,
        from: 'streleck@gmail.com',
        subject: 'Your API, ' + (apiRecord.displayName ? apiRecord.displayName : apiRecord.displayUrl) + ', ' + subjectText,
        text: 'Api url: ' + apiRecord.url + '\n \n' + bodyText,
      };
      sgMail.send(msg);
    }
  };

  function logTest(status, error){
    console.log('trying to update test');
    ApiToTest.findOneAndUpdate(
      { _id: apiRecord._id }, 
      { $push: { tests: 
        { 
          wasSuccessful: status,
          timestamp: Date.now(),
          error: error
        }
      }},
      function(err, doc){
        if(err){
          console.log(err)
        }
        else {
          //console.log(doc)
        };
      }
    )
  };

  let monitor = setInterval(function(){
    // Get most recent status of api
    ApiToTest.findOne({_id: apiRecord._id}, function(err, doc){
      // If record isn't in DB, cancel the monitor
      if(err) {
        clearInterval(monitor);
        return;
      }
      else {
        //let testStatus = doc.tests.length > 0 ? doc.checks[doc.tests.length -1].wasSuccessful : true;
        // test
        let testStatus = true;
        axios(apiRecord.requestData)
        .then(function(response) {
          console.log('success;!')
          if(!testStatus){
            sendEmails(
              'is back to functioning.',
              'After having previously failed an attempt, this api has returned a successful response.'
            );
          }
          logTest(true, 'success');
        })
        .catch(function(error) {
          console.log(`${apiRecord.requestBody.method} fail!`);
          logTest(false, error);
          sendEmails(
            `has failed a ${apiRecord.requestBody.method} attempt`,
            error
          );
        });
      }
    });
    //run check every 5 minutes
  // }, (1000 * 60 * 5));
  }, (1000 * 10));
}