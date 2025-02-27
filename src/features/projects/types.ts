
import { Models } from "node-appwrite";

export type ProjectTypes = Models.Document & {
    name: string;
    imageUrl: string;
    workspaceId: string;
};