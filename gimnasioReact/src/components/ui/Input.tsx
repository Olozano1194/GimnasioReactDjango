import { forwardRef } from 'react';

const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
    return (
        <input 
        ref={ref} // Pasar el ref
        className="floating-input border-b border-b-[rgba(195,198,215,0.4)] bg-transparent font-medium outline-none px-0 rounded-none text-on-surface w-full focus:ring-0 focus:border-text-primary"
        {...props} 
        />
    );
});
export default Input;