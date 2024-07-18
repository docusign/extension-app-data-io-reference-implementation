/* eslint-disable @typescript-eslint/naming-convention */
import {
  IConceptDeclaration,
  IProperty,
  IDecorator,
  IIdentifiedBy,
  IObjectProperty,
  IStringProperty,
  IStringLengthValidator,
  IStringRegexValidator,
  IIntegerDomainValidator,
  IIntegerProperty,
  ILongProperty,
  ILongDomainValidator,
  IDoubleDomainValidator,
  IDoubleProperty,
  IDateTimeProperty,
  IEnumDeclaration,
  IEnumProperty,
  IRelationshipProperty,
  ITypeIdentifier,
  DecoratorLiteralUnion,
  IBooleanProperty,
  PropertyUnion,
  IDecoratorString,
  IDecoratorBoolean,
  IDecoratorNumber,
} from '@accordproject/concerto-types';

export enum DECORATOR_NAMES {
  TERM = 'Term',
  CRUD = 'Crud',
}

export enum CRUD_ARGUMENTS {
  CREATEABLE = 'Createable',
  READABLE = 'Readable',
  UPDATEABLE = 'Updateable',
}

export enum PLATFORM_MODELS {
  BINARY_FILE = 'BinaryFile',
  EMAIL = 'Email',
  MONETARY_AMOUNT = 'MonetaryAmount',
}

export const CONCERTO_METAMODEL_NAMESPACE = 'concerto.metamodel@1.0.0';

export const CONCERTO_MODEL_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.Model`;
export const CONCERTO_IMPORT_TYPE_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.ImportType`;
export const CONCERTO_IMPORT_TYPES_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.ImportTypes`;
export const CONCERTO_TYPE_IDENTIFIER_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.TypeIdentifier`;
export const CONCERTO_IDENTIFIED_BY_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.IdentifiedBy`;

export const CONCERTO_DECORATOR_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.Decorator`;
export const CONCERTO_STRING_DECORATOR_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.DecoratorString`;
export const CONCERTO_NUMBER_DECORATOR_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.DecoratorNumber`;
export const CONCERTO_BOOLEAN_DECORATOR_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.DecoratorBoolean`;
export const CONCERTO_TYPE_REFERENCE_DECORATOR_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.DecoratorTypeReference`;

export const CONCERTO_ENUM_DECLARATION_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.EnumDeclaration`;
export const CONCERTO_MAP_DECLARATION_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.MapDeclaration`;
export const CONCERTO_SCALAR_DECLARATION_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.ScalarDeclaration`;
export const CONCERTO_CONCEPT_DECLARATION_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.ConceptDeclaration`;

export const CONCERTO_RELATIONSHIP_PROPERTY_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.RelationshipProperty`;
export const CONCERTO_OBJECT_PROPERTY_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.ObjectProperty`;
export const CONCERTO_BOOLEAN_PROPERTY_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.BooleanProperty`;
export const CONCERTO_DATETIME_PROPERTY_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.DateTimeProperty`;
export const CONCERTO_STRING_PROPERTY_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.StringProperty`;
export const CONCERTO_DOUBLE_PROPERTY_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.DoubleProperty`;
export const CONCERTO_INTEGER_PROPERTY_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.IntegerProperty`;
export const CONCERTO_LONG_PROPERTY_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.LongProperty`;
export const CONCERTO_ENUM_PROPERTY_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.EnumProperty`;

export const CONCERTO_STRING_LENGTH_VALIDATOR_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.StringLengthValidator`;
export const CONCERTO_STRING_REGEX_VALIDATOR_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.StringRegexValidator`;
export const CONCERTO_INTEGER_DOMAIN_VALIDATOR_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.IntegerDomainValidator`;
export const CONCERTO_LONG_DOMAIN_VALIDATOR_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.LongDomainValidator`;
export const CONCERTO_DOUBLE_DOMAIN_VALIDATOR_CLASS = `${CONCERTO_METAMODEL_NAMESPACE}.DoubleValidator`;

/**
 * Class to create common Concerto metamodel objects
 */
export class ConcertoASTUtil {
  /**
   * Creates and IIdentifiedBy object
   * @param typeName The typeName to be identified by
   * @returns An IIdentifiedBy object
   */
  static getIdentifiedBy(typeName: string): IIdentifiedBy {
    return { $class: CONCERTO_IDENTIFIED_BY_CLASS, name: typeName };
  }

  /**
   * Creates and IIdentifiedBy object
   * @param typeName The typeName to be identified by
   * @returns An IIdentifiedBy object
   */
  static getTypeIdentifier(typeName: string): ITypeIdentifier {
    return {
      $class: CONCERTO_TYPE_IDENTIFIER_CLASS,
      name: typeName,
    };
  }

  /**
   * Create a Concerto Decorator
   * @param name The name of the decorator
   * @param value The value of the arguement of the decorator
   * @returns A IDecorator
   */
  static getDecorator(name: string, decoratorUnion: DecoratorLiteralUnion | DecoratorLiteralUnion[]): IDecorator {
    return {
      $class: CONCERTO_DECORATOR_CLASS,
      name,
      arguments: Array.isArray(decoratorUnion) ? decoratorUnion : [decoratorUnion],
    };
  }

  /**
   * Create a Concerto Decorator Literal
   * @param value The value of the arguement of the decorator
   * @param value The classVal for the literal
   * @returns A IDecorator
   */
  static getDecoratorLiteralUnion(value: unknown, classVal: string): DecoratorLiteralUnion {
    return {
      $class: classVal,
      value,
    } as DecoratorLiteralUnion;
  }

  /**
   * Create a Concerto Number Decorator Literal
   * @param value The value of the arguement of the decorator
   * @param value The classVal for the literal
   * @returns A IDecorator
   */
  static getNumberDecoratorLiteral(values: number): DecoratorLiteralUnion {
    return this.getDecoratorLiteralUnion(values, CONCERTO_NUMBER_DECORATOR_CLASS) as IDecoratorNumber;
  }

  /**
   * Create a Concerto Boolean Decorator Literal
   * @param value The value of the arguement of the decorator
   * @param value The classVal for the literal
   * @returns A IDecorator
   */
  static getBooleanDecoratorLiteral(values: boolean): DecoratorLiteralUnion {
    return this.getDecoratorLiteralUnion(values, CONCERTO_BOOLEAN_DECORATOR_CLASS) as IDecoratorBoolean;
  }

  /**
   * Create a Concerto Boolean Decorator Literal
   * @param value The value of the arguement of the decorator
   * @param value The classVal for the literal
   * @returns A IDecorator
   */
  static getStringDecoratorLiteral(values: string): DecoratorLiteralUnion {
    return this.getDecoratorLiteralUnion(values, CONCERTO_STRING_DECORATOR_CLASS) as IDecoratorString;
  }

  /**
   * Create a Concerto Number Decorator
   * @param name The name of the decorator
   * @param value The value of the arguement of the decorator
   * @returns A IDecorator
   */
  static getNumberDecorator(name: string, value: number): IDecorator {
    return this.getDecorator(name, this.getNumberDecoratorLiteral(value));
  }

  /**
   * Create a Concerto Boolean Decorator
   * @param name The name of the decorator
   * @param value The value of the arguement of the decorator
   * @returns A IDecorator
   */
  static getBooleanDecorator(name: string, value: boolean): IDecorator {
    return this.getDecorator(name, this.getBooleanDecoratorLiteral(value));
  }

  /**
   * Create a Concerto String Decorator
   * @param name The name of the decorator
   * @param value The value of the arguement of the decorator
   * @returns A IDecorator
   */
  static getStringDecorator(name: string, value: string): IDecorator {
    return this.getDecorator(name, this.getStringDecoratorLiteral(value));
  }

  /**
   * Create a Concerto Enum
   * @param name The name of the Enum
   * @param properties The properties of the Enum
   * @returns A Enum
   */
  static getEnum(name: string, properties: IEnumProperty[], decorators?: IDecorator[]): IEnumDeclaration {
    return {
      $class: CONCERTO_ENUM_DECLARATION_CLASS,
      name,
      properties,
      decorators,
    };
  }

  /**
   * Create a Concerto Enum Property
   * @param name The name of the Enum
   * @param properties The properties of the Enum
   * @returns A Enum
   */
  static getEnumProperty(name: string, decorators?: IDecorator[]): IEnumProperty {
    return {
      $class: CONCERTO_ENUM_PROPERTY_CLASS,
      name,
      decorators,
    };
  }

  /**
   * Create a Concerto Concept
   * @param name The name of the Concept
   * @param properties The properties of the concept
   * @param identifier The identifier of the concept
   * @param decorators The decorators of the concept
   * @returns A Concept
   */
  static getConcept(name: string, properties: IProperty[], identifier?: string, decorators?: IDecorator[]): IConceptDeclaration {
    const concept: IConceptDeclaration = {
      $class: CONCERTO_CONCEPT_DECLARATION_CLASS,
      name,
      isAbstract: false,
      properties: properties,
      decorators,
    };
    if (identifier) {
      concept.identified = this.getIdentifiedBy(identifier);
    }
    return concept;
  }

  /**
   * Create a Concerto Property
   * @param name The name of the property
   * @param type The type of the property
   * @param decorators The decorator applied to the property
   * @param isOptional Is this property optional
   * @param isArray Is this property an array
   * @returns An IProperty
   */
  static getProperty(name: string, classVal: string, decorators: IDecorator[], isOptional?: boolean, isArray?: boolean): PropertyUnion {
    return {
      $class: classVal,
      name,
      isOptional: isOptional ?? true,
      isArray: isArray ?? false,
      decorators,
    } as PropertyUnion;
  }

  /**
   * Create a Concerto Boolean Property
   * @param name The name of the property
   * @param type The type of the property
   * @param decorators The decorator applied to the property
   * @param isOptional Is this property optional
   * @param isArray Is this property an array
   * @returns An IProperty
   */
  static getBooleanProperty(name: string, decorators: IDecorator[], isOptional?: boolean, isArray?: boolean): IBooleanProperty {
    return this.getProperty(name, CONCERTO_BOOLEAN_PROPERTY_CLASS, decorators, isOptional, isArray) as IBooleanProperty;
  }

  /**
   * Create a Concerto Datetime Property
   * @param name The name of the property
   * @param decorators The decorator applied to the property
   * @param isOptional Is this property optional
   * @returns An IDatetimeProperty
   */
  static getDatetimeProperty(name: string, decorators: IDecorator[], isOptional?: boolean, isArray?: boolean): IDateTimeProperty {
    return {
      ...this.getProperty(name, CONCERTO_DATETIME_PROPERTY_CLASS, decorators, isOptional, isArray),
    } as IDateTimeProperty;
  }

  /**
   * Create a Concerto Double Property
   * @param name The name of the property
   * @param decorators The decorator applied to the property
   * @param isOptional Is this property optional
   * @param domainValidator The range of values the double can lie between
   * @returns An IDoubleProperty
   */
  static getDoubleProperty(
    name: string,
    decorators: IDecorator[],
    isOptional?: boolean,
    isArray?: boolean,
    domainValidator?: IDoubleDomainValidator,
  ): IDoubleProperty {
    return {
      ...this.getProperty(name, CONCERTO_DOUBLE_PROPERTY_CLASS, decorators, isOptional, isArray),
      validator: domainValidator,
    } as IDoubleProperty;
  }

  /**
   * Create a Concerto Long Property
   * @param name The name of the property
   * @param decorators The decorator applied to the property
   * @param isOptional Is this property optional
   * @param domainValidator The range of values the long can lie between
   * @returns An ILongProperty
   */
  static getLongProperty(
    name: string,
    decorators: IDecorator[],
    isOptional?: boolean,
    isArray?: boolean,
    domainValidator?: ILongDomainValidator,
  ): ILongProperty {
    return {
      ...this.getProperty(name, CONCERTO_LONG_PROPERTY_CLASS, decorators, isOptional, isArray),
      validator: domainValidator,
    } as ILongProperty;
  }

  /**
   * Create the domain validor of a numeric type
   * @param minLength the minimum length of the string
   * @param maxLength the maximum length of the string
   * @returns IIntegerDomainValidator | ILongDomainValidator | IDoubleDomainValidator
   */
  static getIDomainValidator(
    classVal: string,
    minLength?: number,
    maxLength?: number,
  ): IIntegerDomainValidator | ILongDomainValidator | IDoubleDomainValidator {
    return {
      $class: classVal,
      upper: maxLength,
      lower: minLength,
    };
  }

  /**
   * Create the domain validor of a integer type
   * @param minLength the minimum length of the string
   * @param maxLength the maximum length of the string
   * @returns IIntegerDomainValidator
   */
  static getIntegerDomainValidator(minLength?: number, maxLength?: number): IIntegerDomainValidator {
    return this.getIDomainValidator(CONCERTO_INTEGER_DOMAIN_VALIDATOR_CLASS, minLength, maxLength);
  }

  /**
   * Create the domain validor of a long type
   * @param minLength the minimum length of the string
   * @param maxLength the maximum length of the string
   * @returns ILongDomainValidator
   */
  static getLongDomainValidator(minLength?: number, maxLength?: number): ILongDomainValidator {
    return this.getIDomainValidator(CONCERTO_LONG_DOMAIN_VALIDATOR_CLASS, minLength, maxLength);
  }

  /**
   * Create the domain validor of a double type
   * @param minLength the minimum length of the string
   * @param maxLength the maximum length of the string
   * @returns ILongDomainValidator
   */
  static getDoubleDomainValidator(minLength?: number, maxLength?: number): IDoubleDomainValidator {
    return this.getIDomainValidator(CONCERTO_DOUBLE_DOMAIN_VALIDATOR_CLASS, minLength, maxLength);
  }

  /**
   * Create a Concerto Integer Property
   * @param name The name of the property
   * @param decorators The decorator applied to the property
   * @param isOptional Is this property optional
   * @param domainValidator The range of values the integer can lie between
   * @returns An IIntegerProperty
   */
  static getIntegerProperty(
    name: string,
    decorators: IDecorator[],
    isOptional?: boolean,
    isArray?: boolean,
    domainValidator?: IIntegerDomainValidator,
  ): IIntegerProperty {
    return {
      ...this.getProperty(name, CONCERTO_INTEGER_PROPERTY_CLASS, decorators, isOptional, isArray),
      validator: domainValidator,
    } as IIntegerProperty;
  }

  /**
   * Create a Concerto String Property
   * @param name The name of the property
   * @param decorators The decorator applied to the property
   * @param isOptional Is this property optional
   * @param regexValidator The regex pattern used to validate the string
   * @param lengthValidator the validator pertaining to what length the string should be
   * @returns An IStringProperty
   */
  static getStringProperty(
    name: string,
    decorators: IDecorator[],
    isOptional?: boolean,
    isArray?: boolean,
    regexValidator?: IStringRegexValidator,
    lengthValidator?: IStringLengthValidator,
  ): IStringProperty {
    return {
      ...this.getProperty(name, CONCERTO_STRING_PROPERTY_CLASS, decorators, isOptional, isArray),
      validator: regexValidator,
      lengthValidator,
    } as IStringProperty;
  }

  /**
   * Create the IStringRegexValidator
   * @param pattern the regex pattern to use to validate
   * @param flags the flags to apply to the regex pattern
   * @param isOptional Is this property optional
   * @returns IStringRegexValidator
   */
  static getStringRegexValidator(pattern: string, flags: string): IStringRegexValidator {
    return {
      $class: CONCERTO_STRING_REGEX_VALIDATOR_CLASS,
      pattern,
      flags,
    } as IStringRegexValidator;
  }

  /**
   * Create the IStringLengthValidator
   * @param minLength the minimum length of the string
   * @param maxLength the maximum length of the string
   * @returns IStringLengthValidator
   */
  static getStringLengthValidator(minLength?: number, maxLength?: number): IStringLengthValidator {
    return {
      $class: CONCERTO_STRING_LENGTH_VALIDATOR_CLASS,
      maxLength,
      minLength,
    } as IStringLengthValidator;
  }

  /**
   * Create a Concerto Object Property
   * @param name The name of the property
   * @param typeName The typeName of the object its refering to
   * @param label The label
   * @param isOptional Is this property optional
   * @param isArray Is this property an array
   * @returns a Concerto IObjectProperty
   */
  static getObjectProperty(name: string, typeName: string, decorators: IDecorator[], isOptional?: boolean, isArray?: boolean): IObjectProperty {
    return {
      ...this.getProperty(name, CONCERTO_OBJECT_PROPERTY_CLASS, decorators, isOptional, isArray),
      type: { ...this.getTypeIdentifier(typeName) },
    } as IObjectProperty;
  }

  /**
   * Create a Concerto Relationship Property
   * @param name The name of the property
   * @param referenceTo The type name it is a reference to
   * @param decorators The decorators applied to it
   * @param isOptional Is this property optional
   * @param isArray Is this property an array
   * @returns a Concerto IRelationshipProperty
   */
  static getRelationshipProperty(
    name: string,
    referenceTo: string,
    decorators: IDecorator[],
    isOptional?: boolean,
    isArray?: boolean,
  ): IRelationshipProperty {
    return {
      ...this.getProperty(name, CONCERTO_RELATIONSHIP_PROPERTY_CLASS, decorators, isOptional, isArray),
      type: { ...this.getTypeIdentifier(referenceTo) },
    };
  }
}
