import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
};

const FormField = ({ label, error, children }: FormFieldProps) => {
  return (
    <div className="w-full flex flex-col gap-1">
      {label && <div className="block font-bold ml-1 pt-4 text-[1rem] text-secondary tracking-widest uppercase">{label}</div>}

      <div className="border-b border-[rgba(195, 198, 215, 0.4)] duration-300 flex items-center relative transition-all">
        {children}
      </div>

      {error && (
        <span className="text-red-500 text-sm">
          {error}
        </span>
      )}
    </div>
  );
};
export default FormField;