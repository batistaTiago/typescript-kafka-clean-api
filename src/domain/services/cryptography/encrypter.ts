export interface Encrypter {
    encrypt(data: string | object): string
    decrypt(text: string): string | object
}
