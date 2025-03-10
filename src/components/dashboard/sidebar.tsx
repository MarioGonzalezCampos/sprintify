import Image from "next/image";
import Link from "next/link";
import { DottedSeparator } from "../ui/dotted-separator";
import { NavegationDashboard } from "./navegation-dashboard";
import { WorkspaceSwitcher } from "@/features";
import { Projects } from "..";




export const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
        <Link href="">
            <Image src="/logo.svg" alt="logo" width={164} height={48} />
        </Link>
        <DottedSeparator className="my-4" />
        <WorkspaceSwitcher />
        <DottedSeparator className="my-4" />
        <NavegationDashboard />
        <DottedSeparator className="my-4" />
        <Projects />
    </aside>
  )
};