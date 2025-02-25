// Importa los hooks y utilidades necesarias de la librería `nuqs`
import { useQueryState, parseAsBoolean } from "nuqs";

// Define un hook personalizado para manejar el estado del modal "Crear Workspace"
export const useCreateWorkspaceModal = () => {
    // Usa `useQueryState` para sincronizar el estado del modal con la URL.
    const [isOpen, setIsOpen] = useQueryState(
        "create-workspace", // Clave del parámetro de consulta en la URL, por ejemplo: ?create-workspace=true
        parseAsBoolean
            .withDefault(false) // Si el parámetro no está presente, el valor predeterminado será `false`.
            .withOptions({ clearOnDefault: true }) // Si el estado vuelve al valor predeterminado (`false`), el parámetro se elimina de la URL.
    );

    // Ejemplo de cómo la URL podría verse:
    // localhost:3000/dashboard?create-workspace=true -> El modal está abierto (`isOpen = true`)
    // localhost:3000/dashboard -> El modal está cerrado (`isOpen = false`)

    // Función para abrir el modal: establece `isOpen` en `true` y actualiza la URL.
    const open = () => setIsOpen(true);

    // Función para cerrar el modal: establece `isOpen` en `false` y elimina el parámetro de la URL.
    const close = () => setIsOpen(false);

    // Devuelve el estado del modal y las funciones para manejarlo.
    return {
        isOpen,     // Indica si el modal está abierto (`true`) o cerrado (`false`).
        open,       // Función para abrir el modal.
        close,      // Función para cerrar el modal.
        setIsOpen   // Función para establecer el estado directamente.
    };
};