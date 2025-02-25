import { EditWorkspaceForm, getCurrent, getWorkspace } from "@/features"
import { redirect } from "next/navigation";

type WorkspaceIdSettingsPageProps = {
    params: Promise<{
        workspaceId: string;
    }>
};

const WorkspaceIdSettingsPage = async ( { params }: WorkspaceIdSettingsPageProps ) => {

    const { workspaceId } = await params;

    const user = await getCurrent();
    if (!user) redirect("/sign-in");

    const initialValues = await getWorkspace({ workspaceId });
    if (!initialValues) {
        redirect(`/workspaces/${workspaceId}`);
    }

    return (
        <div className="w-full lg:max-w-xl">
            <EditWorkspaceForm initialValues={initialValues}/>
        </div>
    )
}

export default WorkspaceIdSettingsPage