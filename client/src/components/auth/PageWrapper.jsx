import { motion as Motion } from "framer-motion";
import logo from '../../assets/zanly-logo.jpg'
import Header from "../landingpage/Header";
function PageWrapper({description, children }) {
  return (
    <>
       <Header/>
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6 mt-15">
      <Motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-4"
      >
       <div className="flex justify-center">
       <img src={logo} alt="logo" className="w-12 h-12 rounded-full object-cover"/>
       </div>

        {/* <h2 className="text-2xl font-medium text-center mb-0">{title}</h2> */}
        <p className="text-sm font-medium text-center mb-4">{description}</p>
        {children}
      </Motion.div>
    </div>
    </>
  );
}

export default PageWrapper;
