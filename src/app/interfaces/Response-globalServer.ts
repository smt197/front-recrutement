import { User } from "@ngneat/falso";

export interface ResponseGlobalServer {
    data?: User|any;
    message?: string;
    mailmessage?: string;
    status?: boolean;
    email_verified?: boolean;
}
