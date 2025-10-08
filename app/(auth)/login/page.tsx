'use client';

import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { loginService } from '@/lib/api/auth.service';
import { AxiosError } from 'axios';
import { Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormTextField from '@/components/shared/form-text-field';

const loginSchema = z.object({
    username: z.string().min(1, {
        message: 'Vui lòng nhập tài khoản',
    }),
    password: z.string().min(1, {
        message: 'Vui lòng nhập mật khẩu',
    }),
});

export default function Login() {
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        try {
            await loginService(values);
            router.push('/');
        } catch (error) {
            form.setError('password', {
                type: 'manual',
                message: error instanceof AxiosError && error.response?.data?.message,
            });
            console.error(error);
        }
    };

    return (
        <div className="h-screen w-screen bg-input flex justify-center items-center">
            <div className="bg-background w-[40rem] -translate-y-10 flex min-h-96 rounded-lg relative">
                <Image
                    className="absolute top-4 left-6"
                    priority
                    src="/images/logo.png"
                    width={60}
                    height={60}
                    alt="logo"
                />
                <div className="flex-1 flex flex-col justify-center items-center max-xs:hidden">
                    <div className="text-3xl text-center">
                        Welcome to <span className="text-primary">Heyoy</span>
                    </div>
                    <div className="text-xl text-primary/80 text-center">Connection place</div>
                </div>
                <div className="flex-1 flex flex-col justify-center -translate-y-4">
                    <div className="font-semibold text-2xl text-center">Đăng nhập</div>
                    <Form {...form}>
                        <form className="w-full flex flex-col items-center" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormTextField
                                name="username"
                                control={form.control}
                                icon={<User className="w-5 h-5 me-2" />}
                                placeholder="Type your username"
                            />
                            <FormTextField
                                name="password"
                                control={form.control}
                                icon={<Lock className="w-5 h-5 me-2" />}
                                placeholder="Type your password"
                                type="password"
                            />
                            <Button className="w-3/5 mt-6 py-1 bg-primary text-background rounded-full" type="submit">
                                Đăng nhập
                            </Button>
                            <div className="text-sm mt-2">
                                Bạn chưa có tài khoản?
                                <Link href="/signup" className="text-primary ms-1">
                                    Đăng ký
                                </Link>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
