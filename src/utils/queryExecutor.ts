import { 
    IQuery, 
    OperationUnion, 
    IComparisonOperation, 
    IOperand, 
    Operator, 
    ILogicalOperation, 
    LogicalOperator, 
    OperandType
} from "../models/IQuery";
import * as path from "path";
import * as fs from "fs";

/**
 * Class responsible for executing queries on data sets.
 */
export class QueryExecutor {
    /**
     * Executes a query on the given input data.
     * @param {IQuery} query - The query to execute.
     * @param {object[]} inputData - The data to query against.
     * @returns {number} The index of the first matching record, or -1 if no match is found.
     */
    public static execute(query: IQuery, inputData: object[]): number {
        const operation: OperationUnion = query.queryFilter.operation;
        for (let index: number = 0; index < inputData.length; index++) {
            if (this.evaluateOperation(operation, inputData[index])) {
                return index;
            }
        }
        return -1;
    }

    /**
     * Evaluates an operation on a given record.
     * @param {OperationUnion} operation - The operation to evaluate.
     * @param {object} record - The record to evaluate against.
     * @returns {boolean} True if the operation evaluates to true, false otherwise.
     * @private
     */
    private static evaluateOperation(operation: OperationUnion, record: object): boolean {
        if ('leftOperand' in operation) {
            return this.executeComparisonOperation(operation, record);
        } else {
            return this.executeLogicalOperation(operation, record);
        }
    }

    /**
     * Resolves a property path (walk) on a given record.
     * @param {string} walk - The property path to resolve.
     * @param {Record<string, any>} record - The record to resolve the path on.
     * @returns {any} The resolved value.
     */
    public static resolveWalk(walk: string, record: Record<string, any>): any {
        const segments: string[] = walk.split('/');
        let currentValue: any = record;

        for (const segment of segments) {
            if (!currentValue) return undefined;

            if (segment.includes('(:')) {
                const [propertyName, typeName] = segment.split('(:');
                const cleanTypeName: string = typeName.replace(')', '');

                const filePath: string = path.resolve(__dirname, `../db/${cleanTypeName}.json`);
                if (!fs.existsSync(filePath)) {
                    console.warn(`File not found: ${filePath}`);
                    return undefined;
                }

                const relatedData: Record<string, any>[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                const relationshipId: string = currentValue[propertyName];

                currentValue = relatedData.find((item: Record<string, any>) => item.Id === relationshipId);
                continue;
            }

            const isArray: boolean = segment.endsWith('[]');
            const cleanSegment: string = segment.replace(/\[\]$/, '');

            currentValue = currentValue[cleanSegment];

            if (isArray && Array.isArray(currentValue)) {
                return currentValue.map((item: any) => 
                    this.resolveWalk(segments.slice(segments.indexOf(segment) + 1).join('/'), item)
                ).flat();
            }
        }

        return currentValue;
    }

    /**
     * Executes a comparison operation on a given record.
     * @param {IComparisonOperation} operation - The comparison operation to execute.
     * @param {object} record - The record to execute the operation on.
     * @returns {boolean} True if the comparison is true, false otherwise.
     * @private
     */
    private static executeComparisonOperation(operation: IComparisonOperation, record: object): boolean {
        const leftOperand: IOperand = operation.leftOperand;
        const rightOperand: IOperand = operation.rightOperand;
        const operator: Operator = operation.operator;

        const leftValue: any = leftOperand.isLiteral 
            ? this.coerceValue(leftOperand.name, leftOperand.type)
            : this.resolveWalk(leftOperand.name, record);

        const rightValue: any = rightOperand.isLiteral 
            ? this.coerceValue(rightOperand.name, rightOperand.type)
            : this.resolveWalk(rightOperand.name, record);

        switch (operator) {
            case Operator.EQUALS:
                return this.deepEqual(leftValue, rightValue);
            case Operator.NOT_EQUALS:
                return !this.deepEqual(leftValue, rightValue);
            case Operator.GREATER_THAN:
                return leftValue > rightValue;
            case Operator.LESS_THAN:
                return leftValue < rightValue;
            case Operator.GREATER_THAN_OR_EQUALS_TO:
                return leftValue >= rightValue;
            case Operator.LESS_THAN_OR_EQUALS_TO:
                return leftValue <= rightValue;
            case Operator.IN:
                return Array.isArray(rightValue) && rightValue.includes(leftValue);
            default:
                console.warn('Unsupported operator:', operator);
                return false;
        }
    }

    /**
     * Executes a logical operation on a given record.
     * @param {ILogicalOperation} operation - The logical operation to execute.
     * @param {object} record - The record to execute the operation on.
     * @returns {boolean} True if the logical operation is true, false otherwise.
     * @private
     */
    private static executeLogicalOperation(operation: ILogicalOperation, record: object): boolean {
        const { leftOperation, operator, rightOperation } = operation;

        const leftResult: boolean = this.evaluateOperation(leftOperation, record);
        const rightResult: boolean = this.evaluateOperation(rightOperation, record);

        switch (operator) {
            case LogicalOperator.AND:
                return leftResult && rightResult;
            case LogicalOperator.OR:
                return leftResult || rightResult;
            default:
                console.warn('Unsupported logical operator:', operator);
                return false;
        }
    }

    /**
     * Coerces a value to the specified type.
     * @param {string} value - The value to coerce.
     * @param {OperandType} type - The type to coerce to.
     * @returns {any} The coerced value.
     * @private
     */
    private static coerceValue(value: string, type: OperandType): any {
        switch(type) {
            case 'DOUBLE':
                return parseFloat(value);
            case 'INTEGER':
                return parseInt(value, 10);
            case 'BOOLEAN':
                return value.toLowerCase() === 'true';
            case 'DATETIME':
                return new Date(value).getTime();
            default:
                return value;
        }
    }

    /**
     * Performs a deep equality check between two values.
     * @param {any} a - The first value to compare.
     * @param {any} b - The second value to compare.
     * @returns {boolean} True if the values are deeply equal, false otherwise.
     * @private
     */
    private static deepEqual(a: any, b: any): boolean {
        if (a === b) return true;
        if (typeof a !== typeof b) return false;
        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false;
            return a.every((val, index) => this.deepEqual(val, b[index]));
        }
        if (typeof a === 'object' && a !== null && b !== null) {
            const keysA = Object.keys(a);
            const keysB = Object.keys(b);
            if (keysA.length !== keysB.length) return false;
            return keysA.every(key => this.deepEqual(a[key], b[key]));
        }
        return false;
    }
}
