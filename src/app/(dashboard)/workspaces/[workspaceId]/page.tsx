
import { getCurrent } from '@/features';
import { redirect } from 'next/navigation';
import React from 'react'

type WorksPaceIdPagePageProps = {
    params: Promise<{
        workspaceId: string;
    }>
};

const WorksPaceIdPage = async ({ params }: WorksPaceIdPagePageProps) => {

    const user = await getCurrent();
    //console.log(user);
    if (!user) redirect("/sign-in");

    return (
        <div>
            workspace Id: {(await params).workspaceId}
        </div> 
    )
}
export default WorksPaceIdPage