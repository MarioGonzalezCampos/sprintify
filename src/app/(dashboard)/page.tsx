"use server"; 
// Indica que este archivo es un archivo del lado del servidor en Next.js.
// Esto permite realizar operaciones que solo deberían ejecutarse en el servidor.

import { getCurrent, getWorkspaces } from "@/features";
// Importa las funciones `getCurrent` y `getWorkspaces` desde el módulo "@/features".
// `getCurrent` obtiene el usuario actual.
// `getWorkspaces` obtiene la lista de espacios de trabajo asociados al usuario.

import { redirect } from "next/navigation";
// Importa la función `redirect` de Next.js para redirigir a otras rutas.

export default async function Home() {
    // Define una función asincrónica para la página principal del servidor.

    const user = await getCurrent();
    // Llama a la función `getCurrent` para obtener el usuario actual autenticado.
    // Si no hay un usuario autenticado, `user` será `null`.

    if (!user) redirect("/sign-in");
    // Si no se obtiene un usuario (es decir, no está autenticado), redirige a la página de inicio de sesión.

    const workspaces = await getWorkspaces();
    // Llama a la función `getWorkspaces` para obtener los espacios de trabajo del usuario actual.
    // `workspaces` es un objeto que contiene información sobre los espacios de trabajo.

    if (workspaces.total === 0) {
        // Si el total de espacios de trabajo es 0...
        redirect("/workspaces/create");
        // ... redirige a la página para crear un nuevo espacio de trabajo.
    } else {
        // Si hay al menos un espacio de trabajo...
        redirect(`/workspaces/${workspaces.documents[0].$id}`);
        // ... redirige al primer espacio de trabajo en la lista, usando su `$id` como parte de la URL.
    }
}
