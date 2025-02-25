// --- Middleware para manejar sesiones ---
//import "server-only"; // Indica que este código solo se ejecuta en el servidor.
'use server';

// Importa clases del SDK de Appwrite y utilidades.
import { 
    Client, 
    Account, 
    Storage,
    Models, 
    Databases, 
    type Account as AccountType,
    type Databases as DatabasesType,
    type Storage as StorageType,
    type Users as UsersType,
} from "node-appwrite";

import { getCookie } from "hono/cookie"; // Función para obtener cookies.
import { createMiddleware } from "hono/factory"; // Crea middleware para Hono.
import { AUTH_COOKIE } from "../constants/constants"; // Nombre de la cookie de autenticación.

type AdditionalContext = {
    Variables: {
        account: AccountType,
        databases: DatabasesType,
        storage: StorageType,
        users: UsersType,
        user: Models.User<Models.Preferences>
    }
}

// Middleware para gestionar sesiones de usuario.
export const sessionMiddleware = createMiddleware<AdditionalContext>(
    async (c, next) => {
        // Configura un cliente de Appwrite sin clave de administrador.
        const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);
        
        // Obtiene la cookie de sesión del cliente.
        const session = getCookie(c, AUTH_COOKIE);

        if (!session) {
            // Si no hay sesión, retorna un error 401 (No autorizado).
            return c.json({ error: "Unauthorized" }, 401);
        }

        // Configura la sesión en el cliente de Appwrite.
        client.setSession(session);

        // Crea instancias para manejar cuentas, bases de datos y almacenamiento.
        const account = new Account(client);
        const databases = new Databases(client);
        const storage = new Storage(client);

        // Obtiene información del usuario autenticado.
        const user = await account.get();

        // Guarda estas instancias y datos en el contexto para usarlas en la ruta.
        c.set("account", account);
        c.set("databases", databases);
        c.set("storage", storage);
        c.set("user", user);

        await next(); // Continúa con la ejecución de la ruta.
    }
);
