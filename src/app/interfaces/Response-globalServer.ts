import { User } from "@ngneat/falso";

export interface ResponseGlobalServer {
    data?: User|any;
    message?: string;
    mailmessage?: string;
    statut?: boolean;
    email_verified?: boolean;
}
