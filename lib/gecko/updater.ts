'use strict';
import * as path from 'path';
import { exec } from '../utils';

export async function update(): Promise<void> {
    await exec('rm -rf platatus', __dirname);
    const url = 'https://github.com/mozilla/platatus.git';
    await exec(`git clone --depth 1 ${url}`, __dirname);
}
