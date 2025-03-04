'use client';

import { z } from "zod";
import Image from "next/image";
import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Car, CopyIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUpdateProject } from "../api/use-update-project";
import { updateProjectSchema } from "../schema";
import { ProjectTypes } from "../types";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteProject } from "../api/use-delete-project";

type EditProjectFormProps = {                         // Modify this line
    onCancel?: () => void;
    initialValues: ProjectTypes;                      // Add this line
};

export const EditProjectForm = ({ onCancel, initialValues }: EditProjectFormProps) => {                  // Modify this line

    const router = useRouter();
    const { mutate, isPending } = useUpdateProject();

    const { mutate: deleteProject, isPending: isDeletingProject } = useDeleteProject();

    const [DeleteDialog, confirmDelete] = useConfirm(
        "Delete Project",
        "This action cannot be undone. Are you sure you want to delete this project?",
        "destructive",
    )

    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof updateProjectSchema>>({           
        resolver: zodResolver(updateProjectSchema),
        defaultValues: {
            ...initialValues,                       // Add this line
            image: initialValues.imageUrl ?? "",        // Add this line
        },
    });

    const handleDelete = async () => {
        const ok = await confirmDelete();

        if (!ok) return;

        deleteProject(
            { param: { projectId: initialValues.$id }},
            {
                onSuccess: () => {
                    router.push(`/workspaces/${initialValues.workspaceId}`);
                }
            }
        
        ); 
    }


    const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {

        const finalValues = {
            ...values,
            image: values.image instanceof File ? values.image : "",
        }
        mutate({ 
            form: finalValues, 
            param: { projectId: initialValues.$id }      // Add this line
        } , {
            onSuccess: ({ data }) => {
                form.reset();
                router.push(`/workspaces/${data.$id}`);
            }
        });
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue("image", file);
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            <DeleteDialog />
            <Card className="w-full h-full border-none shadow-none">
                <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
                    <Button size={"sm"} variant={"secondary"} onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`) } disabled={isPending}>
                        Back
                        <ArrowLeftIcon className="size-4 mr-2"/>
                    </Button>
                    <CardTitle className="text-xl font-bold">
                        {initialValues.name}                     
                    </CardTitle>
                </CardHeader>
                <div className="px-7">
                    <DottedSeparator />
                </div>
                <CardContent className="p-7">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-y-4">
                                <FormField 
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Project name
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field}
                                                    placeholder="Enter a name for your project"
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField 
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <div className="flex flex-col gap-y-2">
                                            <div className="flex items-center gap-x-5">
                                                {field.value ? (
                                                    <div className="size-[72px] relative rounded-lg overflow-hidden">
                                                        <Image
                                                            alt="Logo"
                                                            fill
                                                            className="object-cover"
                                                            src={ field.value instanceof File ? URL.createObjectURL(field.value) : field.value }
                                                        />
                                                    </div>
                                                ) : (
                                                    <Avatar className="size-[72px]">
                                                        <AvatarFallback>
                                                            <ImageIcon className="size-[36px] text-neutral-400"/>
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )}
                                                <div className="flex flex-col">
                                                    <p className="text-sm">Project Icon</p>
                                                    <p className="text-sm text-muted-foreground">JPG, PNG, SVG, JPEG or WEBP, max 1MB</p>
                                                    <input 
                                                        className="hidden" 
                                                        type="file" 
                                                        accept=".jpg, .png, .svg, .jpeg, .webp" 
                                                        ref={inputRef}
                                                        onChange={handleImageChange}
                                                        disabled={isPending}
                                                    />
                                                    {field.value ? (
                                                        <Button
                                                            type="button"
                                                            disabled={isPending}
                                                            variant="destructive"
                                                            size={"xs"}
                                                            className="w-fit mt-2"
                                                            onClick={() => {
                                                                field.onChange(null);
                                                                if (inputRef.current) {
                                                                    inputRef.current.value = "";
                                                                }
                                                            }}
                                                        >
                                                            Remove Image
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            type="button"
                                                            disabled={isPending}
                                                            variant="teritary"
                                                            size={"xs"}
                                                            className="w-fit mt-2"
                                                            onClick={() => inputRef.current?.click()}
                                                        >
                                                            Upload Image
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                />
                                <DottedSeparator className="py-7"/>
                                <div className="flex items-center justify-between">
                                    <Button
                                        type="button"
                                        size={"lg"}
                                        variant={"secondary"}
                                        onClick={onCancel}
                                        disabled={isPending}
                                        className={cn(!onCancel && "invisible")}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        size={"lg"}
                                        disabled={isPending}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>

            </Card>
            <Card className="w-full h-full border-none shadow-none">
                <CardContent className="p-7">
                    <div className="flex flex-col">
                        <h3 className="font-bold">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground">
                            Deleting a project is irreversible and will remove all associated data. Please be certain.
                        </p>
                        <DottedSeparator className="py-7"/>
                        <Button
                            className="mt-6 w-fit ml-auto"
                            size={"sm"}
                            variant={"destructive"}
                            type="button"
                            disabled={isPending}
                            onClick={handleDelete}
                        >
                            Delete Project
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

};
