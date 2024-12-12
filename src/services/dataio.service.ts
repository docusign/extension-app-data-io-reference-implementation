import { CreateRecordBody, GetTypeDefinitionsBody, GetTypeNamesBody, PatchRecordBody, SearchRecordsBody, TypeNameInfo, SearchRecordsResponse } from '../models/datawriteback';
import { IReq, IRes } from '../utils/types';
import { QueryExecutor } from 'src/utils/queryExecutor';
import { FileDB } from 'src/db/fileDB';
import model from '../dataModel/modelAst.json';
import { DeclarationUnion, IConceptDeclaration, IDecorator, IDecoratorLiteral, IDecoratorString } from '@accordproject/concerto-types';
import { CONCERTO_CONCEPT_DECLARATION_CLASS, CONCERTO_STRING_DECORATOR_CLASS, ConcertoASTUtil, CRUD_ARGUMENTS, DECORATOR_NAMES } from '../utils/concertoASTUtil';

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
 * Check if the given decorators has a Crud decorator that includes the given CRUD action
 * @param action The CRUD action to check for
 * @param decorators The decorators to search in
 * @returns {boolean} True if the decorators includes the CRUD action
 */
const hasCRUDActionDecorator = (action: string, decorators?: IDecorator[]): boolean => {
  return decorators?.some((decorator: IDecorator) => 
    decorator.name === DECORATOR_NAMES.CRUD &&
    decorator.arguments?.some((arg: IDecoratorLiteral)  => 
        arg.$class === CONCERTO_STRING_DECORATOR_CLASS &&
        (arg as IDecoratorString).value.includes(action)
    )
  ) || false;
}

/**
 * Checks if the given declaration is a readable concept by checking for a Crud decorator with "Readable".
 * @param declaration - The declaration to check.
 * @returns {boolean} True if the declaration is a readable concept, false otherwise.
 */
const isReadableConcept = (declaration: DeclarationUnion): boolean => {
  // Check if the declaration is a ConceptDeclaration
  return declaration.$class === CONCERTO_CONCEPT_DECLARATION_CLASS && declaration.decorators && hasCRUDActionDecorator(CRUD_ARGUMENTS.READABLE, declaration.decorators) || false
}

/**
 * Extracts the value of the TERM decorator from the provided decorators.
 * Every declaration and property must have a term decorator defined
 *
 * @param {IDecorator[]} decorators - An array of decorators to search through.
 * @returns {string} The value of the TERM decorator if found.
 */
const getTermDecoratorValue = (decorators?: IDecorator[]): string => {
  const stringDecorator: IDecoratorString = decorators?.filter((decorator: IDecorator) => decorator.name === DECORATOR_NAMES.TERM)[0].arguments![0] as IDecoratorString;
  return stringDecorator.value;
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
 * Retrieves the type names for Account and MasterRecordId and Address.
 * @param {IReq<GetTypeNamesBody>} req - the request object
 * @param {IRes} res - the response object
 * @return {IRes}
 */
export const getTypeNames = (req: IReq<GetTypeNamesBody>, res: IRes): IRes => {
  const concepts: IConceptDeclaration[] = model.declarations.filter(isReadableConcept) as IConceptDeclaration[];
  const typeNameInfos: TypeNameInfo[] = concepts.map((concept: IConceptDeclaration) => {
    return {
      typeName: concept.name,
      label: getTermDecoratorValue(concept.decorators),
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
  try {
    return res.json({
      declarations: model.declarations.filter(isReadableConcept)
    })
  } catch (err) {
    console.log(`Encountered an error getting type definitions: ${err.message}`);
    return res.status(500).json(generateErrorResponse(ErrorCode.INTERNAL_ERROR, err)).send();
  }
};