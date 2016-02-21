'use strict';
import * as assert from 'assert';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import * as remark from 'remark';
import * as yaml from 'js-yaml';


export function exec(command: string, cwd: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        childProcess.exec(command, { cwd: cwd }, (err, stdout, stderr) => {
            if (err) {
                console.error(stderr);
                reject(err);
                return;
            }
            
            resolve();
        });
    });
}

export function download(url: string, outPath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const writeStream = fs.createWriteStream(outPath);

        // write
        writeStream.on('error', (err) => {
            console.error(err);
            console.error(err.stack);
            reject(err);
        });

        writeStream.on('finish', () => {
            resolve();
        });

        // request
        const request = https.get(url, (res) => {
            res.on('data', (data) => {
                writeStream.write(data);
            });

            res.on('end', () => {
                writeStream.end();
            });
        });

        request.on('error', (err) => {
            console.error(err);
            console.error(err.stack);
            reject(err);
        });
    });
}

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
