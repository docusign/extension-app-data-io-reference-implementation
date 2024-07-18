import { IQuery, OperationUnion, IComparisonOperation, IOperand, Operator, ILogicalOperation, LogicalOperator } from "src/models/IQuery";


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
        const operation: OperationUnion  = query.queryFilter.operation;
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
     * Executes a comparison operation on a record.
     * @param operation - The comparison operation to execute.
     * @param record - The record to execute the operation on.
     * @returns The result of the comparison operation evaluation.
     */
    private static executeComparisonOperation(operation: IComparisonOperation, record: object): boolean {
        const leftOperand: IOperand = operation.leftOperand;
        const rightOperand: IOperand = operation.rightOperand;
        const operator: Operator = operation.operator;

        const leftValue: string = leftOperand.isLiteral ? leftOperand.name : (record as any)[leftOperand.name];
        const rightValue: string = rightOperand.isLiteral ? rightOperand.name : (record as any)[rightOperand.name];

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
