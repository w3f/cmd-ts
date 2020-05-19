import { Buffer } from 'buffer';
import { spawn } from 'child_process';
import { Logger } from '@w3f/logger';

import { CmdOptions, CmdManager } from './types';


export class Cmd implements CmdManager {
    constructor(private logger: Logger, private options?: CmdOptions) { }

    setOptions(options: CmdOptions): void {
        this.options = options;
    }

    async exec(...items: string[]): Promise<number | string> {
        return new Promise((resolve, reject) => {
            const child = spawn(items[0], items.slice(1), this.options);
            if (this.options.detached) {
                child.unref();
                resolve(child.pid);
                return;
            }
            let match = false;
            let output = Buffer.from('');

            child.stdout.on('data', (data) => {
                if (this.options.matcher && this.options.matcher.test(data)) {
                    match = true;
                    child.kill('SIGTERM');
                    resolve();
                    return;
                }
                output = Buffer.concat([output, data]);
                if (this.options.verbose) {
                    this.logger.info(data.toString());
                }
            });

            child.stderr.on('data', (data) => {
                output = Buffer.concat([output, data]);
                if (this.options.verbose) {
                    this.logger.info(data.toString());
                }
            });

            child.on('close', (code) => {
                if (code !== 0 && !match) {
                    this.logger.info(`ERROR: Command execution failed with code: ${code}`);
                    reject(new Error(`code: ${code}`));
                }
                else {
                    resolve(output.toString());
                }
            });
        });
    }
}
