import { User } from "./User";

export interface ResponseGlobalServer {
    data?: User|any;
    message?: string;
    mailmessage?: string;
    status?: boolean;
    email_verified?: boolean;
    user?: User;
    access_token?: string;
    StatusCode?: string;
}
