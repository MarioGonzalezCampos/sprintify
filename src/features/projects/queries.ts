import { createSesionClinet } from "@/lib/appwrite/appwrite";
import { getMember } from "../members/utils";
import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { ProjectTypes } from "./types";

type getProjectProps = {
    projectId: string;
};

export const getProject = async ({ projectId }: getProjectProps ) => {

        
    const { databases, account } = await createSesionClinet();  

    // Obtiene la información del usuario autenticado mediante Appwrite.
    const user = await account.get();

    // Busca los documentos de projecto asociados a los IDs obtenidos anteriormente.
    const project = await databases.getDocument<ProjectTypes>(
        DATABASE_ID,        // ID de la base de datos configurada en el entorno.
        PROJECTS_ID,      // ID de la colección de project en Appwrite.
        projectId        // ID del espacio de trabajo a buscar.
        
    );

    // obtiene member de la función getMember
    const member = await getMember({ databases, workspaceId: project.workspaceId, userId: user.$id });

    // Si no hay miembros asociados al usuario, retorna un objeto vacío con 0 resultados.
    if (!member) {
        return new Error('No tienes permisos para acceder a este espacio de trabajo');
    }

    // Retorna el projecto
    return project;
    
};