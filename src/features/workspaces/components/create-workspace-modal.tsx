'use client'

import { CreateWorkspaceForm, ResponsiveModal, useCreateWorkspaceModal } from "@/features"

export const CreateWorkspaceModal = () => {

    const { isOpen, setIsOpen, close } = useCreateWorkspaceModal();

    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateWorkspaceForm onCancel={close}/>
        </ResponsiveModal>
    )
}