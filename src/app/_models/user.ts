export interface Roles {
    administrator?: boolean;
    customer?: boolean;
    kitchen?: boolean;
    event?: boolean;
}

export class User {
    fullName: string;
    email: string;
    roles: Roles;
    addedOn: string;
}
