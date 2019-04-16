module.exports = (req, res, next) => {

  const ApiToTest = require('../models/ApiToTest');
  const moment = require('moment');

  ApiToTest.find({}, function(err, apis){
    if(err){
      console.log(err);
      res.render('errorPage', {
        pageTitle: 'Database Error',
        pageName: 'errorPage',
        message: 'There was an error retrieving database records.'
      });
    }
    else{
      let apiList = [];
      for(let api of apis){
        let n = 0;
        // for(let getCheck of api.getChecks){
        //   console.log(n + ') ' + getCheck.timestamp)
        // }
        apiList.push({
          name: api.displayName ? api.displayName : '',
          url: api.displayUrl,
          get: api.tests.wasSuccessful ? 'success' : 'error',
          lastTest: api.tests.length === 0 ? '' : moment(api.tests[api.tests.length -1].timestamp).format('lll'),
          id: api._id
        });
      }
      res.render('overview', {
        pageTitle: 'Apis Overview',
        pageName: 'overview',
        apis: apiList
      });
    }
  });
};