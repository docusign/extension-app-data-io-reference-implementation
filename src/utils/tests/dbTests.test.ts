import { QueryExecutor } from '../queryExecutor';
import { IQuery, OperandType, Operator, LogicalOperator } from '../../models/IQuery';
import * as fs from 'fs';
import * as path from 'path';

describe('QueryExecutor with Real Data', () => {
  let accountData: any[];
  let masterRecordData: any[];
  let addressData: any[];
  let contactData: any[];
  let opportunityData: any[];
  let orderData: any[];
  let invoiceData: any[];

  beforeAll(() => {
    const dataPath = path.resolve(__dirname, '../../db');
    accountData = JSON.parse(fs.readFileSync(path.join(dataPath, 'Account.json'), 'utf-8'));
    masterRecordData = JSON.parse(fs.readFileSync(path.join(dataPath, 'MasterRecordId.json'), 'utf-8'));
    addressData = JSON.parse(fs.readFileSync(path.join(dataPath, 'Address.json'), 'utf-8'));
    contactData = JSON.parse(fs.readFileSync(path.join(dataPath, 'Contact.json'), 'utf-8'));
    opportunityData = JSON.parse(fs.readFileSync(path.join(dataPath, 'Opportunity.json'), 'utf-8'));
    orderData = JSON.parse(fs.readFileSync(path.join(dataPath, 'Order.json'), 'utf-8'));
    invoiceData = JSON.parse(fs.readFileSync(path.join(dataPath, 'Invoice.json'), 'utf-8'));
  });

  test('Simple query on Account Name', () => {
    const query: IQuery = {
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
            name: 'TechCorp Solutions',
            type: OperandType.STRING,
            isLiteral: true
          }
        }
      }
    };

    const result = QueryExecutor.execute(query, accountData);
    expect(result).not.toBe(-1);
  });

  test('2-level deep query on MasterRecord Name', () => {
    const query: IQuery = {
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
            name: 'Primary Record',
            type: OperandType.STRING,
            isLiteral: true
          }
        }
      }
    };

    const result = QueryExecutor.execute(query, accountData);
    expect(result).not.toBe(-1);
  });

  test('3-level deep query on Address locality', () => {
    const query: IQuery = {
      $class: "com.docusign.connected.data.queries@1.0.0.Query",
      attributesToSelect: ['MasterRecordId(:MasterRecordId)/addy(:Address)/locality'],
      from: 'Account',
      queryFilter: {
        $class: "com.docusign.connected.data.queries@1.0.0.QueryFilter",
        operation: {
          $class: "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
          leftOperand: {
            $class: "com.docusign.connected.data.queries@1.0.0.Operand",
            name: 'MasterRecordId(:MasterRecordId)/addy(:Address)/locality',
            type: OperandType.STRING,
            isLiteral: false
          },
          operator: Operator.EQUALS,
          rightOperand: {
            $class: "com.docusign.connected.data.queries@1.0.0.Operand",
            name: 'San Francisco',
            type: OperandType.STRING,
            isLiteral: true
          }
        }
      }
    };

    const result = QueryExecutor.execute(query, accountData);
    expect(result).not.toBe(-1);
  });

  test('4-level deep query on Contact Email', () => {
    const query: IQuery = {
      $class: "com.docusign.connected.data.queries@1.0.0.Query",
      attributesToSelect: ['MasterRecordId(:MasterRecordId)/addy(:Address)/primaryContact(:Contact)/email'],
      from: 'Account',
      queryFilter: {
        $class: "com.docusign.connected.data.queries@1.0.0.QueryFilter",
        operation: {
          $class: "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
          leftOperand: {
            $class: "com.docusign.connected.data.queries@1.0.0.Operand",
            name: 'MasterRecordId(:MasterRecordId)/addy(:Address)/primaryContact(:Contact)/email',
            type: OperandType.STRING,
            isLiteral: false
          },
          operator: Operator.EQUALS,
          rightOperand: {
            $class: "com.docusign.connected.data.queries@1.0.0.Operand",
            name: 's.johnson@techcorp.com',
            type: OperandType.STRING,
            isLiteral: true
          }
        }
      }
    };

    const result = QueryExecutor.execute(query, accountData);
    expect(result).not.toBe(-1);
  });

  test('5-level deep query on Opportunity Amount', () => {
    const query: IQuery = {
      $class: "com.docusign.connected.data.queries@1.0.0.Query",
      attributesToSelect: ['MasterRecordId(:MasterRecordId)/addy(:Address)/primaryContact(:Contact)/currentOpportunity(:Opportunity)/amount'],
      from: 'Account',
      queryFilter: {
        $class: "com.docusign.connected.data.queries@1.0.0.QueryFilter",
        operation: {
          $class: "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
          leftOperand: {
            $class: "com.docusign.connected.data.queries@1.0.0.Operand",
            name: 'MasterRecordId(:MasterRecordId)/addy(:Address)/primaryContact(:Contact)/currentOpportunity(:Opportunity)/amount',
            type: OperandType.DOUBLE,
            isLiteral: false
          },
          operator: Operator.EQUALS,
          rightOperand: {
            $class: "com.docusign.connected.data.queries@1.0.0.Operand",
            name: '250000.00',
            type: OperandType.DOUBLE,
            isLiteral: true
          }
        }
      }
    };

    const result = QueryExecutor.execute(query, accountData);
    expect(result).not.toBe(-1);
  });

  test('6-level deep query on Order Total Amount', () => {
    const query: IQuery = {
        $class: "com.docusign.connected.data.queries@1.0.0.Query",
        attributesToSelect: ['MasterRecordId(:MasterRecordId)/addy(:Address)/primaryContact(:Contact)/currentOpportunity(:Opportunity)/associatedOrder(:Order)/totalAmount'],
        from: 'Account',
        queryFilter: {
            $class: "com.docusign.connected.data.queries@1.0.0.QueryFilter",
            operation: {
                $class: "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
                leftOperand: {
                    $class: "com.docusign.connected.data.queries@1.0.0.Operand",
                    name: 'MasterRecordId(:MasterRecordId)/addy(:Address)/primaryContact(:Contact)/currentOpportunity(:Opportunity)/associatedOrder(:Order)/totalAmount',
                    type: OperandType.DOUBLE,
                    isLiteral: false
                },
                operator: Operator.EQUALS,
                rightOperand: {
                    $class: "com.docusign.connected.data.queries@1.0.0.Operand",
                    name: '245000', // Changed from '245000.00' to match integer type
                    type: OperandType.DOUBLE,
                    isLiteral: true
                }
            }
        }
    };

    const result = QueryExecutor.execute(query, accountData);
    expect(result).not.toBe(-1);
 });

 test('4-level deep query through embedded Address object', () => {
  const query: IQuery = {
    $class: "com.docusign.connected.data.queries@1.0.0.Query",
    attributesToSelect: ['MasterRecordId(:MasterRecordId)/addy2/street1'],
    from: 'Account',
    queryFilter: {
      $class: "com.docusign.connected.data.queries@1.0.0.QueryFilter",
      operation: {
        $class: "com.docusign.connected.data.queries@1.0.0.ComparisonOperation",
        leftOperand: {
          $class: "com.docusign.connected.data.queries@1.0.0.Operand",
          name: 'MasterRecordId(:MasterRecordId)/addy2/street1',
          type: OperandType.STRING,
          isLiteral: false
        },
        operator: Operator.EQUALS,
        rightOperand: {
          $class: "com.docusign.connected.data.queries@1.0.0.Operand",
          name: '123 Tech Valley Dr',
          type: OperandType.STRING,
          isLiteral: true
        }
      }
    }
  };

  const result = QueryExecutor.execute(query, accountData);
  expect(result).not.toBe(-1);
});

  test('Complex query with logical operation', () => {
    const query: IQuery = {
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
              name: 'MasterRecordId(:MasterRecordId)/addy(:Address)/locality',
              type: OperandType.STRING,
              isLiteral: false
            },
            operator: Operator.EQUALS,
            rightOperand: {
              $class: "com.docusign.connected.data.queries@1.0.0.Operand",
              name: 'San Francisco',
              type: OperandType.STRING,
              isLiteral: true
            }
          }
        }
      }
    };

    const result = QueryExecutor.execute(query, accountData);
    expect(result).not.toBe(-1);
  });
});
