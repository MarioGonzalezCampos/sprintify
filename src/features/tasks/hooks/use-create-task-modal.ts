import { useQueryState, parseAsBoolean } from "nuqs";


export const useCreateTaskModal = () => {
    const [isOpen, setIsOpen] = useQueryState(
        "create-task", 
        parseAsBoolean
            .withDefault(false) 
            .withOptions({ clearOnDefault: true }) 
    );
    const open = () => setIsOpen(true);

    const close = () => setIsOpen(false);

    return {
        isOpen,     // Indica si el modal está abierto (`true`) o cerrado (`false`).
        open,       // Función para abrir el modal.
        close,      // Función para cerrar el modal.
        setIsOpen   // Función para establecer el estado directamente.
    };
};