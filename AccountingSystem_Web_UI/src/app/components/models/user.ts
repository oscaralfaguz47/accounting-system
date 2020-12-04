export class User {
    constructor(
        public IdRoll: number,
        public FirstName: string,
        public LastName: string,
        public Email: string,
        public Status: boolean,
        public password: string
    ) {}
}