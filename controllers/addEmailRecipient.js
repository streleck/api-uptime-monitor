module.exports = (req, res, next) => {

  const ApiToTest = require('../models/ApiToTest');

  ApiToTest.findOneAndUpdate(
    { _id: req.body.apiId }, 
    { $push: { emails: req.body.newEmailAddress }},
    function(err, doc){
      if(err){
        console.log(err)
        res.render('errorPage', {
          pageTitle: 'Database Error',
          pageName: 'errorPage',
          message: 'There was an error updating this record in the database.'
        });
      }
      else {
        res.redirect('/details/' + req.body.apiId);
      };
    }
  )
}