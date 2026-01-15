interface FormHeaderProps {
    logo: string;
    title: string;
    highlight: string;
};
const FormHeader = ({ logo, title, highlight }: FormHeaderProps) => {
  return (
    <header className="w-full flex justify-center">
      <h1 className="text-2xl font-bold flex items-center pb-2 md:pt-3 md:text-3xl">
        <img
          src={logo}
          alt="logo"
          className="w-9 h-7 rounded-lg mr-2"
        />

        {title}

        {highlight && (
          <span className="text-sky-600 pl-2">
            {highlight}
          </span>
        )}
      </h1>
    </header>
  );
};

export default FormHeader;
