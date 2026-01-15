import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/useAuth";
//Icons
import { CiUser } from "react-icons/ci";
import { RiLockPasswordLine, RiLoginBoxLine } from "react-icons/ri";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
//ui
import { Input } from "../../components/ui/index";
// Components
import FormHeader from "../../components/form/formTitle/FormHeader";
import FormField from "../../components/form/formField/FormField";
//Mensajes
import { toast } from "react-hot-toast";
//Models
import { LoginUserDto } from "../../model/dto/user.dto";
//img
import Logo from "../../../public/favicon-32x32.png";
import imgGym from "../../../public/img_Gym_prev_ui.png";


const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserDto>();
  const [showkPass, setShowPass] = useState(false);


  const onSubmit = handleSubmit(async (data: LoginUserDto) => {
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      //console.log('Login successful, result:', response);
      
      toast.success('Login exitoso');
      // Redirect to the dashboard
      navigate("/dashboard");      
    } catch {
      // console.error("Error logging in:", error);
      toast.error("Error al iniciar sesión");
    }
  });

  // Visibilidad del pass
  const handlePass = () => {
    setShowPass(!showkPass);
  };

  return (
    <main className="w-full h-screen flex flex-col justify-center items-center lg:justify-between lg:flex-row lg:pr-48">
      <div className="hidden w-full h-full relative lg:flex lg:w-1/2 lg:justify-center lg:items-center">
        <img src={imgGym} alt="img del gym" className="w-full h-[75%]" />
      </div>

      <form
        onSubmit={onSubmit}
        className="w-[90%] bg-slate-300 flex flex-col justify-center items-center text-slate-600 gap-6 p-4 rounded-md md:w-[52%] md:gap-8 lg:w-[45%] xl:max-w-[30%]"
      >
        <section className="w-full flex justify-center">
          <FormHeader
            logo={Logo}
            title="Inicio de"
            highlight="sesión"
          />          
        </section>
        {/* Section inputs */}
        <section className="w-full flex flex-col justify-center items-center gap-7">
          {/* email */}
          <FormField
            label={
              <CiUser className="text-2xl text-gray-800" />
            }
            error={errors.email?.message}
          >
            <Input
              type="email"
              placeholder="Escribe el email"
              {...register("email", {
                required: {
                  value: true,
                  message: "Email requerido",
                },
              })}
            />
          </FormField>
          {/* Password */}
          <FormField
            label={
              <RiLockPasswordLine className="text-2xl text-gray-600" />
            }
            error={errors.password?.message}
          >
            <Input
              type={showkPass ? "text" : "password"}
              id="password"
              placeholder="Escribe la Contraseña"
              {...register("password", {
                required: {
                  value: true,
                  message: "Contraseña requerida",
                },
              })}
            />
            {/* Mostrar u ocultar la contraseña */}
            <button
              type="button"
              onClick={handlePass}
              className="cursor-pointer"
            >
              {showkPass ? <MdOutlineVisibility /> : <MdOutlineVisibilityOff />}
            </button>
          </FormField>                   
        </section>
        {error && <span className="text-red-600 text-sm text-center -mt-3 md:-mt-6">{error}</span>}
        {/* btn login */}
          <button
            className="bg-sky-600 cursor-pointer flex gap-0.5 items-center rounded-lg p-2 text-slate-100 font-bold mb-2 hover:scale-105 hover:bg-sky-400 hover:text-slate-800"
            type="submit"
          >
            <RiLoginBoxLine className="text-2xl text-purple-800" />
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        {/* registrar o recuperar contraseña */}
        {/*<div className='flex flex-col gap-2 text-center md:flex-row md:gap-4'>
                    <p className='text-gray-500 text-sm'>¿No tienes cuenta? 
                        <Link
                            to='/register'
                            className='text-sky-600 hover:text-sky-400 lg:text-base'> Registrate
                        </Link>
                    </p>
                    <p className='text-gray-500 text-sm'>¿olvido la contraseña?
                        <Link
                            to='/forget-password'
                            className='text-sky-600 hover:text-sky-400 lg:text-base'> Recuperar
                        </Link>
                    </p>
        </div>*/}
      </form>
    </main>
  );
};
export default Login;