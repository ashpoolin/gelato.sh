// import { Link } from "react-router-dom";
// import logo from "../assets/gelato-logo.png";
import DynamicNav from "./DynamicNav";

function Header() {
  return (
    <div className="w-full my-2 py-16">
      {/* <div className="flex items-center justify-center space-x-2">
        <img src={logo} className="w-10 h-10" alt="gelato.sh" />
        <h1 className="text-white font-bold text-4xl">Gelato</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-white/50 hover:text-white no-underline transition ease-in-out duration-150">Home</Link>
        <Link to="/sol" className="text-white/50 hover:text-white no-underline transition ease-in-out duration-150">SOL</Link>
        <Link to="/stake" className="text-white/50 hover:text-white no-underline transition ease-in-out duration-150">Stake</Link>
        <Link to="/wallets" className="text-white/50 hover:text-white no-underline transition ease-in-out duration-150">Wallets</Link>
        <Link to="/research" className="text-white/50 hover:text-white no-underline transition ease-in-out duration-150">Research</Link>
        <Link to="/about" className="text-white/50 hover:text-white no-underline transition ease-in-out duration-150">About</Link>
      </div> */}
      <DynamicNav />
    </div>
  );
}

export default Header;