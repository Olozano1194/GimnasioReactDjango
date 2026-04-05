interface FormHeaderProps {
  logo: string;
  title: string;
  highlight: string;
};
const FormHeader = ({ logo, title, highlight }: FormHeaderProps) => {
  return (
    <header className="w-full flex flex-col items-center">
      <section className="bg-primary/5 flex h-14 items-center justify-center mb-4 px-2 rounded-xl">
        <img
          src={logo}
          alt="logo"
          className="w-9 h-7 rounded-md"
        />
      </section>
      <h1 className="font-black text-2xl text-on-surface tracking-tight">
        {title}
        {highlight && (
          <span className="text-text-primary pl-2">
            {highlight}
          </span>
        )}
      </h1>
      <p className="mt-1 text-sm text-secondary">Portal de Gestión de Elite</p>
    </header>
  );
};

export default FormHeader;
