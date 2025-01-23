import { CreateRecordBody, GetTypeDefinitionsBody, GetTypeNamesBody, PatchRecordBody, SearchRecordsBody, TypeNameInfo } from '../models/datawriteback';
import { IReq, IRes } from '../utils/types';
import { QueryExecutor } from '../utils/queryExecutor';
import { FileDB } from '../db/fileDB';
import moment from 'moment';
import { ConceptDeclaration, ModelManager } from '@accordproject/concerto-core';
import path from 'path';
import { ModelManagerUtil } from '../utils/modelManagerUtil';
import { ResultRehydrator } from '../utils/resultRehydrator';

enum DECORATOR_NAMES {
  TERM = 'Term',
  CRUD = 'Crud',
}

enum CRUD_ARGUMENTS {
  CREATEABLE = 'Createable',
  READABLE = 'Readable',
  UPDATEABLE = 'Updateable',
}
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
 * Formats the date properties of the given data object to 'YYYY-MM-DDTHH:mm:ss.SSSZ'.
 * 
 * Iterates over the properties of the data object and checks if the property
 * is a date-time property based on the typeName. If it is a date-time property,
 * it validates and formats the date to 'YYYY-MM-DDTHH:mm:ss.SSSZ' using moment.
 * 
 * @param data - The data object containing properties to be formatted.
 * @param typeName - The type name used to identify date-time properties.
 * @throws Error if a date property does not match valid ISO 8601 formats.
 */
const formatISO8061DateProperties = (data: object, typeName: string): void => {
  const concept: ConceptDeclaration = CONCEPTS.filter(c => c.getName() === typeName)[0];
  const dataRecord: Record<string, unknown> = data as Record<string, unknown>;

  // Define a regex for valid ISO 8601 date-time formats
  const validISO8601Regex = /^(\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})?)?)$/;

  for (const key in dataRecord) {
    if (concept.getProperty(key).getType() === 'DateTime') {
      const value = dataRecord[key] as string;

      // Validate against allowed ISO 8601 formats
      if (!validISO8601Regex.test(value)) {
        throw new Error(`Invalid date format for property "${key}": "${value}". Must match a valid ISO 8601 format.`);
      }

      // Format to ISO 8601 UTC with 'Z' suffix (e.g., 'YYYY-MM-DDTHH:mm:ss.SSSZ')
      dataRecord[key] = moment.utc(value).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    }
  }
};


/**
 * Converts date properties of the given data object to ISO 8601 format.
 * 
 * Iterates over the properties of the data object and checks if the property
 * is a date-time property based on the typeName. If it is a date-time property,
 * it converts the date to ISO 8601 format using moment.
 * 
 * @param data - The data object containing properties to be converted.
 * @param typeName - The type name used to identify date-time properties.
 */
const convertDateToISO8601 = (data: object, typeName: string): void => {
  const concept: ConceptDeclaration = CONCEPTS.filter(c => c.getName() === typeName)[0];
  const dataRecord: Record<string, unknown> = data as Record<string, unknown>;
  for (const key in dataRecord) {
    if (concept.getProperty(key).getType() === 'DateTime') {
      dataRecord[key] = moment.utc(dataRecord[key] as string).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    }
  }
}

/**
 * Append .json to typeName, so that a file can be created for FileDB
 * @param typeName the typeName to create a file for
 * @returns {string}
 */
const generateFilePath = (typeName: string): string => `${typeName}.json`;

/**
 * Checks if the given declaration is a readable concept by checking for a Crud decorator with "Readable".
 * @param declaration - The declaration to check.
 * @returns {boolean} True if the declaration is a readable concept, false otherwise.
 */
const isReadableConcept = (concept: ConceptDeclaration): boolean => {
  return (concept.getDecorator(DECORATOR_NAMES.CRUD).arguments[0] as string).includes(CRUD_ARGUMENTS.READABLE);
}

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
 * Concerto model manager setup using CTO file.
 * Model manager allowes users to load in CTO files and use Concerto model features directly in code.
 */
const MODEL_MANAGER: ModelManager = ModelManagerUtil.createModelManagerFromCTO(path.join(__dirname, "../dataModel/model.cto"));
const CONCEPTS: ConceptDeclaration[] = MODEL_MANAGER.getConceptDeclarations();
const READABLE_CONCEPTS: ConceptDeclaration[] = CONCEPTS.filter(isReadableConcept);

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
    formatISO8061DateProperties(data, typeName);
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
    formatISO8061DateProperties(data, typeName);
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
    const dataResult: object = data[index];
    convertDateToISO8601(dataResult, query.from);

    return res.json({ records: [ResultRehydrator.filterAndRehydrate(query.attributesToSelect, data[index])] });
  } catch (err) {
    console.log(`Encountered an error searching data: ${err.message}`);
    return res.status(500).json(generateErrorResponse(ErrorCode.INTERNAL_ERROR, err)).send();
  }
};

/**
 * Retrieves the type names for Account and MasterRecordId and Address.
 * @param {IReq<GetTypeNamesBody>} req - the request object
 * @param {IRes} res - the response object
 * @return {IRes}
 */
export const getTypeNames = (req: IReq<GetTypeNamesBody>, res: IRes): IRes => {
  const typeNameInfos: TypeNameInfo[] = READABLE_CONCEPTS.map((concept: ConceptDeclaration) => {
    return {
      typeName: concept.getName(),
      label: (concept.getDecorator(DECORATOR_NAMES.TERM).getArguments()[0]) as unknown as string,
    }
  });

  return res.json({ typeNames: typeNameInfos as TypeNameInfo[]})
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
  MODEL_MANAGER.addCTOModel
  try {
    return res.json({
      declarations: READABLE_CONCEPTS.map((concept: ConceptDeclaration) => concept.ast)
    })
  } catch (err) {
    console.log(`Encountered an error getting type definitions: ${err.message}`);
    return res.status(500).json(generateErrorResponse(ErrorCode.INTERNAL_ERROR, err)).send();
  }
};