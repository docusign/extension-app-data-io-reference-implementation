import { QueryExecutor } from '../queryExecutor';
import { IQuery, Operator, LogicalOperator, OperandType } from '../../models/IQuery';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

const mockAccountData = [
  {
    $class: 'org.example.Account',
    Id: 'ACCT001',
    Name: 'Test Account',
    Type: 'Customer_Direct',
    PushCount: 150,
    MasterRecordId: 'MR001',
    orderLines: [
      { productName: 'Cloud Service', quantity: 1 },
      { productName: 'Data Package', quantity: 5 }
    ]
  }
];

const mockMasterRecords = [
  {
    $class: 'org.example.MasterRecordId',
    Id: 'MR001',
    Name: 'Master Record 0',
    addy: 'ADDR001'
  }
];

const mockAddresses = [
  {
    $class: 'org.example.Address',
    Id: 'ADDR001',
    City: 'New York',
    Country: 'USA'
  }
];

describe('QueryExecutor', () => {
  beforeAll(() => {
    (fs.existsSync as jest.Mock).mockImplementation(() => true);
    (fs.readFileSync as jest.Mock).mockImplementation((path: string) => {
      if (path.includes('MasterRecordId')) return JSON.stringify(mockMasterRecords);
      if (path.includes('Address')) return JSON.stringify(mockAddresses);
      return JSON.stringify(mockAccountData);
    });
    (path.resolve as jest.Mock).mockImplementation((...args: string[]) => args.join('/'));
  });

  test('should execute simple account query with EQUALS', () => {
    const query: { query: IQuery } = {
      query: {
        $class: "com.docusign.connected.data.queries@1.0.0.Query",
        attributesToSelect: ['Name'],
        from: 'Account',
        queryFilter: {
          $class: "com.docusign.connected.data.queries@1.0.0.QueryFilter",
          operation: {
            $class: "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
            leftOperand: {
              $class: "com.docusign.connected.data.queries@1.0.0.Operand",
              name: 'Name',
              type: OperandType.STRING,
              isLiteral: false
            },
            operator: Operator.EQUALS,
            rightOperand: {
              $class: "com.docusign.connected.data.queries@1.0.0.Operand",
              name: 'Test Account',
              type: OperandType.STRING,
              isLiteral: true
            }
          }
        }
      }
    };

    const result = QueryExecutor.execute(query.query, mockAccountData);
    expect(result).toBe(0);
  });

  test('should handle relationship query with EQUALS', () => {
    const query: { query: IQuery } = {
      query: {
        $class: "com.docusign.connected.data.queries@1.0.0.Query",
        attributesToSelect: ['MasterRecordId(:MasterRecordId)/Name'],
        from: 'Account',
        queryFilter: {
          $class: "com.docusign.connected.data.queries@1.0.0.QueryFilter",
          operation: {
            $class: "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
            leftOperand: {
              $class: "com.docusign.connected.data.queries@1.0.0.Operand",
              name: 'MasterRecordId(:MasterRecordId)/Name',
              type: OperandType.STRING,
              isLiteral: false
            },
            operator: Operator.EQUALS,
            rightOperand: {
              $class: "com.docusign.connected.data.queries@1.0.0.Operand",
              name: 'Master Record 0',
              type: OperandType.STRING,
              isLiteral: true
            }
          }
        }
      }
    };

    const result = QueryExecutor.execute(query.query, mockAccountData);
    expect(result).toBe(0);
  });

  test('should handle NOT_EQUALS operator', () => {
    const query: { query: IQuery } = {
      query: {
        $class: "com.docusign.connected.data.queries@1.0.0.Query",
        attributesToSelect: ['Type'],
        from: 'Account',
        queryFilter: {
          $class: "com.docusign.connected.data.queries@1.0.0.QueryFilter",
          operation: {
            $class: "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
            leftOperand: {
              $class: "com.docusign.connected.data.queries@1.0.0.Operand",
              name: 'Type',
              type: OperandType.STRING,
              isLiteral: false
            },
            operator: Operator.NOT_EQUALS,
            rightOperand: {
              $class: "com.docusign.connected.data.queries@1.0.0.Operand",
              name: 'Prospect',
              type: OperandType.STRING,
              isLiteral: true
            }
          }
        }
      }
    };

    const result = QueryExecutor.execute(query.query, mockAccountData);
    expect(result).toBe(0);
  });

  test('should handle complex logical operation with EQUALS and NOT_EQUALS', () => {
    const query: { query: IQuery } = {
      query: {
        $class: "com.docusign.connected.data.queries@1.0.0.Query",
        attributesToSelect: ['Name', 'Type'],
        from: 'Account',
        queryFilter: {
          $class: "com.docusign.connected.data.queries@1.0.0.QueryFilter",
          operation: {
            $class: "com.docusign.connected.data.queries@1.0.0.LogicalOperation",
            operator: LogicalOperator.AND,
            leftOperation: {
              $class: "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
              leftOperand: {
                $class: "com.docusign.connected.data.queries@1.0.0.Operand",
                name: 'Type',
                type: OperandType.STRING,
                isLiteral: false
              },
              operator: Operator.EQUALS,
              rightOperand: {
                $class: "com.docusign.connected.data.queries@1.0.0.Operand",
                name: 'Customer_Direct',
                type: OperandType.STRING,
                isLiteral: true
              }
            },
            rightOperation: {
              $class: "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
              leftOperand: {
                $class: "com.docusign.connected.data.queries@1.0.0.Operand",
                name: 'Name',
                type: OperandType.STRING,
                isLiteral: false
              },
              operator: Operator.NOT_EQUALS,
              rightOperand: {
                $class: "com.docusign.connected.data.queries@1.0.0.Operand",
                name: 'Some Other Account',
                type: OperandType.STRING,
                isLiteral: true
              }
            }
          }
        }
      }
    };

    const result = QueryExecutor.execute(query.query, mockAccountData);
    expect(result).toBe(0);
  });
});