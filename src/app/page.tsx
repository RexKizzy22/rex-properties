import Navbar from "@/components/NavBar";
import Hero from "@/components/Hero";
import InfoBoxes from "@/components/InfoBoxes";
import Footer from "@/components/Footer";
import HomeProperties from "@/components/HomeProperties";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = async () => {

  return (
    <>
      <ToastContainer />
      <Navbar />
      <Hero />
      <InfoBoxes />
      <HomeProperties />
      <Footer />
    </>
  );
};

export default Home;
