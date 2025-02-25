

import { CreateWorkspaceForm, getCurrent } from '@/features'
import { redirect } from 'next/navigation';
import React from 'react'

const WorkspaceCreatePage = async () => {

    const user = await getCurrent();
    console.log(user);
    if (!user) redirect("/sign-in");


    return (
        <div className='w-full lg:max-w-xl'>
            <CreateWorkspaceForm />
        </div>        
    )
}

export default WorkspaceCreatePage