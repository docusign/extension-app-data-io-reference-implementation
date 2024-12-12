import { validationResult } from 'express-validator';
import { IReq, IRes } from '../utils/types';
import { NextFunction } from 'express';
import HttpStatusCodes from '../constants/http';

export default (req: IReq<unknown>, res: IRes, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }
  return next();
};
