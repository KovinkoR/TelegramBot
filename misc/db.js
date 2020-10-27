const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.pluralize(null);

module.exports.mongooseConnect =  mongoose.connect(process.env.DATABASE_NAME, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
