interface EnvVar {
    [key: string]: string;
}

type Stdio = 'pipe' | 'inherit' | 'ignore';

export interface CmdOptions {
    detached?: boolean;
    matcher?: RegExp;
    verbose?: boolean;
    env?: EnvVar;
    shell?: boolean;
    stdio?: Stdio;
    cwd?: string;
}

export interface CmdManager {
    setOptions(options: CmdOptions): void;
    exec(...items: string[]): Promise<number | string>;
}
