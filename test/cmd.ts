import fs from 'fs-extra';
import tmp from 'tmp';

import { should } from 'chai';

import { Cmd } from '../src/cmd';
import { LoggerMock } from './mocks';
import { CmdOptions } from '../src/types';

should();

const logger = new LoggerMock();
const subject = new Cmd(logger);

describe('Cmd', () => {
    it('should execute commands', async () => {
        const expected = 'content';

        const tmpobj = tmp.fileSync();
        fs.writeSync(tmpobj.fd, expected);

        subject.setOptions({ verbose: true });
        const actual = await subject.exec('cat', tmpobj.name);

        actual.should.eq(expected);
    });

    it('should allow to set environment variables', async () => {
        const envvar = 'ENVVAR';
        const expected = 'envvarvalue';

        const options: CmdOptions = {
            verbose: true,
            shell: true
        };
        options.env = {};
        options.env[envvar] = expected;
        subject.setOptions(options);
        const actual = await subject.exec('echo', '-n', `$${envvar}`);

        actual.should.eq(expected);
    });
});
