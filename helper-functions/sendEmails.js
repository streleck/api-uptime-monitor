
module.exports = function (addresses, displayName, subjectText, bodyText){ 
  
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  for(let address of addresses){
    let msg = {
      to: address,
      from: 'streleck@gmail.com',
      subject: 'Your API, ' + (apiRecord.displayName ? apiRecord.displayName : apiRecord.displayUrl) + ', ' + subjectText,
      text: 'Api url: ' + apiRecord.url + '\n \n' + bodyText,
    };
    sgMail.send(msg);
  }
};