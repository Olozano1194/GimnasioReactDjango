const Button = ({children, ...props}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <button className="bg-sky-600 cursor-pointer flex gap-2 items-center rounded-lg p-4 text-slate-100 text-lg font-bold mb-2 hover:scale-105 hover:bg-sky-400 hover:text-slate-800" {...props}>
        
                {children}
        </button>
    );
};
export default Button;

