import { forwardRef } from 'react';

const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
    return (
        <input 
        ref={ref} // Pasar el ref
        className="w-64 bg-slate-300 border-b-2 border-slate-100 cursor-pointer outline-none text-gray-500 text-lg placeholder:text-gray-500 md:w-full"
        {...props} 
        />
    );
});
export default Input;