'use client';

import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { DottedSeparator } from '@/components/ui/dotted-separator';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

import { useForm } from 'react-hook-form';
import { SignInSchema } from '@/lib/zod';
import { useLogin } from '../api/use-login';


export const SignInCard = () => {

    const { mutate, isPending } = useLogin();

    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = (values: z.infer<typeof SignInSchema>) => {
        mutate( 
            { json: values },
            {
            onSuccess: () => {
                // Redirige al usuario a la página protegida
                window.location.href = "/";
            }
        }
        )
    }

    return (
        <Card className='w-full h-full md:w-[487px] border-none shadow-none'>
            <CardHeader className='flex items-center justify-center text-center p-7'>
                <CardTitle className='text-2xl'>
                    Welcome back!
                </CardTitle>
            </CardHeader>
            <div className='px-7 mb-2'>
                <DottedSeparator />
            </div>

            <CardContent className='p-7'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>

                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            type='email'
                                            placeholder='Enter your email address'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            { ...field }
                                            disabled={isPending}
                                            type='password'
                                            placeholder='Enter your password'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <Button disabled={isPending} size={"lg"} className='w-full'>
                            Sign In
                        </Button>

                    </form>
                </Form>
            </CardContent>

            <div className='px-7'>
                <DottedSeparator />
            </div>

            <CardContent className='p-7 flex flex-col gap-y-4'>
                <Button
                    variant='secondary'
                    disabled={isPending}
                    size='lg'
                    className='w-full'
                >
                    <FcGoogle className='inline-block mr-2 size-5' />
                    login with Google
                </Button>
                <Button
                    variant='secondary'
                    disabled={isPending}
                    size='lg'
                    className='w-full'
                >
                    <FaGithub className='inline-block mr-2 size-5' />
                    login with Github
                </Button>
            </CardContent>

            <div className='px-7'>
                <DottedSeparator />
            </div>
            <CardContent className='p-7 flex items-center justify-center'>
                <p>
                   Don&apos;t have an account?{' '}
                    <Link href='/sign-up'>
                        <span className='text-blue-700'>&nbsp;Sign Up </span>
                    </Link>
                </p>
            </CardContent>

        </Card>
    )
}
