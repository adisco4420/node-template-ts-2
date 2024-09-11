import express from "express";
import path from "path";
import cors from "cors";
import helmet from 'helmet'
import errorHandler = require("errorhandler");
import { dbConfig } from './models/_config';
import { routes } from './routes/index.route';
import { morgan } from './utilities/logger.util';
import { airbrake, airbrakeExpress } from './app-middlewares/airbrake';
const port = process.env.PORT || 8082;

const app = express();

//configure application
app.use(express.static(path.join(__dirname, "public")));

//mount json form parser
app.use(express.json());

//mount query string parser
app.use(express.urlencoded({extended: true }));

app.use(helmet())
app.use(morgan)

//cors error allow
app.options("*", cors());
app.use(cors());

// catch 404 and forward to error handler
app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    err.status = 404;
    next(err);
});

//error handling
app.use(errorHandler());

dbConfig();

app.use(airbrakeExpress.makeMiddleware(airbrake));

routes(app);

app.use(airbrakeExpress.makeErrorHandler(airbrake));

app.listen(port, () => {  
  console.log(`Server is running on port ${port}`);
});