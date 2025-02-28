

import { getCurrent, getWorkspaceInfo, JoinWorkspaceForm } from '@/features'
import { redirect } from 'next/navigation';
import React from 'react'

type WorkspaceIdJoinPageProps = {
    params: Promise<{
        workspaceId: string;
    }>
};

const WorkspaceIdJoinPage = async ( { params }: WorkspaceIdJoinPageProps ) => {

    const { workspaceId } = await params;

    const initialVlues = await getWorkspaceInfo({ 
        workspaceId
    });

    if (!initialVlues) {
        redirect("/");
    }

    const user = await getCurrent();
    if (!user) redirect('/sign-in');

    return (
        <div className='w-full lg:max-w-xl'>
            <JoinWorkspaceForm initialVlues={initialVlues} />
        </div>
    )
}

export default WorkspaceIdJoinPage