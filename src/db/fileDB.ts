import * as fs from 'fs';
import * as path from 'path';

/**
 * FileDB class to handle reading, writing, appending, and updating a JSON file.
 */
export class FileDB {
  private filePath: string;

  /**
   * Creates an instance of FileDB.
   * @param {string} fileName - The name of the file to read/write.
   */
  constructor(fileName: string) {
    this.filePath = path.join(__dirname, fileName);
    this.createFileIfNotExists(this.filePath, '[]');
  }

  /**
 * Creates a file with the specified content if it doesn't already exist.
 * @param filePath - The path of the file to create.
 * @param content - The content to write to the file.
 * @returns {void}
 */
  private createFileIfNotExists(filePath: string, content: string): void {
    const dir = path.dirname(filePath);

    // Ensure the directory exists
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Create the file if it doesn't exist
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
        console.log(`File created: ${filePath}`);
    } else {
        console.log(`File already exists: ${filePath}`);
    }
  }

  /**
   * Writes an empty JSON array to the file.
   * @return {boolean}
   */
    private writeFile(object: any): void {
      try {
        fs.writeFileSync(this.filePath, JSON.stringify(object, null, 2));
      } catch (error) {
        console.error('Error writing to file:', error);
        throw error;
      }
    }

  /**
   * Reads the JSON file and prints the array of objects.
   * @returns {object[]}
   */
  readFile(): object[] {
    try {
      return JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  }

  /**
   * Searches the file for a record with the specified ID.
   * @param {string} recordId - The record ID to search for.
   * @return {object | undefined} The found record, if any, or undefined.
   */
  searchFile(recordId: string): object | undefined {
    try {
      const jsonArray: object[] = this.readFile();
      return jsonArray.find((record: any) => record.id === recordId);
    } catch (error) {
      console.error('Error searching file:', error);
      throw error;
    }
  }

  /**
   * Appends an object to the JSON file.
   * @param {object} newObject - The object to append.
   * @returns {boolean}
   */
  appendToFile(newObject: object): void {
    try {
      const jsonArray: object[] = this.readFile();
      jsonArray.push(newObject);
      this.writeFile(jsonArray);
    } catch (error) {
      console.error('Error appending to file:', error);
      throw error;
    }
  }


  /**
   * Updates a record in the JSON file by identifier and record ID.
   * @param {string} identifier - The identifier field name.
   * @param {string} recordId - The record ID to update.
   * @param {object} updatedObject - The updated object to write to the file.
   * @returns {void}
   */
  updateFile(identifier: string, recordId: string, updatedObject: object): void {
    try {
      const jsonArray: object[] = this.readFile();
      const index = jsonArray.findIndex((record: any) => record[identifier] === recordId);
      for (const key of Object.keys(updatedObject)) {
        (jsonArray[index] as any)[key] =  (updatedObject as any)[key];
      }
      this.writeFile(jsonArray);
    } catch (error) {
      console.error('Error updating file:', error);
      throw error;
    }
  }
}
