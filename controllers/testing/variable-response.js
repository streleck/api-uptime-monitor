module.exports = (req, res, next) => {

  let randomizer = Math.random();
  let statusCode;

  if(randomizer < 0.8){
    statusCode = 200;
  }
  else if(randomizer < 0.85){
    statusCode = 501;
  }
  else if(randomizer < 0.89){
    statusCode = 503;
  }
  else if(randomizer < 0.93){
    statusCode = 409;
  }
  else{
    statusCode = 500;
  }

  res.status(statusCode).send('this happened.')

  }