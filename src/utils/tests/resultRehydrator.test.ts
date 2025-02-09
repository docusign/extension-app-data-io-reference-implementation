import { QueryExecutor } from "../queryExecutor";
import { ResultRehydrator } from "../resultRehydrator";


jest.mock('../queryExecutor', () => ({
  QueryExecutor: {
    resolveWalk: jest.fn()
  }
}));

const mockResolveWalk = QueryExecutor.resolveWalk as jest.MockedFunction<typeof QueryExecutor.resolveWalk>;

describe('ResultRehydrator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should rehydrate flat structure', () => {
    // Mock data
    const mockRecord = { id: 1, name: 'Test' };
    mockResolveWalk.mockImplementation((path: string) => {
      if (path === 'name') return 'Test';
      return undefined;
    });

    // Execute
    const result = ResultRehydrator.filterAndRehydrate(['name'], mockRecord);

    // Verify
    expect(result).toEqual({ name: 'Test' });
    expect(mockResolveWalk).toHaveBeenCalledWith('name', mockRecord);
  });

  test('should rehydrate nested structure', () => {
    // Mock data
    const mockRecord = { 
      masterRecord: { 
        address: { 
          city: 'New York' 
        } 
      } 
    };
    
    mockResolveWalk.mockImplementation((path: string) => {
      if (path === 'masterRecord(:MasterRecord)/address(:Address)/city') 
        return 'New York';
      return undefined;
    });

    // Execute
    const result = ResultRehydrator.filterAndRehydrate(
      ['masterRecord(:MasterRecord)/address(:Address)/city'], 
      mockRecord
    );

    // Verify
    expect(result).toEqual({
      masterRecord: {
        address: {
          city: 'New York'
        }
      }
    });
  });

  test('should merge multiple attributes', () => {
    // Mock data
    const mockRecord = {
      id: 123,
      details: {
        createdBy: 'admin',
        updatedAt: '2023-01-01'
      }
    };
    
    mockResolveWalk.mockImplementation((path: string) => {
      switch(path) {
        case 'id': return 123;
        case 'details/createdBy': return 'admin';
        case 'details/updatedAt': return '2023-01-01';
        default: return undefined;
      }
    });

    // Execute
    const result = ResultRehydrator.filterAndRehydrate(
      ['id', 'details/createdBy', 'details/updatedAt'], 
      mockRecord
    );

    // Verify
    expect(result).toEqual({
      id: 123,
      details: {
        createdBy: 'admin',
        updatedAt: '2023-01-01'
      }
    });
  });

  test('should remove type suffixes from keys', () => {
    // Mock data
    const mockRecord = {
      masterRecordId: 'MR123'
    };
    
    mockResolveWalk.mockImplementation((path: string) => {
      if (path === 'masterRecordId(:MasterRecord)/name') 
        return 'Primary Record';
      return undefined;
    });

    // Execute
    const result = ResultRehydrator.filterAndRehydrate(
      ['masterRecordId(:MasterRecord)/name'], 
      mockRecord
    );

    // Verify
    expect(result).toEqual({
      masterRecordId: {
        name: 'Primary Record'
      }
    });
  });

  test('should ignore undefined values', () => {
    // Mock data
    const mockRecord = { name: 'Test' };
    
    mockResolveWalk.mockImplementation((path: string) => {
      if (path === 'name') return 'Test';
      if (path === 'invalid') return undefined;
      return undefined;
    });

    // Execute
    const result = ResultRehydrator.filterAndRehydrate(
      ['name', 'invalid'], 
      mockRecord
    );

    // Verify
    expect(result).toEqual({ name: 'Test' });
    expect(mockResolveWalk).toHaveBeenCalledTimes(2);
  });
});
