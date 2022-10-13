export interface Encrypter {
    encrypt(text: string|object): Promise<string>
}