import { useMedia } from 'react-use';
// Importa el hook `useMedia` de la librería `react-use` para detectar si se cumplen condiciones de consultas de medios (media queries).

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
// Importa los componentes `Dialog` y `DialogContent`, probablemente diseñados para mostrar un modal estilo "diálogo".

import { Drawer, DrawerContent } from "@/components/ui/drawer";
// Importa los componentes `Drawer` y `DrawerContent`, utilizados para mostrar un cajón lateral (drawer).

type ResponsiveModalProps = {
  children: React.ReactNode;
  // Propiedad `children` para renderizar contenido dentro del modal o drawer.

  open: boolean;
  // Propiedad `open` para controlar si el modal o drawer está abierto.

  onOpenChange: (open: boolean) => void;
  // Propiedad `onOpenChange`, una función que se ejecuta cuando cambia el estado de apertura (abierto/cerrado).
};

export const ResponsiveModal = ( { children, open, onOpenChange } : ResponsiveModalProps ) => {
  // Define un componente funcional llamado `ResponsiveModal` que acepta las propiedades `children`, `open`, y `onOpenChange`.

  const isDesktop = useMedia('(min-width: 1024px)', true);
  // Usa el hook `useMedia` para determinar si el ancho de la ventana es de al menos 1024px.
  // Si la condición es verdadera, `isDesktop` será `true`, de lo contrario será `false`.

  if (isDesktop) {
    // Si es un dispositivo de escritorio (ancho >= 1024px):
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* Renderiza un modal (diálogo) con las propiedades de apertura y cierre. */}
        <DialogTitle></DialogTitle>
        <DialogContent className='w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]'>
          {/* Estiliza el contenido del modal: ancho máximo, sin relleno ni borde, y con scroll oculto. */}
          {children}
          {/* Inserta el contenido proporcionado dentro del modal. */}
        </DialogContent>
      </Dialog>
    );
  }

  // Si no es un dispositivo de escritorio (por ejemplo, es móvil):
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
        <DialogTitle></DialogTitle>
      {/* Renderiza un cajón lateral (drawer) con las propiedades de apertura y cierre. */}
      <DrawerContent>
        {/* Define el contenido principal del cajón. */}
        <div className='overflow-y-auto hide-scrollbar max-h-[85vh]'>
          {/* Contenedor estilizado para permitir desplazamiento vertical con scroll oculto. */}
          {children}
          {/* Inserta el contenido proporcionado dentro del cajón. */}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
