'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DottedSeparator } from "@/components/ui/dotted-separator";

import { useInviteCode, useJoinWorkspace, useWorkspaceId } from "@/features";

type JoinWorkspaceFormProps = {
    initialVlues: {
        name: string;
    };
}

export const JoinWorkspaceForm = ( { initialVlues } : JoinWorkspaceFormProps ) => {

    const { name } = initialVlues;

    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const inviteCode = useInviteCode();
    const { mutate, isPending } = useJoinWorkspace();

    const onSubmit = () => {
        mutate({
            param: { workspaceId },
            json: { code: inviteCode }
        }, {
            onSuccess: ({ data }) => {
                router.push(`/workspaces/${data.$id}`);
            }
        })
    }

    return (
        <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="p-7">
            <CardTitle className="text-xl font-bold">
                Join Workspace
            </CardTitle>
            <CardDescription>
                you&apos;ve been invited to join <strong>{name}</strong> workspace
            </CardDescription>
        </CardHeader>
        <div className="px-7">
            <DottedSeparator />
        </div>
        <CardContent className="p-7">
            <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
                <Button
                    size={"lg"}
                    variant={"secondary"}
                    type="button"
                    asChild
                    className="w-full lg:w-fit"
                    disabled={isPending}
                >
                    <Link href="/">
                        Cancel
                    </Link>
                </Button>
                <Button
                    size={"lg"}
                    type="submit"
                    className="w-full lg:w-fit"
                    onClick={onSubmit}
                    disabled={isPending}
                >
                    Join Workspace
                </Button>
            </div>
        </CardContent>
        </Card>
    )
}