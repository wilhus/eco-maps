import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from "./components/Home"
import Map from "./components/Map"
import Error from "./components/Error"
import Results from "./components/Results"
import Header from './components/Header';
import Footer from './components/Footer';
import './components/Header.css';
import './components/Footer.css';

function App() {//Creates the website and enabels switching between the different pages. 
    return (
        //Container div holding all content on the webpage
        <div className="container">
            <Header className='Header' />
            {/*Content div for containing each page-body*/}
            <div className="content">
                <Switch> {/* Creates the paths used to swap between the diferent pages */}
                    <Route path="/" component={Home} exact />
                    <Route path="/map" component={Map} exact />
                    <Route path="/results" component={Results} exact />
                    <Route component={Error} />
                </Switch>
            </div>
            <Footer className='Footer' />
        </div>
    )
}

export default App;