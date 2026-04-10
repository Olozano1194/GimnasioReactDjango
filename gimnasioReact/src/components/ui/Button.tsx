import React from 'react';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
    children, 
    variant = 'primary',
    className = '',
    ...props 
}: ButtonProps) => {
    const baseClasses = 'cursor-pointer flex gap-2 items-center justify-center rounded-lg p-4 text-lg font-bold mb-2 hover:scale-105 transition-all duration-200';
    
    const variantClasses = {
        primary: 'bg-sky-600 hover:bg-sky-400 text-slate-100 hover:text-slate-800',
        secondary: 'bg-transparent border-2 border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-slate-100'
    };

    return (
        <button 
            className={`${baseClasses} ${variantClasses[variant]} ${className} ${!props.disabled ? 'w-80' : 'w-80 opacity-50 cursor-not-allowed'}`} 
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;