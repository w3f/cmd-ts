interface EnvVar {
    [key: string]: string;
}

export interface CmdOptions {
    detached?: boolean;
    matcher?: RegExp;
    verbose?: boolean;
    env?: EnvVar;
    shell?: boolean;
}
