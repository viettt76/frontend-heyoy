import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils/tailwind-merge';
import { Eye, EyeOff } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

interface FormTextFieldProps<T extends FieldValues> {
    name: FieldPath<T>;
    control: Control<T>;
    icon?: ReactNode;
    type?: 'text' | 'email' | 'password';
    styleInput?: string;
    placeholder?: string;
}

export default function FormTextField<T extends FieldValues>({
    name,
    control,
    icon,
    type,
    styleInput,
    placeholder,
}: FormTextFieldProps<T>) {
    const [isShowPassword, setIsShowPassword] = useState(false);

    const isPassword = type === 'password';

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="w-4/5">
                    <FormControl className="w-full">
                        <div className="w-full border-b pb-2 flex items-center mt-6">
                            {icon}
                            <input
                                className={cn(
                                    'w-4/5 border-none outline-none focus:shadow-none focus:ring-transparent',
                                    styleInput,
                                )}
                                type={isPassword && isShowPassword ? 'text' : type}
                                placeholder={placeholder}
                                {...field}
                            />
                            {isPassword &&
                                (isShowPassword ? (
                                    <Eye onClick={() => setIsShowPassword(false)} />
                                ) : (
                                    <EyeOff onClick={() => setIsShowPassword(true)} />
                                ))}
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
