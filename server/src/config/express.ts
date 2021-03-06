import compress from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import methodOverride from "method-override";
import morgan from "morgan";
import { error } from "../api/middlewares/error";
import adminRoutes from "../api/routes/admin";
import clientRoutes from "../api/routes/users";
import { logs } from "./variables";
/**
* Error handling
* @ToDo
* Intercept error and handle with middlewares
*/

/**
* Express instance
* @public
*/
const app = express();

// request logging. dev: console | production: file
app.use(morgan(logs));

// parse body params and attache them to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// mount admin routes
app.use('/admin', adminRoutes);
// mount client routes
app.use('/client', clientRoutes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

export default app;
