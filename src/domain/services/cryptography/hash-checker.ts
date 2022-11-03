export interface HashChecker {
    check(value: string, hash: string): Promise<boolean>
}
