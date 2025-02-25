
import Image from "next/image";
import ButtonSignInUp from "../../features/auth/components/ButtonSignInUp";

type SignInLayoutProps = {
    children: React.ReactNode;
};

export default function SignInLayout ( {children}: SignInLayoutProps ) {

    return (
        <main className="bg-neutral-100 min-h-screen">
            <div className="mx-auto max-w-screen-2xl p-4">
                <nav className="flex justify-between items-center">
                    <Image src={'logo.svg'} alt="logo" width={152} height={56}/>
                    <ButtonSignInUp />
                </nav>
                <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
                    {children}
                </div>
            </div>
        </main>
    )
}