// --- Código para manejar rutas de una API con Hono ---
import { zValidator } from "@hono/zod-validator";                       // Middleware para validación de datos usando Zod.
import { Hono } from "hono";                                            // Framework web ligero.
import { deleteCookie, setCookie } from "hono/cookie";                  // Funciones para manejar cookies.
import { AUTH_COOKIE } from "../constants/constants";                   // Nombre de la cookie de autenticación.
import { SignInSchema, SignUpSchema } from "@/lib/zod";                 // Esquemas de validación de entrada.
import { createAdminClient } from "@/lib/appwrite/appwrite";            // Función definida anteriormente.
import { ID } from "node-appwrite";                                     // Utilidad para generar IDs únicos en Appwrite.
import { sessionMiddleware } from "../middleware/sessionMiddleware";    // Middleware para sesiones.

// Crea una instancia de Hono para definir las rutas de la API.
const app = new Hono()

    // Define las rutas de inicio de sesión y registro.
    .get(
        "/current", 
        sessionMiddleware, 
        (c) => {
            const user = c.get("user");
            return c.json({ data: user });
    })
    .post(
    "/login", 
    // Middleware de validación de datos para el esquema de inicio de sesión.
    zValidator("json", SignInSchema),
    async (c) => {
        // Obtiene los datos validados del cuerpo de la solicitud.
        const { email, password } = c.req.valid("json");

        // Crea un cliente administrador y usa la clase Account para manejar sesiones.
        const { account } = await createAdminClient();
        const session = await account.createEmailPasswordSession(email, password); // Crea una sesión.

        // Configura una cookie de sesión en el cliente.
        setCookie(c, AUTH_COOKIE, session.secret, {
            path: "/",              // Disponible en todo el sitio.
            httpOnly: true, // Evita acceso desde JavaScript del lado del cliente.
            secure: true, // Requiere HTTPS.
            sameSite: "strict", // Previene el envío en solicitudes cruzadas.
            maxAge: 60 * 60 * 24 * 30, // Expira en 30 días.
        });

        return c.json({ success: true }); // Retorna una respuesta de éxito.
    })
    .post(
        "/register",
        // Middleware de validación de datos para el esquema de registro.
        zValidator("json", SignUpSchema),
        async (c) => {
            // Obtiene los datos validados del cuerpo de la solicitud.
            const { name, email, password } = c.req.valid("json");

            // Crea un cliente administrador y usa la clase Account para manejar usuarios.
            const { account } = await createAdminClient();
            await account.create(
                ID.unique(), // Genera un ID único para el nuevo usuario.
                email,       // Correo electrónico del usuario.
                password,    // Contraseña del usuario.
                name         // Nombre del usuario.
            );

            // Crea una sesión para el usuario registrado.
            const session = await account.createEmailPasswordSession(email, password);

            // Configura una cookie de sesión en el cliente.
            setCookie(c, AUTH_COOKIE, session.secret, {
                path: "/",
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 30,
            });

            return c.json({ success: true }); // Retorna una respuesta de éxito.
    })
    .post(
        // Middleware para verificar sesión antes de continuar.
        "/logout", sessionMiddleware, async (c) => {
            // Obtiene la instancia de Account del contexto.
            const account = c.get("account");

            deleteCookie(c, AUTH_COOKIE); // Elimina la cookie de sesión.
            await account.deleteSession("current"); // Elimina la sesión actual.

            return c.json({ success: true }); // Retorna una respuesta de éxito.
        }
    );

// Exporta la instancia de Hono para ser usada en el servidor.
export default app;