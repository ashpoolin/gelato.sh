import './About.css';
import { Link } from 'react-router-dom';
import logo from './Gelato_Logo-04.png';

function About() {
  return (
    <div>
      <h1>gelato.sh</h1>
      <img src={logo} className="App-logo" alt="logo" />
      <h3>Serving up on-chain insights for Solana</h3>
      <p>While there are several premier on-chain intelligence platforms out there (Nansen, Arkham), these tools 
        emphasize Ethereum/EVM-based chains, and give just a nod to the Solana ecosystem.
        Solana is a leading chain, and it deserves tools that do more than these other platforms currently offer.
        Gelato is unique as it takes a Solana-centric (solanic?) approach to handling and presenting data.
      </p>
      <p>
        While Ethereum's dark forest is mostly well-lit now, Solana users still don't enjoy great visibility. Our work tracking down
        exchange wallets and whales on-chain has prepared us to create this product. While other tools may try to be everything
        to everyone, Gelato is more boutique, leading you through hand-curated data to inform your path through Solana's neon forest.  
      </p>
      <p>
        <ul className="list-inline">
        <li>                   
          <a href="https://github.com/ashpoolin/gelato.sh">github</a>
        </li>
        <li>                    
          <a href="https://twitter.com/solanobahn">twitter</a>
        </li>
        </ul>
      </p>
        
    </div>
    );
}

export default About;