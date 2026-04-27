import { Models } from 'appwrite';

// To extend the Request interface with a custom 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: Models.User<Models.Preferences>;
    }
  }
}
