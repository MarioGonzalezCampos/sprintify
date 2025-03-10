import { Navbar, Sidebar } from "@/components";
import { CreateWorkspaceModal } from "@/features";
import { CreateProjectModal } from "@/features/projects";
import { CreateTaskModal } from "@/features/tasks/components/create-task-modal";


type DashboardLayoutProps = {
    children: React.ReactNode;
};

const DashboardLayout = ( {children}: DashboardLayoutProps ) => {
    return (
        <div className="min-h-screen">
            <CreateWorkspaceModal />
            <CreateProjectModal />
            <CreateTaskModal />
            <div className="flex w-full h-full">
                <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
                    <Sidebar />
                </div>
                <div className="lg:pl-[264px] w-full">
                    <div className="mx-auto max-w-secreen-2-xl h-full">
                        <Navbar />
                        <main className="h-full py-8 px-6 flex flex-col">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardLayout;