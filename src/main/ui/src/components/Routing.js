import L, { latLng } from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
//import "@gegeweb/leaflet-routing-machine-openroute"
/*
"Routing.js" Controls the script that creates a routh between two cordinates on a given map
*/

const createRoutineMachineLayer = (props) => {
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
    return (L.Routing.control({
        router: L.routing.openrouteservice('5b3ce3597851110001cf62487096caf50ad3432da8144e88ac57506b', {
            "service": "directions",
            // driving-car, cycling-regular, foot-walking
            "profile": props.vehicle
        }),
        waypoints: [ //Start -> Goal (Cordinates are given in the form (longitude, latitude))
            latLng(props.from.lat, props.from.lon),
            latLng(props.to.lat, props.to.lon)
        ],
        lineOptions: {
            styles: [{
                color: "#417cc4",
                weight: 10
            }]
        },
        //Below follows a few settings for the map, currently disabled.
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        routeWhileDragging: false,
        createMarker: function(i, wp) {
            if (i === 0) {
              // here change the starting icons
              return L.marker(wp.latLng, {
                icon: redIcon
              });
            } else {
              // here change the ending icons
              return L.marker(wp.latLng, {
                icon: greenIcon
              });
            }
          }
    }));

};
  
const Routing = createControlComponent(createRoutineMachineLayer);
  
export default Routing;