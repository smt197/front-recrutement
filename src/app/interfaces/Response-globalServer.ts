import { User } from "@ngneat/falso";

export interface ResponseGlobalServer {
    data?: User|any;
    message?: string;
    statut?: boolean;
}
