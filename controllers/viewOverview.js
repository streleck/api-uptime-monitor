module.exports = (req, res, next) => {

  const ApiToTest = require('../models/ApiToTest');
  const moment = require('moment');

  ApiToTest.find({})
  .catch(function(error){
    console.log(error);
    res.render('errorPage', {
      pageName: 'errorPage',
      message: 'There was an error retrieving database records.'
    });
  })
  .then(function(apis){
    let apiList = [];
    for(let api of apis){
        const lastFailAt = api.tests.filter((test) => !test.wasSuccessful).map((fail) => fail.timestamp).pop();
        apiList.push({
        name: api.displayName,
        url: api.url,
        lastFail: lastFailAt ? moment(lastFailAt).format('M/DD LT') : '[no tests failed]',
        id: api._id,
        tests: api.tests
      });
    }
    res.render('overview', {
      pageName: 'overview',
      apis: apiList
    });
  });
};