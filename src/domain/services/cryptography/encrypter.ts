export interface Encrypter {
    encrypt(text: string | object): Promise<string>
    decrypt(text: string): Promise<string | object>
}
