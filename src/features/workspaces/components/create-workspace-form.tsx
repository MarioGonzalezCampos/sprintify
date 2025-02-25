'use client';

import { z } from "zod";
import Image from "next/image";
import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createWorkspaceSchema, useCreateWorkspace } from "@/features";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type CreateWorkspaceFormProps = {
    onCancel?: () => void;
};

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {

    const router = useRouter();
    const { mutate, isPending } = useCreateWorkspace();
    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof createWorkspaceSchema>>({
        resolver: zodResolver(createWorkspaceSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {

        const finalValues = {
            ...values,
            image: values.image instanceof File ? values.image : "",
        }
        mutate({ form: finalValues }, {
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
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">
                    Create a new Workspace
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
                                            Workspace name
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                placeholder="Enter a name for your workspace"
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
                                                <p className="text-sm">Workspace Icon</p>
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
                                    Create Workspace
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>

        </Card>
    );

};
