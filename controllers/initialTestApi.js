module.exports = (req, res, next) => {

  const axios = require('axios');
 
  let requestBody = JSON.parse(req.body.requestBody).requestBody;

  axios(requestBody)
  .catch(function(error){
    //console.log(']]\n]]\n]]\n]]\n]]\n]]\n', error);
    res.json({"success": false, "code": error.code});
  })
  .then(function(response) {
    //console.log('##\n##\n##\n##\n##\n##\n##\n##\n##\n##\n', response);
    res.json({"success": true, "status": response.status, "statusText": response.statusText});
  })
   
}