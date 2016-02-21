'use strict';
import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as remark from 'remark';
import * as yaml from 'js-yaml';


function readFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, text) => {
            if (err) {
                reject(err);
                return;
            }


            resolve(text);
        });
    });
}

export function readJSON(jsonPath: string): Promise<any> {
    return readFile(jsonPath).then((text) => {
        return JSON.parse(text);
    });
}

export function readYAML(mdPath: string): Promise<any> {
    return readFile(mdPath).then((text) => {
        const ast = remark.parse(text);
        const yamlNode = ast.children[0];
        assert.strictEqual(yamlNode.type, 'yaml', 'A markdown file must start with a yaml block.');
        return yaml.safeLoad(yamlNode.value);
    });
}

export function readdir(dirPath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(files);
        });
    });
}
