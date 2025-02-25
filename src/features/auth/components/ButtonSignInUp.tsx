'use client';

import { Button } from '@/components/ui/button'
import Link from 'next/link';
import { usePathname } from 'next/navigation'

// utilizo el asChild para que el link se renderice como un hijo del boton

const ButtonSignInUp = () => {

    const pathname = usePathname()

    return (
        <Button asChild variant="secondary" size="sm">
            <Link href={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}>
                {pathname === '/sign-in' ? 'Sign Up' : 'Login'}
            </Link>
        </Button>
    )
    }

export default ButtonSignInUp