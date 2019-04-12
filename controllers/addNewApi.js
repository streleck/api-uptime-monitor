module.exports = (req, res, next) => {

  const ApiToTest = require('../models/ApiToTest');
  const monitorApi = require('../monitorApi');
  const axios = require('axios');

  var newApi = new ApiToTest({
    displayName: req.body.name,
    url: req.body.url,
    displayUrl: req.body.url.split('@')[1] ? req.body.url.split('@')[1] : req.body.url,
    emails: req.body.email.split(',')
  });
  newApi.save(function(err, doc) {
    if(err){
      console.log(err);
      res.render('errorPage', {
        pageTitle: 'Database Error',
        pageName: 'errorPage',
        message: 'There was an error saving record to database.'
      });
    }
    else {
      monitorApi(doc);
      res.redirect('/');
    }
  });
}