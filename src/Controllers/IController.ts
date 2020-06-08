//A generic interface to allow all routes to be registered upon application initialization.
import * as express from 'express';

export default interface IController {
  registerRoutes(app: express.Application): void;
} 