import { Request } from 'express';

interface User {
  id: string;
  email: string;
  username: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpressRequestInterface extends Request {
  user?: User;
}
