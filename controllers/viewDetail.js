module.exports = (req, res, next) => {

  const ApiToTest = require('../models/ApiToTest');
  const moment = require('moment');

  ApiToTest.findOne({_id: req.params.id})
  .catch((error) => {
    console.log(error);
  })
  .then((API) => {
    res.render('detail', {
      pageName: 'detail',
      apiId: API._id,
      displayName: API.displayName,
      url: API.url,
      emails: API.emails,
      tests: API.tests
    })
  })
};