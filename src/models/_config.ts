import mongoose = require("mongoose"); 
import env from '../env';
import chalk = require('chalk');

mongoose.set('strictQuery', false)

export const dbConfig = () => {
    // Connect to MongoDB
    if(env.MONGODB_URI) {
      mongoose.connect(env.MONGODB_URI)
      .then(() => {
        console.log('✌🏾 Successfully connected to MongoDB');
      })
      .catch(err => {
        console.log(err);
        console.log(chalk.red.bgBlack.bold('An error occured while conencting to MongoDB'));
      });
    } else {
      console.log('MONGODB_URI environment varaiable is required.');
      
    }
}
 