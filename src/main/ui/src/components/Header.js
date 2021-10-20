import React from "react";
import {Link} from "react-router-dom";
import logo from '../resources/eco-map-outline.png';
import '../App.css';
import './Home.css';

/* Function responsible for the web-page header, Work in Progress. */
function Header() {
    return (
        <header className="Header">
            <Link 
                to="/"> <div className = "EcoMaps-Logo"> <img src={logo} alt="logo" title = "Return home!" /> </div>  
            </Link>
            <div className="Widget">
            <a className="weatherwidget-io" href="https://forecast7.com/en/57d7111d97/gothenburg/" data-label_1="GOTHENBURG" data-label_2="WEATHER" data-font="Open Sans" data-icons="Climacons Animated" data-mode="Current" data-theme="pure" >GOTHENBURG WEATHER</a>

            {!function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                // if (!d.getElementById(id)) {
                    js = d.createElement(s);
                    js.id = id;
                    js.src = 'https://weatherwidget.io/js/widget.min.js';
                    fjs.parentNode.insertBefore(js, fjs);
                // }
            }
                (document, 'script', 'weatherwidget-io-js')
            }

        </div>
        </header>
    );
}

export default Header;
