'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DottedSeparator } from '@/components/ui/dotted-separator';
import { Input } from '@/components/ui/input';

import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpSchema } from '@/lib/zod';
import { useRegister } from '../api/use-register';


export const SignUpCard = () => {

    const { mutate, isPending } = useRegister();

    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = (values: z.infer<typeof SignUpSchema>) => {
        mutate({ json: values });
    }


    return (
            <Card className='w-full h-full md:w-[487px] border-none shadow-none'>
                <CardHeader className='flex items-center justify-center text-center p-7'>
                    <CardTitle className='text-2xl'>
                        Sign Up
                    </CardTitle>
                    <CardDescription className='text-neutral-500'>
                        By signing up, you agree to our{" "}
                        <Link href="/privacy">
                            <span className='text-blue-500'> Privacy Policy </span>
                        </Link>{" "}
                        and {" "}
                        <Link href="/terms">
                            <span className='text-blue-500'> Terms of Service </span>
                        </Link>
                    </CardDescription>
                </CardHeader>
                <div className='px-7 mb-2'>
                    <DottedSeparator />
                </div>
                <CardContent className='p-7'>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>

                            <FormField 
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                disabled={isPending}
                                                type='text'
                                                placeholder='Enter your name'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}

                            />

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
                                                {...field}
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
                                Register
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
                    Already have an account?{' '}
                        <Link href='/sign-in'>
                            <span className='text-blue-700'>&nbsp;Sign In </span>
                        </Link>
                    </p>
                </CardContent>

            </Card>
    )
}
