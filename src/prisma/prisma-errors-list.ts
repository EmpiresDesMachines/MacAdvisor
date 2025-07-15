import { HttpStatus } from '@nestjs/common';

export const prismaErrorsList: Record<
  string,
  { status: HttpStatus; message: string }
> = {
  P1001: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Database unavailable',
  },
  P1008: { status: HttpStatus.REQUEST_TIMEOUT, message: 'Request timeout' },
  P2000: { status: HttpStatus.BAD_REQUEST, message: 'Data value too long' },
  P2001: { status: HttpStatus.NOT_FOUND, message: 'Record does not exist' },
  P2002: {
    status: HttpStatus.CONFLICT,
    message: 'Reference Data already exists',
  },
  P2003: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Foreign key constraint failed',
  },
  P2011: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Required field missing',
  },
  P2014: { status: HttpStatus.BAD_REQUEST, message: 'Invalid ID provided' },
  P2025: { status: HttpStatus.NOT_FOUND, message: 'Record not found' },
};
