export interface HashMake {
    make(text: string|object): Promise<string>
}

export interface HashCheck {
    check(value: string, hash: string): Promise<boolean>
}

export declare type Hash = HashMake & HashCheck;