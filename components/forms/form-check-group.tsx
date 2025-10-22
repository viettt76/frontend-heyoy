import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ReactNode } from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface FormCheckGroupProps<T extends FieldValues> {
    name: FieldPath<T>;
    control?: Control<T>;
    icon?: ReactNode;
    type?: 'radio' | 'checkbox';
    styleSelect?: string;
    direction?: 'vertical' | 'horizontal';
    data: { label: string; value: string }[];
}

export default function FormCheckGroup<T extends FieldValues>({
    name,
    control,
    icon,
    direction = 'horizontal',
    data,
}: FormCheckGroupProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className={`flex ${direction === 'vertical' ? 'flex-col' : ''}`}
                        >
                            {icon}
                            {data.map((item) => (
                                <FormItem className="flex items-center space-x-3 space-y-0" key={item.value}>
                                    <div className="flex items-center space-x-1">
                                        <FormControl>
                                            <RadioGroupItem value={item.value} />
                                        </FormControl>
                                        <FormLabel className="font-normal">{item.label}</FormLabel>
                                    </div>
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
