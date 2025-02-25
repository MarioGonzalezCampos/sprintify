"use server"; // Esta directiva indica que este código solo se ejecutará en el servidor en un entorno Next.js.

import { Account, Client, Databases, Query } from "node-appwrite";  // Importa clases de Appwrite para gestionar cuentas, bases de datos y consultas.
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";  // Importa identificadores de configuración necesarios para Appwrite.
import { getMember, WorkspaceTypes } from "@/features";               // Importa la función `getMember` para obtener miembros asociados a un espacio de trabajo.
import { createSesionClinet } from "@/lib/appwrite/appwrite";

/**
 * La función `getWorkspaces` obtiene los espacios de trabajo (workspaces) asociados al usuario autenticado.
 * Utiliza Appwrite como backend para realizar las operaciones. 
 * @returns Un objeto con los documentos de los espacios de trabajo y el número total de resultados.
 */

export const getWorkspaces = async () => {

    try {
        
        const { databases, account } = await createSesionClinet();

        // Obtiene la información del usuario autenticado mediante Appwrite.
        const user = await account.get();

        // Busca documentos en la colección de miembros donde el `userId` coincide con el ID del usuario actual.
        const members = await databases.listDocuments(
            DATABASE_ID,   // ID de la base de datos configurada en el entorno.
            MEMBERS_ID,    // ID de la colección de miembros en Appwrite.
            [Query.equal("userId", user.$id)] // Filtro: el campo `userId` debe coincidir con el ID del usuario actual.
        );

        // Si no hay miembros asociados al usuario, retorna un objeto vacío con 0 resultados.
        if (members.total === 0) {
            return { documents: [], total: 0 };
        }

        // Extrae los IDs de los espacios de trabajo de los documentos de los miembros.
        const workspaceIds = members.documents.map((member) => member.workspaceId);

        // Busca los documentos de los espacios de trabajo asociados a los IDs obtenidos anteriormente.
        const workspaces = await databases.listDocuments(
            DATABASE_ID,    // ID de la base de datos configurada en el entorno.
            WORKSPACES_ID,  // ID de la colección de espacios de trabajo en Appwrite.
            [
                Query.orderDesc("$createdAt"),        // Ordena los resultados por fecha de creación descendente.
                Query.contains("$id", workspaceIds),  // Filtra los espacios de trabajo que tienen IDs en `workspaceIds`.
            ]
        );

        // Retorna los documentos y el total de resultados encontrados.
        return workspaces;

    } catch (error) {
        // En caso de error, retorna un objeto vacío con 0 resultados.
        return { documents: [], total: 0 };
    }
};

type GetWorkspaceProps = {
    workspaceId: string;
};

export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps ) => {

    try {
        
        const { databases, account } = await createSesionClinet();  

        // Obtiene la información del usuario autenticado mediante Appwrite.
        const user = await account.get();

        // obtiene member de la función getMember
        const member = await getMember({ databases, workspaceId, userId: user.$id });

        // Si no hay miembros asociados al usuario, retorna un objeto vacío con 0 resultados.
        if (!member) {
            return null;
        }

        // Busca los documentos de los espacios de trabajo asociados a los IDs obtenidos anteriormente.
        const workspace = await databases.getDocument<WorkspaceTypes>(
            DATABASE_ID,        // ID de la base de datos configurada en el entorno.
            WORKSPACES_ID,      // ID de la colección de espacios de trabajo en Appwrite.
            workspaceId         // ID del espacio de trabajo a buscar.
            
        );

        // Retorna los documentos y el total de resultados encontrados.
        return workspace;

    } catch {
        // En caso de error, retorna un objeto vacío con 0 resultados.
        return null;
    }
};

type GetWorkspaceInfoProps = {
    workspaceId: string;
};

export const getWorkspaceInfo = async ({ workspaceId }: GetWorkspaceInfoProps ) => {

    try {
        
        const { databases } = await createSesionClinet();  

        // Busca los documentos de los espacios de trabajo asociados a los IDs obtenidos anteriormente.
        const workspace = await databases.getDocument<WorkspaceTypes>(
            DATABASE_ID,        // ID de la base de datos configurada en el entorno.
            WORKSPACES_ID,      // ID de la colección de espacios de trabajo en Appwrite.
            workspaceId         // ID del espacio de trabajo a buscar.
            
        );

        // Retorna los documentos y el total de resultados encontrados.
        return {
            name: workspace.name
        };

    } catch {
        // En caso de error, retorna un objeto vacío con 0 resultados.
        return null;
    }
};