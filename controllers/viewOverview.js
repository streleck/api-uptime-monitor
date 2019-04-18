module.exports = (req, res, next) => {

  const ApiToTest = require('../models/ApiToTest');
  const moment = require('moment');

  ApiToTest.find({})
  .catch(function(error){
    console.log(error);
    res.render('errorPage', {
      pageTitle: 'Database Error',
      pageName: 'errorPage',
      message: 'There was an error retrieving database records.'
    });
  })
  .then(function(apis){
    let apiList = [];
    for(let api of apis){
      let n = 0;
      // for(let getCheck of api.getChecks){
      //   console.log(n + ') ' + getCheck.timestamp)
      // }
      apiList.push({
        name: api.displayName,
        url: api.url,
        lastTest: api.tests.length === 0 ? 'none' : moment(api.tests[api.tests.length -1].timestamp).format('L LT'),
        id: api._id,
        tests: api.tests
      });
    }
    res.render('overview', {
      pageTitle: 'Apis Overview',
      pageName: 'overview',
      apis: apiList
    });
  });
};