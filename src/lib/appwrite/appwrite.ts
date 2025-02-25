// Importa "server-only" para indicar que este código solo debe ejecutarse en el servidor.
'use server';

import { AUTH_COOKIE } from "@/features/auth/constants/constants";
import { cookies } from "next/headers";
// Importa las clases principales del SDK de Appwrite.
import { Client, Account, Storage, Users, Databases } from "node-appwrite";

export async function createSesionClinet() {
    // Crea un cliente de Appwrite y lo configura con los datos del entorno.
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // Configura el endpoint de Appwrite.
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);   // Configura el ID del proyecto de Appwrite.

    // Obtiene la cookie de autenticación del usuario.
    const session = await (await cookies()).get(AUTH_COOKIE);
    if (!session || !session.value) {
        throw new Error("Unauthorized");
    }
    // Establece la sesión en el cliente de Appwrite para autenticar futuras solicitudes.
    client.setSession(session.value);
    // Retorna un objeto que contiene instancias de Appwrite configuradas.
    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        }
    }
}

// Función para crear un cliente administrador de Appwrite con credenciales de entorno.
export async function createAdminClient() {
    // Configura el cliente de Appwrite utilizando las variables de entorno.
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // Endpoint de Appwrite.
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)   // ID del proyecto de Appwrite.
        .setKey(process.env.NEXT_APPWRITE_KEY!);                 // Clave secreta de la API.

    // Retorna un objeto que contiene instancias de Appwrite configuradas.
    return {
        get account() {
            return new Account(client); // Devuelve una instancia para manejar cuentas.
        },
        get users() {
            return new Users(client);   // Devuelve una instancia para manejar usuarios.
        }
    };
}
