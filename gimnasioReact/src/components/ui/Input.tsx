import { forwardRef } from 'react';

const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
    return (
        <input 
        ref={ref} // Pasar el ref
        className="w-full bg-transparent border-none body cursor-pointer outline-none py-3 pl-8 text-on-surface text-lg placeholder:text-outline/50 focus:ring-0"
        {...props} 
        />
    );
});
export default Input;