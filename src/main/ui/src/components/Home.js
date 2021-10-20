import React, { useState } from 'react';
import './Home.css';
import SearchBar from './SearchBar';
import { Link } from "react-router-dom";


/*
 "Home.js" Creates a home screen div
 */



function Home(props) {

    const [from, setFrom] = useState({});
    const [to, setTo] = useState({});

    const updateFrom = (data) => {
        setFrom(data);
    };
    const updateTo = (data) => {
        setTo(data);
    };

    return (
        <div className="Home-Body">
            <div className="SearchBox">
                <div className="cont">
                    <h1 className="Text">Where would you like to travel?</h1>
                </div>
                <div className="cont">
                    <SearchBar placeholder="from..." latlon={updateFrom} /> {/*Creates an instance of SearchBar with the placeholder "from" and the icon labled "1" */}
                </div>
                <div className="cont">
                    <SearchBar placeholder="to..." latlon={updateTo} />
                </div>
                <div className="cont">
                    <Link to={{
                        pathname: "/results",
                        state: [from, to] // your data array of objects
                    }}>
                        <button className="SearchButton" >
                            SEARCH
                        </button>

                    </Link>
                </div>


            </div>
        </div>
    );
}

export default Home;