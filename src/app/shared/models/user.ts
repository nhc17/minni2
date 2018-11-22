export interface Roles {
    user?: boolean;
    author?: boolean;
    admin?: boolean;
}

export class User {
    uid: string;
    email?: any;
    password?: string;
    displayName?: string;
    newpassword?: string;
    roles: Roles;

    constructor(authData) {
        this.email = authData.email;
        this.roles = { user: true, author: true, admin: true }; 
    }
}