import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex justify-center font-sans">
        <div className="w-full px-5">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
