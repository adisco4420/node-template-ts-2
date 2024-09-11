import * as express from "express";
import chalk = require('chalk');
import env from '../env';


import SampleRoute from './sample.route';
/**
 * Create and return Router.
 *
 * @class Server
 * @method config
 * @return void
 */
export const routes = (app: express.Application) => {
    let router: express.Router;
    router = express.Router();

    console.log(chalk.yellow.bgBlack.bold("Loading sample routes"));
    SampleRoute.loadRoutes('/samples', router);  

    router.get('/', (req, res) => res.send(`Welcome to Node-Template-TS-2 - ${env.NODE_ENV}`))

    //use router middleware
    app.use(router);

    app.all('*', (req, res)=> {
      console.log(req.url);
      return res.status(404).json({ status: 404, error: 'not found' });
    });
}