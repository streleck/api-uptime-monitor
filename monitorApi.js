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

  function logTest(status, errorObject){
    console.log('trying to update test');
    ApiToTest.findOneAndUpdate(
      { _id: apiRecord._id }, 
      { $push: { tests: 
        { 
          wasSuccessful: status,
          timestamp: Date.now(),
          errorObject: errorObject
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
        let testStatus = doc.tests.length > 0 ? doc.getChecks[doc.tests.length -1].wasSuccessful : true;
        // test
        axios({
          method:'post',
          url: apiRecord.url + '/tests/_doc',
          data: {"datapoint": "test"},
          headers: {'Content-Type':'apilication/json'},
          httpsAgent: agent 
        })
        .then(function(response) {
          console.log('POST Success');
          if(!postStatus){
            sendEmails(
              'is functioning for POST',
              'After having previously failed a POST attempt, this api has now successfully accepted a POST.'
            );
          }
          logPostCheck(true, 'success');
        })
        .catch(function(error) {
          //console.log('POST fail!!!!! \n', error);
          console.log('POST fail!');
          logPostCheck(false, error);
          sendEmails(
            'has failed a POST attempt',
            error
          );
        });
      }
    });
    //run check every 5 minutes
  }, (1000 * 60 * 5));
}

