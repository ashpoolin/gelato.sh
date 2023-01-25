import '../App.css';
import logo from './Gelato_Logo-04.png';

function Home() {
  return (
    <div className="Home">

    <h1>gelato.sh</h1>
    <img src={logo} className="App-logo" alt="logo" />
    <p>
      <h3>Serving up insights for the Solana Ecosystem</h3>
    </p>
    <p>
      <ul>
        <li>Real-Time Exchange Wallet Tracker (SOL + SPLs)</li>
        <li>Event Log for significant inflows/outflows</li>
        <li>Custom Alerts (coming soon)</li>
      </ul>
    </p>
    </div>
    );
}

export default Home;