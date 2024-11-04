const mongoose = require('mongoose');

const connectDB = () => {
  // Connect to MongoDB database
  mongoose
    .connect(`mongodb://127.0.0.1:27017/FactoryManagementDB`)
    .then(() => console.log('Connected to FactoryManagementDB'))
    .catch((error) => console.log(error));
};

module.exports = connectDB;
