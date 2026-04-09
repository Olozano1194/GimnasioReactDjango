const Label = ({children, ...props}: React.LabelHTMLAttributes<HTMLLabelElement>) => {
    return (
        
        <label className="floating-label absolute left-0 text-secondary pointer-events-none"
        {...props}
        >
            {children}
        </label>
    );
};
export default Label;