import { ModelManager } from "@accordproject/concerto-core";
import path from "path";
import fs from 'fs';

export class ModelManagerUtil {
    /**
     * Create a ModelManager instance from a CTO file.
     * @param {string} ctoFile - the path to the CTO file.
     * @return {ModelManager} a ModelManager instance.
     */
    public static createModelManagerFromCTO(ctoFile: string): ModelManager {
        // Needed as this is a workaround to skip line locations in generated AST
        // @ts-ignore
        const modelManager: ModelManager = new ModelManager({ strict: true, skipLocationNodes: true });
        modelManager.addCTOModel(fs.readFileSync(path.join(__dirname, "../dataModel/model.cto"),'utf8'));
        modelManager.validateModelFiles();
        return modelManager
    }
}