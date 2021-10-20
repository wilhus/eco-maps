import './Results.css';
import car from '../resources/car.png';
import ped from '../resources/traveler.png';
import bicycle from '../resources/bicycle.png';
import bus from '../resources/public_transport.png';
import time from '../resources/time.png';
import distance from '../resources/map-pinpoint.png';
import emissions from '../resources/co22.png';
import search from '../resources/searchvit.png';
import React from 'react'
import SearchBar from './SearchBar';
import L from "leaflet";
import "leaflet-routing-machine";
import "@gegeweb/leaflet-routing-machine-openroute"

/*Creates both a class and constructor where the "state" of the function is a array of objects. The array contains the information that is to be 
presented in the result table on our result page      */
class Results extends React.Component {
    busemi = 20;    //temp constant
    caremi = 120.4; //temp constant

    constructor(props) {
        super(props)
        this.updateFrom = this.updateFrom.bind(this)
        this.updateTo = this.updateTo.bind(this)
        this.getData = this.getData.bind(this)
        const { state } = this.props.location

        this.state = {
            result_contents: [
                { id: 1, vehicle: <img src={car} alt="driving-car" />, time: "", distance: "", emissions: "" },
                { id: 2, vehicle: <img src={bus} alt="bus" />, time: "", distance: "", emissions: "" },
                { id: 3, vehicle: <img src={bicycle} alt="cycling-regular" />, time: "", distance: "", emissions: "0 g Co2" },
                { id: 4, vehicle: <img src={ped} alt="foot-walking" />, time: "", distance: "", emissions: "0 g Co2" }
            ],
            from: state[0],
            to: state[1]
        }
        this.map = L.Map;
        this.mapCreated = false
    }
    //"calcdeluxe" takes the distance * the emission of CO2 per KM and returns it to the info array
    calcdeluxe(dist, emi) {
        return Math.round(dist/1000 * emi) + " g";
    }

    //updates the data in "from"
    updateFrom(data) {
        this.setState({ from: data }, () => {
            //callback
            console.log(this.state.from) // myname
        });
    }

    //updates the data in "to"
    updateTo(data) {
        this.setState({ to: data }, () => {
            //callback
            console.log(this.state.to) // myname
        });
    }


    //"renderResultsHeader" Creates a header with a related icon for each column
    renderResultsHeader() {
        let header = Object.keys(this.state.result_contents[0])
        return header.map((key, index) => {
            if (key === "vehicle") {
                return <th key={index}>Vehicle</th>
            }
            else if (key === "time") {
                return <th key={index}>{<img src={time} alt="time" />}</th>
            }
            else if (key === "distance") {
                return <th key={index}>{<img src={distance} alt="distance" />}</th>
            }
            else if (key === "emissions") {
                return <th key={index}>{<img src={emissions} alt="emissions" />}</th>
            }
            else { return [] }
        })
    }


    //"renderResultsData" makes the information form "result_contents" readable and formated for the result table
    renderResultsData() {
        return this.state.result_contents.map((result_contents, index) => {
            const { vehicle, time, distance, emissions } = result_contents //destructuring
            return (
                <tr key={index} onClick={() => this.handleOnClick(vehicle)}>
                    <td>{vehicle}</td>
                    <td>{time}</td>
                    <td>{distance}</td>
                    <td>{emissions}</td>
                </tr>
            )
        })
    }

    //"handleOnClick" Works like an action event handler for the result table. For each alternative of transportation this event handeler sends the user to a specific page of the webapplication
    handleOnClick(vehicle) {
        var content = {};
        var result_contents = [];
        for(let i = 0; i < 4; i++) {
            content = {
                id: this.state.result_contents[i].id,
                vehicle: this.state.result_contents[i].vehicle.props.alt,
                time: this.state.result_contents[i].time,
                distance: this.state.result_contents[i].distance,
                emissions: this.state.result_contents[i].emissions
            }
            result_contents.push(content)
        }
        this.props.history.push({
            pathname: '/map',
            state: [vehicle.props.alt, this.state.from, this.state.to, result_contents]
        });
    
    }

    /*
    This function runs after "map" div is mounted
    */
    componentDidMount() {
        this.getData();
    }

    /*
    This function creates a "temporary" map to calculate distance and time
    from routes depending on "from" and "to" locations
    */
    getData() {
        if(this.mapCreated) {
            this.map.remove();
        }
        this.map = L.map('map');
        this.mapCreated = true;

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        this.getDataByVehicle("driving-car", 1, this.caremi);
        this.getDataByVehicle("cycling-regular", 3, 0);
        this.getDataByVehicle("foot-walking", 4, 0);
        //Getting data for bus, same route as car, different emission.
        this.getDataByVehicle("driving-car",2,this.busemi);
    }

    getDataByVehicle(vehicle, id, emission) {
        var routeControl = L.Routing.control({
            router: L.routing.openrouteservice('5b3ce3597851110001cf62487096caf50ad3432da8144e88ac57506b', {
                "service": "directions",
                // driving-car, cycling-regular, foot-walking
                "profile": vehicle
            }),
            waypoints: [
                L.latLng(this.state.from.lat, this.state.from.lon),
                L.latLng(this.state.to.lat, this.state.to.lon)
            ]
        }).addTo(this.map);

        var distance1 = "";
        var time1 = "";

        routeControl.on('routesfound', function (e) {
            var routes = e.routes;
            var summary = routes[0].summary;
            //A lil' hack to get different, hardcoded, numbers for the bus. (bus-id = 2)
            if(id===2) {
                distance1 = Math.round(summary.totalDistance * 1.1);
                time1 = Math.round((summary.totalTime * 1.3) / 60);
            } else {
                distance1 = Math.round(summary.totalDistance);
                time1 = Math.round(summary.totalTime / 60);
            }
            update();
        });

        const update = () => {
            this.setState(prevState => ({
                result_contents: prevState.result_contents.map(
                obj => (obj.id === id ? Object.assign(obj, { 
                    time: this.convertMinsToTime(time1), 
                    distance: this.convertMetersToDistance(distance1),
                    emissions: this.calcdeluxe(distance1, emission)
                }) : obj)
              )
            }));
        }
    }

    convertMinsToTime = (mins) => {
        let hours = Math.floor(mins / 60);
        let minutes = mins % 60;
        //return hours + " hrs " + minutes + " min";
        return `${hours ? `${hours} hrs ` : ''}${minutes} min`
    }

    convertMetersToDistance = (distance) => {
        if(distance > 1000) {
            return Math.round(distance/100) / 10 + " km"
        }
        return distance + " m"
    }

    //"render" Creates the layout and structure of the result table
    render() {
        return (
            <div className="result-Body">
                <div id="map"></div>
                <div className="result-Outer">
                    <div className="searchBarHolderResult">
                        <div className="s-B1">
                            <SearchBar placeholder={this.state.from.name} latlon={this.updateFrom} />
                        </div>
                        <div className="s-B2">
                            <SearchBar placeholder={this.state.to.name} latlon={this.updateTo} />
                        </div>
                        <button className="search-ButtonResults" onClick={this.getData} >
                            <img src={search} alt="search"></img>
                        </button>
                    </div>
                    <table className="result-Table">
                        <tbody>
                            <tr>{this.renderResultsHeader()}</tr>
                            {this.renderResultsData()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default Results;