
import { DataModelTransformer } from '../utils/dataTransformer/dataModelTransformer';
import { CreateRecordBody, CreateRecordResponse, GetTypeDefinitionsBody, GetTypeNamesBody, PatchRecordBody, SearchRecordsBody, TypeNameInfo, SearchRecordsResponse } from '../models/datawriteback';
import { IReq, IRes } from '../utils/types';
import { AccountSObject } from 'src/mocks/AccountSObject';
import { MasterRecordIdSObject } from 'src/mocks/MasterRecordIdSObject';
import { QueryExecutor } from 'src/utils/queryExecutor';
import { FileDB } from 'src/db/fileDB';

enum ErrorCode {
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
}

type ErrorResponse = {
  message: string;
  code: string;
}

/**
 * Append .json to typeName, so that a file can be created for FileDB
 * @param typeName the typeName to create a file for
 * @returns {string}
 */
const generateFilePath = (typeName: string): string => `${typeName}.json`;

/**
 * Generates an error response object with the provided message and code.
 *
 * @param {string} message - The error message.
 * @param {string} code - The error code.
 * @return {ErrorResponse} The generated error response object.
 */
const generateErrorResponse = (message: string, code: string): ErrorResponse => {
  return {
    message,
    code
  }
}

/**
 * Create a record in the database based on the provided data and typeName.
 * @param {IReq<CreateRecordBody>} req - The request object containing data and typeName.
 * @param {IRes} res - The response object to send back.
 * @return {IRes}
 */
export const createRecord = (req: IReq<CreateRecordBody>, res: IRes): IRes => {
  const {
    body: {
      data,
      typeName
    },
  } = req;
  try {
    if (!data || !typeName) {
      return res.status(400).json(generateErrorResponse(ErrorCode.BAD_REQUEST, 'data or typeName missing in request')).send();
    }
    const db: FileDB = new FileDB(generateFilePath(typeName));
    const recordId: string = JSON.stringify(db.readFile().length);
    (data as any)['Id'] = recordId;
    db.appendToFile(data)
    return res.json({ recordId });
  } catch (err) {
    console.log(`Encountered an error creating data: ${err.message}`);
    return res.status(500).json(generateErrorResponse(ErrorCode.INTERNAL_ERROR, err)).send();
  }
};

/**
 * Patches a record in the database.
 * @param {IReq<PatchRecordBody>} req - The request object containing data, typeName, and recordId.
 * @param {IRes} res - The response object to send back.
 * @return {IRes}
 */
export const patchRecord = (req: IReq<PatchRecordBody>, res: IRes): IRes => {
  const {
    body: {
      data,
      typeName,
      recordId
    },
  } = req;
  try {
    if (!data || !typeName || !recordId) {
      return res.status(400).json(generateErrorResponse(ErrorCode.BAD_REQUEST, 'data, typeName or recordId missing in request')).send();
    }
    const db: FileDB = new FileDB(generateFilePath(typeName));
    db.updateFile(recordId as unknown as number, data)
    return res.json({ success: true });
  } catch (err) {
    console.log(`Encountered an error patching data: ${err.message}`);
    return res.status(500).json(generateErrorResponse(ErrorCode.INTERNAL_ERROR, err)).send();
  }
};

/**
 * Searches records based on the provided query and pagination.
 * @param {IReq<SearchRecordsBody>} req - The request object containing query and pagination.
 * @param {IRes} res - The response object to send back.
 * @return {IRes}
 */
export const searchRecords = (req: IReq<SearchRecordsBody>, res: IRes): IRes => {
  const {
    body: {
      query,
      pagination
    },
  } = req;
  try {
    if (!query || !pagination) {
      return res.status(400).json(generateErrorResponse(ErrorCode.BAD_REQUEST, 'Query or pagination missing in request')).send();
    }
    const db: FileDB = new FileDB(generateFilePath(query.from));
    const data: object[] = db.readFile();
    const index: number = QueryExecutor.execute(query, data);
    if (index === -1) {
      return res.json({ records: [] })
    }
    return res.json({ records: [data[index]] });
  } catch (err) {
    console.log(`Encountered an error searching data: ${err.message}`);
    return res.status(500).json(generateErrorResponse(ErrorCode.INTERNAL_ERROR, err)).send();
  }
};

/**
 * Retrieves the type names for Account and MasterRecordId.
 * @param {IReq<GetTypeNamesBody>} req - the request object
 * @param {IRes} res - the response object
 * @return {IRes}
 */
export const getTypeNames = (req: IReq<GetTypeNamesBody>, res: IRes): IRes => {
  return res.json({ typeNames: [{typeName: "Account", label: "Account"}, {typeName: "MasterRecordId", label: "The Master Record Id"}] as TypeNameInfo[]})
};

/**
 * Retrieves the type definitions for the given type names.
 * @param {IReq<GetTypeDefinitionsBody>} req - The request object.
 * @param {IRes} res - The response object.
 * @return {IRes}
 */
export const getTypeDefinitions = (req: IReq<GetTypeDefinitionsBody>, res: IRes): IRes => {
  const {
    body: {
      typeNames
    },
  } = req;
  if (!typeNames) {
    return res.status(400).json(generateErrorResponse(ErrorCode.BAD_REQUEST, 'Missing typeNames in request')).send();
  }
  try {
    return res.json({
      declarations: DataModelTransformer.transformSObjectsToConcerto([AccountSObject as any, MasterRecordIdSObject as any])
    })
  } catch (err) {
    console.log(`Encountered an error getting type definitions: ${err.message}`);
    return res.status(500).json(generateErrorResponse(ErrorCode.INTERNAL_ERROR, err)).send();
  }
};
