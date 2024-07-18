import { DeclarationUnion } from "@accordproject/concerto-types";
import { IQuery } from "./IQuery";


// CreateEntity 
export interface CreateRecordBody {
  /**
   * The type name of the record that is being created
   */
  typeName: string;

  /**
   * Optional identifier of the new record.
   * The external source may not accept the provided identifier and choose its own.
   */
  recordId?: string;

  /**
   * A unique key the application may use to identify duplicate (retry) requests.
   */
  idempotencyKey?: string;

  /**
   * Data to apply to the new record.
   */
  data: object;

}

export interface CreateRecordResponse {
  /**
   * The identifier of the new record.
   * Note that the external source may not accept the provided identifier and choose its own.
   * In any case, this represents the actual record identifier applied, if record creation is successful.
   */
  recordId: string;

}

// Patch Record
export type PatchRecordBody = {
  /**
   * The type name of the record that is being patched
   */
  typeName: string;

  /**
   * The identifier of the record to patch
   */
  recordId: string;

  /**
   * Includes only the portions of the record that require updating
   */
  data: object;

};

export type PatchRecordResponse = void;

// Search Record

/**
 * Represents pagination parameters when searching for records using queries
 */
export type SearchRecordsPagination = {
  /**
   * The maximum number of items to retrieve in a single search request.
   */
  limit: number;
  /**
   * The number of items to skip before starting to return search results.
   */
  skip: number;
};


export type SearchRecordsBody = {
  /**
   * The query to execute as the search criteria
   */
  query: IQuery;
  
  /**
   * The query to execute as the search criteria
   */
  pagination: SearchRecordsPagination
};

export type SearchRecordsResponse = object;

export type GetTypeNamesBody = void;

export type GetTypeNamesResponse = {
  /**
   * A collection of type names whose converted schemas the client is trying to retrieve.
   */
    typeNames: TypeNameInfo[];
}

/**
 * The error information given when type fails to be retrieved or transformed
 */
export type GetTypeDefinitionsError = {
  typeName: string;
  code: GetTypeDefinitionsErrorCode;
  message: string;
};

/**
 *  An exhaustive set of reason codes for the failure
 */
export enum GetTypeDefinitionsErrorCode {
    SCHEMA_RETRIEVAL_FAILED,
    SCHEMA_TRANSFORMATION_FAILED,
    UNKNOWN
}

export type TypeNameInfo = {
  /**
   * Name of the type
   */
  typeName: string;

  /**
   * A display friendly name of the underlying type that can be used to render on UX canvases
   */
  label: string;

  /**
   * A help text describing the purpose/use of the type
   */
  description?: string;
};


export type GetTypeDefinitionsBody = {
  /**
   * A collection of type names whose converted schemas the client is trying to retrieve.
   */
  typeNames: TypeNameInfo[];
}

export type GetTypeDefinitionsResponse = {
  /**
   * The converted list of schemas present in the external system
   * See https://concerto.accordproject.org/docs/design/specification/model-classes
   */
  declarations: DeclarationUnion[];
  
  /**
   * A list of errors associated with fetching or transforming the schemas
   */
  errors?: GetTypeDefinitionsError[];
}