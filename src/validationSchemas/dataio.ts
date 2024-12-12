import { Schema } from 'express-validator';

export const dataIOCreateRecordBody: Schema = {
  data: { isObject: true },
  typeName: { isString: true },
  recordId: { isString: true, optional: true },
  idempotencyKey: { isString: true, optional: true },
};

export const dataIOPatchRecordBody: Schema = {
  data: { isObject: true },
  typeName: { isString: true },
  recordId: { isString: true },
};

export const dataIOSearchRecordsBody: Schema = {
  query: { isObject: true },
  pagination: { isObject: true },
};

export const dataIOGetTypeNamesRecordBody: Schema = {};

export const dataIOGetTypeDefinitionsRecordBody: Schema = {
  typeNames: { isArray: true }
}