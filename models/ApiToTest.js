// Require mongoose
var mongoose = require('mongoose');
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ApiToTestSchema = new Schema({
  displayName: {
    type: String,
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  emails: [{
    type: String,
  }],
  tests: [{
    wasSuccessful: Boolean,
    timestamp: Number,
    errorObject: String
  }]
});

// Create the Article model with the ArticleSchema
var ApiToTest = mongoose.model('ApiToTest', ApiToTestSchema);

// Export the model
module.exports = ApiToTest;
