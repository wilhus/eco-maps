import React from "react";
import '../App.css';
import './Home.css';
import logo from '../resources/eco-maps-logo2.png';

/* Function responsible for the web-page footer. */
function Footer() {
    return (
        <footer className="Footer">
            <p className="Footer-Text">Made in Sweden, by Fish</p>
            <div className= "Footer-Logo"> 
            <img src={logo}  alt="bw_logo" />
            </div>
            {/**Links to the icons we are using. */}
            <div className="Links">
                <p className="link-text">Icons by:
                    <a href="https://icons8.com/" target="_blank" rel="noopener noreferrer" className="Footer-link-1">Icons8</a>
                    , 
                    <a href="https://www.flaticon.com/" target="_blank" rel="noopener noreferrer" className="Footer-link-2">Flaticon</a>
                </p>

            </div>

        </footer>
    );
}

export default Footer;