module.exports = (req, res, next) => {

  const ApiToTest = require('../models/ApiToTest');
  const moment = require('moment');

  
  function formatStats(timeFrame, test, stats){
    stats[timeFrame]["total tests"]++;
    if(test.wasSuccessful){
      stats[timeFrame].success++
    }
    else if(test.error.code){
      if(Object.keys(stats[timeFrame]).includes(test.error.code)){
        stats[timeFrame][test.error.code]++;
      }
      else{
        stats[timeFrame][test.error.code] = 1;
      }
    }
    else if(test.error.message){
      let formattedKey = 'Error code: ' + test.error.message.split(' ').pop();
      if(Object.keys(stats[timeFrame]).includes(formattedKey)){
        stats[timeFrame][formattedKey]++;
      }
      else{
        stats[timeFrame][formattedKey] = 1;
      }
    }
    else{
      if(Object.keys(stats[timeFrame]).includes('Other Error(no code)')){
        stats[timeFrame]['Other Error(no code)']++;
      }
      else{
        stats[timeFrame]['Other Error(no code)'] = 1;
      }
    }
    return stats;
  }

  ApiToTest.findOne({_id: req.params.id})
    .then((API) => {
    
    let stats = {
      "all-time": {
        "total tests": 0,
        success: 0
      },
      "last-hour": {
        "total tests": 0,
        success: 0
      },
      "last-twentyfour": {
        "total tests": 0,
        success: 0
      },
      "last-week": {
        "total tests": 0,
        success: 0
      },
    };

    const oneHourAgo = Date.now() - (1000 * 60 * 60);
    const twentyFourAgo = Date.now() - (1000 * 60 * 60 * 24);
    const sevenDaysAgo = Date.now() - (1000 * 60 * 60 * 24 * 7);
    for(let test of API.tests){
      stats = formatStats('all-time', test, stats);
      if(test.timestamp > oneHourAgo){
        stats = formatStats('last-hour', test, stats);
      }
      if(test.timestamp > twentyFourAgo){
        stats = formatStats('last-twentyfour', test, stats);
      }
      if(test.timestamp > sevenDaysAgo){
        stats = formatStats('last-week', test, stats);
      } 
    }

    var notes = API.notes.map((note) => {
      return { text: note.text, timestamp: moment(note.timestamp).format('M/DD LT'), _id: note._id};
    })

    res.render('detail', {
      pageName: 'detail',
      apiId: API._id,
      displayName: API.displayName,
      isPaused: API.isPaused,
      url: API.url,
      emails: API.emails,
      stats,
      notes: notes.reverse(),
    })
  })
  .catch((error) => {
    console.log(error);
  })
};