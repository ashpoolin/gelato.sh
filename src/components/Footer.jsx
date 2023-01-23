import './Footer.css';
import { Link } from 'react-router-dom';
function Footer() {
    return (
        <div className="footer">
            <ul class="list-inline">
                <li>
                    &#169; 2023
                </li>
                <li>
                    <Link to="/">gelato.sh</Link>
                </li>
                <li>
                    <a href="https://github.com/ashpoolin/gelato.sh">github</a>
                </li>
                <li>
                    <a href="https://twitter.com/solanobahn">twitter</a>
                </li>
            </ul>
        </div>
    );
}

export default Footer;