/* eslint-disable prefer-const */
import {
    IConceptDeclaration,
    IDecorator,
    IIntegerDomainValidator,
    ILongDomainValidator,
    IEnumProperty,
    DeclarationUnion,
    IEnumDeclaration,
    IRelationshipProperty,
  } from '@accordproject/concerto-types';
  import { CRUD_ARGUMENTS, ConcertoASTUtil, DECORATOR_NAMES } from '../concertoASTUtil';
  import { ChildRelationship, Field, PicklistValue, SObjectDescribe, SalesforceFieldType } from 'ts-force';
  import { SoapTypes } from './soapTypes';
  
  export const ENUM_SUFFIX = 'Enum';
  
  type CompoundFieldName = string;
  type PropertyName = string;
  
  const LONG_SF_TYPE = 'long';
  
  /**
   * A class to transform Data Model to Concerto
   */
  export class DataModelTransformer {
    /**
     * Transforms the a list of sObjects into a list IConcepDeclarations
     * @param sObjects The sObjects to be transformed
     * @returns A list of Declarations. Note this may include more
     *  Declarations then sObjects inputted due to EnumDeclarations.
     */
    static transformSObjectsToConcerto(sObjects: SObjectDescribe[]): DeclarationUnion[] {
      return sObjects?.flatMap((sObject: SObjectDescribe) => DataModelTransformer.transformSObjectToConcerto(sObject)).flat();
    }
  
    /**
     * Transform SObject
     * @param sObject The sObject to transform
     * @return A DeclarationUnion[]
     */
    static transformSObjectToConcerto(sObject: SObjectDescribe): DeclarationUnion[] {
      const propertiesSeen: Set<string> = new Set<string>();
  
      let enumDeclarations: IEnumDeclaration[] = [];
      let concept: IConceptDeclaration = ConcertoASTUtil.getConcept(
        sObject.name,
        [],
        undefined,
        this.createGenericDecorators(sObject.label, this.getCrudDecoratorValue(sObject.createable, sObject.queryable, sObject.updateable)),
      );
      let compoundFieldsSeen: Set<CompoundFieldName> = new Set<CompoundFieldName>();
  
      // We need to process fields with a compound field name first to create a set of compoundFields
      const fields: Field[] = sObject.fields?.map(({ compoundFieldName, name, ...rest }) => ({
        compoundFieldName: compoundFieldName ? compoundFieldName : compoundFieldName,
        name: name,
        ...rest,
      }));
      fields
        ?.filter((field: Field) => field.compoundFieldName)
        .forEach((field: Field) => this.addFieldAsConceptProperty(field, concept, enumDeclarations, compoundFieldsSeen, propertiesSeen));
      fields
        ?.filter((field: Field) => !field.compoundFieldName)
        .forEach((field: Field) => this.addFieldAsConceptProperty(field, concept, enumDeclarations, compoundFieldsSeen, propertiesSeen));
      sObject.childRelationships
        ?.map(({ childSObject, relationshipName }) => ({
          childSObject: childSObject,
          relationshipName: relationshipName ? relationshipName : relationshipName,
        }))
        .filter((child: Partial<ChildRelationship>) => child.childSObject && child.relationshipName && !child.deprecatedAndHidden)
        .map((child: Partial<ChildRelationship>) =>
          ConcertoASTUtil.getRelationshipProperty(
            child.relationshipName!,
            child.childSObject!,
            this.createGenericDecorators(child.relationshipName!),
            true,
            true,
          ),
        )
        // Need to remove duplicates based on relationshipName
        // If a property already exists then we give it higher precedence as it is either a primitive or object property
        .forEach((property: IRelationshipProperty) => {
          if (!propertiesSeen.has(property.name)) {
            concept.properties.push(property);
            propertiesSeen.add(property.name);
          } else {
            console.log(`While transforming SObject: [${sObject.name}] a child relationship with relationship name: [${property.name}] was skipped`);
          }
        });
  
      return [concept, ...enumDeclarations];
    }
  
    /**
     * Populate property in the Concept Properties using the field
     * @param field The field to be transformed to a IProperty
     * @param declarations an array to store enums created along the way.
     *  This will only be mutated by adding enums if needed.
     * @param compoundFields the compounds fields seen so far.
     *  This will only be mutated by adding elements to the set.
     */
    private static addFieldAsConceptProperty(
      field: Field,
      concept: IConceptDeclaration,
      declarations: IEnumDeclaration[],
      compoundFieldsSeen: Set<CompoundFieldName>,
      propertiesSeen: Set<PropertyName>,
    ): void {
      if (propertiesSeen.has(field.name)) {
        console.log(`While transforming SObject: [${concept.name}] a field name: [${field.name}] was duplicated and skipped`);
        return;
      }
      propertiesSeen.add(field.name);
  
      let decorators: IDecorator[] = this.createGenericDecorators(
        field.label,
        compoundFieldsSeen.has(field.name) || field.type === SalesforceFieldType.ID.toString()
          ? this.getCrudDecoratorValue(false, true, false)
          : this.getCrudDecoratorValue(field.createable, field.filterable, field.updateable),
      );
      const isOptional = compoundFieldsSeen.has(field.name) || !(field.nillable === false && field.defaultedOnCreate === false);
  
      if (field.compoundFieldName) {
        compoundFieldsSeen.add(field.compoundFieldName);
      }
  
      if ((field.type as SalesforceFieldType) === SalesforceFieldType.REFERENCE) {
        field.type = this.getTypeBasedOnSoapType(field.soapType ?? '');
      }
  
      switch (field.type as SalesforceFieldType) {
        case SalesforceFieldType.ANYTYPE:
        case SalesforceFieldType.TIME:
        case SalesforceFieldType.BASE64:
        case SalesforceFieldType.ADDRESS:
        case SalesforceFieldType.LOCATION:
        case SalesforceFieldType.URL:
        case SalesforceFieldType.ID:
        case SalesforceFieldType.ENCRYPTEDSTRING: {
          if (field.type === SalesforceFieldType.ID) {
            // Identifying fields cannot be optional
            concept.identified = field.name ? ConcertoASTUtil.getIdentifiedBy(field.name) : undefined;
          }
          concept.properties.push(
            field.length
              ? ConcertoASTUtil.getStringProperty(
                  field.name,
                  decorators,
                  field.type === SalesforceFieldType.ID ? false : isOptional,
                  false,
                  undefined,
                  ConcertoASTUtil.getStringLengthValidator(undefined, field.length),
                )
              : ConcertoASTUtil.getStringProperty(field.name, decorators, isOptional),
          );
          break;
        }
        case SalesforceFieldType.BOOLEAN: {
          concept.properties.push(ConcertoASTUtil.getBooleanProperty(field.name, decorators, isOptional));
          break;
        }
        case SalesforceFieldType.DATE: {
          concept.properties.push(ConcertoASTUtil.getDatetimeProperty(field.name, decorators, isOptional));
          break;
        }
        case SalesforceFieldType.DATETIME: {
          concept.properties.push(ConcertoASTUtil.getDatetimeProperty(field.name, decorators, isOptional));
          break;
        }
        case SalesforceFieldType.CURRENCY:
        case SalesforceFieldType.PERCENT:
        case SalesforceFieldType.DOUBLE: {
          concept.properties.push(ConcertoASTUtil.getDoubleProperty(field.name, decorators, isOptional));
          break;
        }
        case SalesforceFieldType.INT:
        case SalesforceFieldType.INTEGER: {
          concept.properties.push(
            ConcertoASTUtil.getIntegerProperty(
              field.name,
              decorators,
              isOptional,
              false,
              field.digits ? this.transformDigitsToDomainValidator(field.digits, field.type as SalesforceFieldType) : undefined,
            ),
          );
          break;
        }
        case SalesforceFieldType.EMAIL: {
          concept.properties.push(
            ConcertoASTUtil.getStringProperty(
              field.name,
              decorators,
              isOptional,
              false,
              // Source: https://developer.DataModel.com/docs/marketing/marketing-cloud/guide/using_regular_expressions_to_validate_email_addresses.html
              ConcertoASTUtil.getStringRegexValidator(
                new RegExp(
                  /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
                ).toString(),
                '',
              ),
              ConcertoASTUtil.getStringLengthValidator(undefined, field.length),
            ),
          );
          break;
        }
        case SalesforceFieldType.PHONE: {
          concept.properties.push(
            ConcertoASTUtil.getStringProperty(
              field.name,
              decorators,
              isOptional,
              false,
              // This regex doesn't cover all cases but I dont think its possible with regex
              ConcertoASTUtil.getStringRegexValidator(new RegExp(/^([^?\\/:<>|+=@-][^?\\/:<>|]*)?$/).toString(), ''),
              ConcertoASTUtil.getStringLengthValidator(undefined, field.length),
            ),
          );
          break;
        }
        case SalesforceFieldType.COMBOBOX:
        case SalesforceFieldType.MULTIPICKLIST:
        case SalesforceFieldType.PICKLIST: {
          declarations.push(
            ConcertoASTUtil.getEnum(this.generateEnumName(concept.name, field.name), this.createEnumProperties(field.picklistValues), []),
          );
          concept.properties.push(
            ConcertoASTUtil.getObjectProperty(
              field.name,
              this.generateEnumName(concept.name, field.name),
              decorators,
              isOptional,
              field.type === (SalesforceFieldType.MULTIPICKLIST as string),
            ),
          );
          break;
        }
        case SalesforceFieldType.REFERENCE: {
          field.referenceTo[0]
            ? concept.properties.push(ConcertoASTUtil.getRelationshipProperty(field.name, field.referenceTo[0], decorators, isOptional))
            : // TODO: Decide what we want to do in this case where reference is not defined
              null;
          break;
        }
        case SalesforceFieldType.TEXTAREA:
        case SalesforceFieldType.STRING: {
          concept.properties.push(
            ConcertoASTUtil.getStringProperty(
              field.name,
              decorators,
              isOptional,
              false,
              undefined,
              ConcertoASTUtil.getStringLengthValidator(undefined, field.length),
            ),
          );
          break;
        }
        default: {
          console.log(`Unknown field type: ${field.type} encountered parsing SObjectDescribe ${concept.name}, in field ${field.name}`);
          if ((field.type as string) === LONG_SF_TYPE) {
            concept.properties.push(
              ConcertoASTUtil.getLongProperty(
                field.name,
                decorators,
                isOptional,
                false,
                field.digits ? this.transformDigitsToDomainValidator(field.digits, field.type as SalesforceFieldType) : undefined,
              ),
            );
          } else {
            concept.properties.push(ConcertoASTUtil.getStringProperty(field.name, decorators));
          }
        }
      }
    }
  
    /**
     * Transforms the digits limiter to a domain validator
     * @param digits the number of digits the field can have
     * @param type the type of the DataModel Field
     * @returns IDomainValidator restricted by number of digits
     */
    private static transformDigitsToDomainValidator(digits: number, type: SalesforceFieldType): IIntegerDomainValidator | ILongDomainValidator {
      // We need to subtract one because Concerto ranges are inclusive
      const limit: number = 10 ** digits - 1;
      switch (type as string) {
        case LONG_SF_TYPE: {
          return ConcertoASTUtil.getLongDomainValidator(-limit, limit);
        }
        default: {
          return ConcertoASTUtil.getIntegerDomainValidator(-limit, limit);
        }
      }
    }
  
    /**
     * Create a list of unique enum properties from picklist values
     * @param values The picklist values in the fields
     */
    private static createEnumProperties(values: PicklistValue[]): IEnumProperty[] {
      const valuesSeenSet: Map<string, PicklistValue> = new Map<string, PicklistValue>();
      for (const value of values) {
        if (!valuesSeenSet.has(value.value) || !valuesSeenSet.get(value.value)?.active) {
          valuesSeenSet.set(value.value, value);
        }
      }
      return Array.from(valuesSeenSet.values()).flatMap((value: PicklistValue) => this.createEnumPropertyFromListValue(value));
    }
  
    /**
     * Transform picklist value into a Concerto Enum Property
     * @param value the picklist value to transform
     * @returns A Enum Property
     */
    private static createEnumPropertyFromListValue(value: PicklistValue): IEnumProperty {
      return ConcertoASTUtil.getEnumProperty(value.value, value.label ? [ConcertoASTUtil.getStringDecorator(DECORATOR_NAMES.TERM, value.label)] : []);
    }
  
    /**
     * Generate a valid enum name, to avoid naming collisions
     * @example After transformation a Concept is called "EventType", but another concept called "Event"
     *  has an enum property called "Type" we need to make sure these two don't collide when naming
     *  the "Type" enum and hoisting it to the top level Declarations
     * @param enumName the name of the enum, which is escaped
     * @param fieldName the name of the property which points to the enum
     * @returns a valid concerto enum name∂
     */
    private static generateEnumName(enumName: string, fieldName: string): string {
      return `${enumName}${fieldName}_${ENUM_SUFFIX}`;
    }
  
    /**
     * Create a list of decorators that all fields need
     * @param input all the input params needed to create generic decorators
     * @returns IDecorator[] a list of generic decorators that all fields need
     */
    private static createGenericDecorators = (label: string, crudValue?: string): IDecorator[] => {
      return crudValue ? [
        ConcertoASTUtil.getStringDecorator(DECORATOR_NAMES.TERM, label),
        ConcertoASTUtil.getStringDecorator(DECORATOR_NAMES.CRUD, crudValue),
      ] : [
        ConcertoASTUtil.getStringDecorator(DECORATOR_NAMES.TERM, label),
      ]
    };
  
    /**
     * Creates a string with each CRUD value that is true seperated by a comma
     * For demo purposes always returns all the CRUD values
     * @param createable boolean to indicate if createable should be in string
     * @param readable boolean to indicate if readable should be in string
     * @param updateable boolean to indicate if updateable should be in string
     */
    private static getCrudDecoratorValue = (_createable: boolean, _readable: boolean, _updateable: boolean): string => {
      return [CRUD_ARGUMENTS.CREATEABLE, CRUD_ARGUMENTS.READABLE, CRUD_ARGUMENTS.UPDATEABLE]
        .join(',');
    };
  
    /**
     * Turns the soapType into a DataModel Field Type
     * @param soapType the soapType in the field
     */
    private static getTypeBasedOnSoapType(soapType: string): SalesforceFieldType {
      switch (soapType) {
        case SoapTypes.boolean:
          return SalesforceFieldType.BOOLEAN;
        case SoapTypes.date:
          return SalesforceFieldType.DATE;
        case SoapTypes.dateTime:
          return SalesforceFieldType.DATETIME;
        case SoapTypes.double:
          return SalesforceFieldType.DOUBLE;
        case SoapTypes.int:
          return SalesforceFieldType.INT;
        case SoapTypes.anyType:
        case SoapTypes.base64Binary:
        case SoapTypes.id:
        case SoapTypes.string:
          return SalesforceFieldType.STRING;
        default:
          return SalesforceFieldType.STRING;
      }
    }
  }
  