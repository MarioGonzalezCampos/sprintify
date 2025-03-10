'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { SettingsIcon, UsersIcon } from 'lucide-react';
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from 'react-icons/go';
import { useWorkspaceId } from '@/features';

const routes = [
    {
      label: 'Home',
      href: '',                             // Modificamos esto para que el href sea vacio
      icon: GoHome,
      activeIcon: GoHomeFill,
    },
    {
      label: 'My Tasks',
      href: '/tasks',
      icon: GoCheckCircle,
      activeIcon: GoCheckCircleFill,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: SettingsIcon,
      activeIcon: SettingsIcon,
    },
    {
      label: 'Members',
      href: '/members',
      icon: UsersIcon,
      activeIcon: UsersIcon,
    }
]
        

export const NavegationDashboard = () => {

    const workspaceId = useWorkspaceId();
    const pathname = usePathname();

    return (
        <ul className='flex flex-col'>
            {routes.map((item) => {
                const fullHref = `/workspaces/${workspaceId}${item.href}`;              // Modificamos esto para que se muestre el id del workspace en la url
                const isActive = pathname === fullHref;                                 // isActive es true si el pathname es igual al fullHref 
                const Icon = isActive? item.activeIcon : item.icon;                     // .. ahora el href del Link es fullHref
                return (
                    <Link key={item.href} href={fullHref}>
                        <div className={cn(
                            "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                            isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
                        )}>
                            <Icon className='size-5 text-neutral-500'/>
                            {item.label}
                        </div>
                    </Link>
                )
            })}
        </ul>
    )
};