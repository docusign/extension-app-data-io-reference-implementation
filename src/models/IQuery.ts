import { IConcept } from "./concerto";

export enum OperandType {
    STRING = "STRING",
    INTEGER = "INTEGER",
    DOUBLE = "DOUBLE",
    LONG = "LONG",
    DATETIME = "DATETIME",
    BOOLEAN = "BOOLEAN",
    ENUM = "ENUM",
    LIST = "LIST",
    RANGE = "RANGE",
    OTHER = "OTHER",
    PLACEHOLDER_TYPE_ONE = "PLACEHOLDER_TYPE_ONE",
    PLACEHOLDER_TYPE_TWO = "PLACEHOLDER_TYPE_TWO",
    PLACEHOLDER_TYPE_THREE = "PLACEHOLDER_TYPE_THREE"
}
export enum Operator {
    EQUALS = "EQUALS",
    NOT_EQUALS = "NOT_EQUALS",
    CONTAINS = "CONTAINS",
    DOES_NOT_CONTAIN = "DOES_NOT_CONTAIN",
    LESS_THAN = "LESS_THAN",
    GREATER_THAN = "GREATER_THAN",
    LESS_THAN_OR_EQUALS_TO = "LESS_THAN_OR_EQUALS_TO",
    GREATER_THAN_OR_EQUALS_TO = "GREATER_THAN_OR_EQUALS_TO",
    STARTS_WITH = "STARTS_WITH",
    DOES_NOT_START_WITH = "DOES_NOT_START_WITH",
    ENDS_WITH = "ENDS_WITH",
    DOES_NOT_END_WITH = "DOES_NOT_END_WITH",
    IN = "IN",
    NOT_IN = "NOT_IN",
    BETWEEN = "BETWEEN",
    LIKE = "LIKE",
    CUSTOM = "CUSTOM"
}
export enum LogicalOperator {
    AND = "AND",
    OR = "OR"
}
export interface IOperation extends IConcept {
}
export type OperationUnion = IComparisonOperation | ILogicalOperation;
export interface IComparisonOperation extends IOperation {
    leftOperand: IOperand;
    operator: Operator;
    rightOperand: IOperand;
}
export interface IOperand extends IConcept {
    name: string;
    type: OperandType;
    isLiteral: boolean;
}
export interface ILogicalOperation extends IOperation {
    leftOperation: OperationUnion;
    operator: LogicalOperator;
    rightOperation: OperationUnion;
}
export interface IQueryFilter extends IConcept {
    operation: OperationUnion;
}
export interface IQuery extends IConcept {
    attributesToSelect: string[];
    from: string;
    queryFilter: IQueryFilter;
}
