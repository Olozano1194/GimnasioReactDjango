// section
import WelcomeSection from "../../components/home/WelcomeSection";
import MetricsSection from "../../components/home/MetricsSection";
import RecentActivitySection from "../../components/home/RecentActivitySection";
import FooterSection from "../../components/home/FooterSection";

const HomePage = () => {  

  return (
    <>
    <main className="bg-surface-container-lowest border border-outline-variant/10 flex flex-col p-8 rounded-2xl shadow-sm space-y-8 w-full">
      <WelcomeSection />
      <MetricsSection />      
      <RecentActivitySection /> 
    </main>
    <FooterSection />
    </>    
  );
};
export default HomePage;
