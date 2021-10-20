import React from 'react'
import L from "leaflet";
import './Map.css';
import SearchBar from './SearchBar';
import search from '../resources/searchvit.png';
// Import the JS and CSS needed to run the routing script
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
// Import logos
import car from '../resources/car.png';
import ped from '../resources/traveler.png';
import bicycle from '../resources/bicycle.png';
import bus from '../resources/public_transport.png';
import timeIcon from '../resources/time.png';
import distanceIcon from '../resources/map-pinpoint.png';
import emissionsIcon from '../resources/co22.png';

/* 
"Map.js" Contains the scripts needed to display an interactable map. Leaflets and react-leaflet are the main
plugins that we use
*/
class Map extends React.Component {
    busemi = 20;    //temp constant
    caremi = 120.4; //temp constant

    constructor(props) {
        super(props)
        this.updateFrom = this.updateFrom.bind(this)
        this.updateTo = this.updateTo.bind(this)
        this.createMap = this.createMap.bind(this)
        this.updateMap = this.updateMap.bind(this)
        const { state } = this.props.location
        const currentVehicle = state[0];
        //time should be fetched by API-call
        this.state = {
            /*bgColor stated to be used in onClick function for changing background color*/
            bgColor1: currentVehicle === "driving-car" ? 'lightgreen' : 'white',
            bgColor2: currentVehicle === "bus" ? 'lightgreen' : 'white',
            bgColor3: currentVehicle === "cycling-regular" ? 'lightgreen' : 'white',
            bgColor4: currentVehicle === "foot-walking" ? 'lightgreen' : 'white',
            vehicle: state[0],
            from: state[1],
            to: state[2],
            result_contents: state[3]
        }
        this.map = L.Map;
        this.mapCreated = false
    }
    //"calcdeluxe" takes the distance * the emission of Co2 per KM and returns it to the info array
    calcdeluxe(dist, emi) {
        return Math.round(dist / 1000 * emi) + " g";
    }

    //updates the data in "from"
    updateFrom(data) {
        this.setState({ from: data });
    }

    //updates the data in "to"
    updateTo(data) {
        this.setState({ to: data });
    }

    /*
    This function runs after "map" div is mounted
    */
    componentDidMount() {
        this.createMap();
    }

    /*
    This function creates a map and adds it to the global map variable
    */
    createMap() {
        if (this.mapCreated) {
            this.map.remove();
        }
        this.map = L.map('map2');
        this.mapCreated = true;

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        this.getRouteByVehicle(this.state.vehicle)
    }

    /*
    This function creates a route for the selected vehicle and adds
    it to the global map variable
    */
    getRouteByVehicle(vehicle) {
        var redIcon = new L.Icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        var greenIcon = new L.Icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        L.Routing.control({
            router: L.routing.openrouteservice('5b3ce3597851110001cf62487096caf50ad3432da8144e88ac57506b', {
                "service": "directions",
                // driving-car, cycling-regular, foot-walking
                "profile": vehicle === "bus" ? "driving-car" : vehicle
            }),
            waypoints: [
                L.latLng(this.state.from.lat, this.state.from.lon),
                L.latLng(this.state.to.lat, this.state.to.lon)
            ],
            lineOptions: {
                styles: [{
                    color: "#417cc4",
                    weight: 5
                }]
            },
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false,
            routeWhileDragging: false,
            createMarker: function (i, wp) {
                if (i === 0) {
                    // change the starting icons
                    return L.marker(wp.latLng, {
                        icon: redIcon
                    });
                } else {
                    // change the ending icons
                    return L.marker(wp.latLng, {
                        icon: greenIcon
                    });
                }
            }
        }).addTo(this.map);
        // Change the position of the Zoom Control to a newly created placeholder.
        this.map.zoomControl.setPosition('bottomright');
    }

    getDataByVehicle(vehicle, id, emission) {
        this.map.remove();
        this.map = L.map('map2');
        var routeControl2 = L.Routing.control({
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

        routeControl2.on('routesfound', function (e) {
            var routes = e.routes;
            var summary = routes[0].summary;
            distance1 = Math.round(summary.totalDistance);
            time1 = Math.round(summary.totalTime / 60);
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
        if (distance > 1000) {
            return Math.round(distance / 100) / 10 + " km"
        }
        return distance + " m"
    }

    updateMap() {
        this.getDataByVehicle("driving-car", 1, this.caremi)
        this.getDataByVehicle("cycling-regular", 3, 0);
        this.getDataByVehicle("foot-walking", 4, 0);
        //This gets the data for the bus, same routing as car.
        this.getDataByVehicle("driving-car",2,this.busemi);
        this.createMap()
    }


    /* Creating the search bar for the map page. */
    createSearchbar() {
        return (
            <div className="searchBarHolderMap">
                <div className="s-B1">
                    <SearchBar placeholder={this.state.from.name} latlon={this.updateFrom} />
                </div>

                <div className="s-B2">
                    <SearchBar placeholder={this.state.to.name} latlon={this.updateTo} />
                </div>

                <button className="search-ButtonMap" onClick={this.updateMap}>
                    <img src={search} alt="search"></img>
                </button>
            </div>
        );
    }

    /* Creates the info table that is in the large table. */
    createMiniTable(time, dist, emi) {
        return (
            <div className="MiniTableHolder">
                <table className='MiniTable'>
                    <tbody>
                        <tr id="r1"><td id="mr1d1"><img id="timeIcon" src={timeIcon} alt="timeIcon" /></td><th id="mr1d2">{time}</th></tr>
                        <tr id="r2"><td id="mr2d1"><img id="distanceIcon" src={distanceIcon} alt="distanceIcon" /></td><th id="mr2d2">{dist}</th></tr>
                        <tr id="r3"><td id="mr3d1"><img id="emissionsIcon" src={emissionsIcon} alt="emissionsIcon" /></td><th id="mr3d2">{emi}</th></tr>
                    </tbody>
                </table>
            </div>
        )
    }

    /* Function that is used when clicking on the table to make it "active" and show lightgreen color */
    boxClick(id, clickedVehicle) {
        if (id === 1) {
            this.stateReSet();
            this.setState({
                bgColor1: "lightgreen", vehicle: clickedVehicle
            }, () => {
                this.createMap();
            })
        }
        if (id === 2) {
            this.stateReSet();
            this.setState({
                bgColor2: "lightgreen", vehicle: clickedVehicle
            }, () => {
                this.createMap();
            })
        }
        if (id === 3) {
            this.stateReSet();
            this.setState({
                bgColor3: "lightgreen", vehicle: clickedVehicle
            }, () => {
                this.createMap();
            })
        }
        if (id === 4) {
            this.stateReSet();
            this.setState({
                bgColor4: "lightgreen", vehicle: clickedVehicle
            }, () => {
                this.createMap();
            })
        }

    }

    stateReSet() {
        this.setState({ bgColor1: "white" })
        this.setState({ bgColor2: "white" })
        this.setState({ bgColor3: "white" })
        this.setState({ bgColor4: "white" })
    }

    /* Creates the page with the map and tables*/
    render() {
        return (
            <div className="MapBody">
                <div className="MapHolder">
                    <div id="map2"></div>
                </div>
                {this.createSearchbar()}
                <div className="TableHolder">
                    <table className="ResultTable">
                        <tbody>
                            {/*All the elements in the tables, style is stated so that the onclick function will work to change the color*/}
                            <tr id="r1"><td id="r1d1" style={{ backgroundColor: this.state.bgColor1 }} onClick={() => this.boxClick(1, "driving-car")} ><img src={car} alt="car" /></td><td id="r1d2" style={{ backgroundColor: this.state.bgColor1 }}>
                                {this.createMiniTable(this.state.result_contents[0].time, this.state.result_contents[0].distance, this.state.result_contents[0].emissions)}
                            </td></tr>
                            <tr id="r2"><td id="r2d1" style={{ backgroundColor: this.state.bgColor2 }} onClick={() => this.boxClick(2, "bus")}><img src={bus} alt="bus" /></td><td id="r2d2" style={{ backgroundColor: this.state.bgColor2 }}>
                                {this.createMiniTable(this.state.result_contents[1].time, this.state.result_contents[1].distance, this.state.result_contents[1].emissions)}
                            </td></tr>
                            <tr id="r3"><td id="r3d1" style={{ backgroundColor: this.state.bgColor3 }} onClick={() => this.boxClick(3, "cycling-regular")} ><img src={bicycle} alt="bicycle" /></td><td id="r3d2" style={{ backgroundColor: this.state.bgColor3 }}>
                                {this.createMiniTable(this.state.result_contents[2].time, this.state.result_contents[2].distance, this.state.result_contents[2].emissions)}
                            </td></tr>
                            <tr id="r4"><td id="r4d1" style={{ backgroundColor: this.state.bgColor4 }} onClick={() => this.boxClick(4, "foot-walking")} ><img src={ped} alt="ped" /></td><td id="r4d2" style={{ backgroundColor: this.state.bgColor4 }}>
                                {this.createMiniTable(this.state.result_contents[3].time, this.state.result_contents[3].distance, this.state.result_contents[3].emissions)}
                            </td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default Map;