import { ReactNode } from "react";

interface FormFieldProps {
    label: ReactNode;
    error?: string;
    children: ReactNode;
};

const FormField = ({ label, error, children }: FormFieldProps) => {
    return (
    <div className="w-full flex flex-col gap-1">
      <label className="w-full flex gap-3 font-semibold md:gap-3 md:justify-center md:p-3">
        {label}
        {children}
      </label>

      {error && (
        <span className="text-red-500 text-sm text-center md:-mt-2">
          {error}
        </span>
      )}
    </div>
  );
};
export default FormField;