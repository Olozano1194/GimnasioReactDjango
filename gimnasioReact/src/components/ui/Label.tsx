const Label = ({children, ...props}: React.LabelHTMLAttributes<HTMLLabelElement>) => {
    return (
        
        <label className="w-full flex flex-col justify-center items-center gap-3 font-semibold text-xl md:gap-5 lg:flex-row lg:justify-between"
        {...props}
        >
            {children}
        </label>
    );
};
export default Label;