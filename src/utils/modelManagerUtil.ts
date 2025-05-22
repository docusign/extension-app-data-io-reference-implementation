import { ModelManager } from "@accordproject/concerto-core";
import path from "path";
import fs from 'fs';

export class ModelManagerUtil {
    private static DATA_MODELS_FOLDER: string = '../dataModel/';
    private static DATA_MODELS_FILES: string[] = [
        'contact@1.0.0.cto',
        'model.cto',
    ];

    /**
     * Create a ModelManager instance from a CTO file.
     * @return {ModelManager} a ModelManager instance.
     */
    public static createModelManagerFromCTO(): ModelManager {
        // Needed as this is a workaround to skip line locations in generated AST
        // @ts-ignore
        const modelManager: ModelManager = new ModelManager({ strict: true,skipLocationNodes: true });
        
        this.DATA_MODELS_FILES.forEach((fileName: string) => {
          modelManager.addCTOModel(
            fs.readFileSync(
              path.join(__dirname, `${this.DATA_MODELS_FOLDER}${fileName}`),
              'utf8'
            )
          );
        });
    
        modelManager.validateModelFiles();
        return modelManager;
    }
}