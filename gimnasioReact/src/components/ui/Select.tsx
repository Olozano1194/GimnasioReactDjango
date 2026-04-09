import { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    children: React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ children, className = '', ...props }, ref) => {
    return (
        <select
            ref={ref}
            className={`floating-input border-b border-b-[rgba(195,198,215,0.4)] bg-transparent font-medium outline-none px-0 rounded-none text-on-surface w-full focus:ring-0 focus:border-text-primary cursor-pointer ${className}`}
            {...props}
        >
            {children}
        </select>
    );
});

Select.displayName = 'Select';

export default Select;
