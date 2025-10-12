'use client';

import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { signupService } from '@/lib/api/auth.service';
import { AxiosError } from 'axios';
import FormTextField from '@/components/shared/form-text-field';
import { useRouter } from 'next/navigation';
import { Lock, User, UserCircle } from 'lucide-react';
import FormCheckGroup from '@/components/shared/form-check-group';
import Link from 'next/link';
import { UserGender } from '@/lib/enums';

const formSchema = z
    .object({
        username: z
            .string()
            .min(6, {
                message: 'Username must be at least 6 characters.',
            })
            .max(30, {
                message: 'Username must not exceed 30 characters.',
            }),
        password: z
            .string()
            .min(8, {
                message: 'Password must be at least 8 characters.',
            })
            .max(32, {
                message: 'Password must not exceed 32 characters.',
            })
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
            .regex(/\d/, 'Password must contain at least one number.')
            .regex(/[@$!%*?&]/, 'Password must contain at least one special character (@$!%*?&).'),
        confirmPassword: z.string(),
        firstName: z.string().min(1, {
            message: 'Please enter your first name.',
        }),
        lastName: z.string().min(1, {
            message: 'Please enter your last name.',
        }),
        gender: z.enum(UserGender),
    })
    .refine(
        ({ password, confirmPassword }) => {
            return password === confirmPassword;
        },
        {
            message: "Passwords don't match",
            path: ['confirmPassword'],
        },
    );

export default function SignupPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            gender: undefined,
        },
    });

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const { confirmPassword, ...signupDate } = values;

            await signupService(signupDate);
            router.push('/login');
        } catch (error) {
            if (error instanceof AxiosError && error?.response?.data.message === 'Username already exists') {
                form.setError('username', {
                    type: 'manual',
                    message: 'Username already exists',
                });
            }
            console.error(error);
        } finally {
        }
    };

    return (
        <div className="h-screen w-screen bg-input flex justify-center items-center">
            <div className="bg-background w-[44rem] min-h-96 max-xs:h-[450px] rounded-lg">
                <div className="flex-1 flex flex-col justify-center items-center relative">
                    <Image className="absolute top-4 left-6" src="/images/logo.png" width={60} height={60} alt="logo" />
                </div>
                <div className="flex flex-col justify-center min-h-[28rem] space-y-4">
                    <div className="font-semibold text-2xl text-center text-primary">Signup</div>
                    <Form {...form}>
                        <form
                            method="post"
                            className="w-full space-y-1 flex flex-col items-center"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <div className="flex w-9/10 space-x-10">
                                <div className="flex-1 flex flex-col items-center space-y-4">
                                    <FormTextField
                                        control={form.control}
                                        name="username"
                                        placeholder="Type your username"
                                        icon={<User className="w-5 h-5 me-2" />}
                                    />
                                    <FormTextField
                                        control={form.control}
                                        name="password"
                                        placeholder="Type your password"
                                        icon={<Lock className="w-5 h-5 me-2" />}
                                        type="password"
                                    />
                                    <FormTextField
                                        control={form.control}
                                        name="confirmPassword"
                                        placeholder="Type your confirm password"
                                        icon={<Lock className="w-5 h-5 me-2" />}
                                        type="password"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col items-center space-y-4">
                                    <FormTextField
                                        control={form.control}
                                        name="firstName"
                                        placeholder="Type your first name"
                                        icon={<UserCircle className="w-5 h-5 me-2" />}
                                    />
                                    <FormTextField
                                        control={form.control}
                                        name="lastName"
                                        placeholder="Type your last name"
                                        icon={<UserCircle className="w-5 h-5 me-2" />}
                                    />
                                    <FormCheckGroup
                                        control={form.control}
                                        name="gender"
                                        icon={<UserCircle className="w-5 h-5 me-2" />}
                                        data={[
                                            {
                                                label: 'Male',
                                                value: UserGender.MALE,
                                            },
                                            {
                                                label: 'Female',
                                                value: UserGender.FEMALE,
                                            },
                                            {
                                                label: 'Other',
                                                value: UserGender.OTHER,
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                            <Button
                                className="w-40 !mt-6 py-2 bg-primary text-background rounded-full text-lg"
                                type="submit"
                            >
                                Signup
                            </Button>
                        </form>
                    </Form>
                    <div className="flex justify-center">
                        <Link href="/login" className="text-primary underline mt-2">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
