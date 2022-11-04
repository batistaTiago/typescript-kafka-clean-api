export class AccessTokenData {
    public readonly id: string;
    public readonly issuedAt: Date;

    public constructor(id: string, issuedAtDateString: string) {
        this.id = id;
        this.issuedAt = new Date(issuedAtDateString);

        if (this.issuedAt.toString() == 'Invalid Date') {
            throw new Error('Invalid datetime format');
        }
    }
}