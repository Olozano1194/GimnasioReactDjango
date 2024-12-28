import { useEffect, useState } from "react";
import { getHome } from "../../api/userGymDay.api";
import { BsPeople } from "react-icons/bs";
import { FaMoneyBillWave } from "react-icons/fa";

const Home = () => {
  const [stats, setStats] = useState({
    num_miembros: 0,
    total_month: 0,
    miembros_mes: 0,
    total: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getHome();
        console.log("Datos recibidos:", data);
        setStats(data);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      }
    };
    loadStats();
  }, []);
  //Función para dar formato a la moneda en este caso pesos colombianos
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(amount);
  };
  //Array de objetos con las estadísticas
  const cards = [
    {
      title: "Miembros",
      value: stats.num_miembros,
      subtitle: "Total de miembros",
      icon: <BsPeople size={24} className="text-blue-500" />,
      bgColor: "bg-blue-100",
    },
    {
      title: "Miembros del Mes",
      value: stats.miembros_mes,
      subtitle: "Registrados este mes",
      icon: <BsPeople size={24} className="text-green-500" />,
      bgColor: "bg-green-100",
    },
    {
      title: "Ingresos Totales",
      value: formatCurrency(stats.total),
      subtitle: "Dinero Total",
      icon: <FaMoneyBillWave size={24} className="text-purple-500" />,
      bgColor: "bg-purple-100",
    },
    {
      title: "Ingresos del Mes",
      value: formatCurrency(stats.total_month),
      subtitle: "Dinero del mes",
      icon: <FaMoneyBillWave size={24} className="text-orange-500" />,
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <main className="cards bg-secondary w-full p-4 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => (
                //Renderizado de las estadísticas
                <div
                    key={index}
                    className={`${card.bgColor} rounded-lg p-6 shadow-md transition-all hover:shadow-lg`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {card.title}
                            </h2>
                            <p className="text-gray-600 text-sm">{card.subtitle}</p>
                        </div>
                    <div className="p-3 rounded-full bg-white shadow-sm">
                        {card.icon}
                    </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{card.value}</div>
                </div>
            ))}
        </div>
    </main>
  );
};

export default Home;
