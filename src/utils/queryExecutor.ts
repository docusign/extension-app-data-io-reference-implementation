import { 
    IQuery, 
    OperationUnion, 
    IComparisonOperation, 
    IOperand, 
    Operator, 
    ILogicalOperation, 
    LogicalOperator 
} from "src/models/IQuery";
import * as path from "path";
import * as fs from "fs";

/**
 * Class to execute a query against the dataset.
 */
export class QueryExecutor {
    /**
     * Executes a query on a dataset and returns the index of the first match.
     * Returns -1 if no match is found.
     * @param query - The query object.
     * @param data - The dataset to be executed on.
     * @returns the index of the first match
     */
    public static execute(query: IQuery, inputData: object[]): number {
        const operation: OperationUnion = query.queryFilter.operation;
        for (let index: number = 0; index < inputData.length; index++) {
            if (QueryExecutor.executeOperation(operation, inputData[index])) {
                return index;
            }
        }
        return -1;
    }

    /**
     * Executes an operation (comparison or logical) on a record.
     * @param operation - The operation to execute.
     * @param record - The record to execute the operation on.
     * @returns The result of the operation evaluation.
     */
    private static executeOperation(operation: OperationUnion, record: object): boolean {
        if ('leftOperand' in operation) {
            return QueryExecutor.executeComparisonOperation(operation, record);
        } else {
            return QueryExecutor.executeLogicalOperation(operation, record);
        }
    }

    /**
     * Resolves a property path (walk) on a record. Supports loading relationship properties from external JSON files.
     * @param walk - The property path to resolve.
     * @param record - The record to resolve the path against.
     * @returns The resolved value or undefined if not found.
     */
    public static resolveWalk(walk: string, record: Record<string, any>): any {
        const segments: string[] = walk.split('/');
        let currentValue: any = record;

        for (const segment of segments) {
            if (!currentValue) return undefined;

            // Handle relationship properties with type names
            if (segment.includes('(:')) {
                const [propertyName, typeName] = segment.split('(:');
                const cleanTypeName: string = typeName.replace(')', '');

                // Load external JSON file for the relationship type
                const filePath: string = path.resolve(__dirname, `../db/${cleanTypeName}.json`);
                if (!fs.existsSync(filePath)) {
                    console.warn(`File not found: ${filePath}`);
                    return undefined;
                }

                const relatedData: Record<string, any>[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                const relationshipId: string = currentValue[propertyName] ?? "-1";

                // Find the related object by its ID
                currentValue = relatedData.find((item: Record<string, any>) => parseInt(item.Id) === parseInt(relationshipId));
                continue;
            }

            // Handle array and object properties
            const isArray: boolean = segment.endsWith('[]');
            const cleanSegment: string = segment.replace(/\[\]$/, '');

            currentValue = currentValue[cleanSegment];

            if (isArray && Array.isArray(currentValue)) {
                return currentValue; // Return array for further processing
            }
        }

        return currentValue;
    }

    /**
     * Executes a comparison operation on a record.
     * @param operation - The comparison operation to execute.
     * @param record - The record to execute the operation on.
     * @returns The result of the comparison operation evaluation.
     */
    private static executeComparisonOperation(operation: IComparisonOperation, record: object): boolean {
        const leftOperand: IOperand = operation.leftOperand;
        const rightOperand: IOperand = operation.rightOperand;
        const operator: Operator = operation.operator;

        const leftValue: any = leftOperand.isLiteral 
            ? leftOperand.name 
            : QueryExecutor.resolveWalk(leftOperand.name, record);

        const rightValue: any = rightOperand.isLiteral 
            ? rightOperand.name 
            : QueryExecutor.resolveWalk(rightOperand.name, record);

        switch (operator) {
            case Operator.EQUALS:
                return leftValue === rightValue;
            case Operator.NOT_EQUALS:
                return leftValue !== rightValue;
            default:
                console.warn('Unsupported operator:', operator);
                return false;
        }
    }

    /**
     * Executes a logical operation (AND/OR) on a record.
     * @param operation - The logical operation to execute.
     * @param record - The record to execute the operation on.
     * @returns The result of the logical operation evaluation.
     */
    private static executeLogicalOperation(operation: ILogicalOperation, record: object): boolean {
        const { leftOperation, operator, rightOperation } = operation;

        const leftResult: boolean = QueryExecutor.executeOperation(leftOperation, record);
        const rightResult: boolean = QueryExecutor.executeOperation(rightOperation, record);

        switch (operator) {
            case LogicalOperator.AND:
                return leftResult && rightResult;
            case LogicalOperator.OR:
                return leftResult || rightResult;
            default:
                return false;
        }
    }
}
