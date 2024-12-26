import { forwardRef } from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
    return (
        <input 
        ref={ref} // Pasar el ref
        className="w-64 bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-gray-500 text-lg placeholder:text-gray-500"
        {...props} 
        />
    );
});
export default Input;