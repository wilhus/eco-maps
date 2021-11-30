
# ![EcoMaps logo](/src/main/ui/src/resources/eco-map-outline.png)

## About

**EcoMaps** is a web-application where you can navigate the Gothenburg area and get information about carbon footprint for different modes of transportation.

The application is built using React (JS) and Spring Boot (Java). Location data is fetched from Västtrafik journey planner API, and routing is fetched from Openrouteservice API. Map is provided by OpenStreetMap.

EcoMaps aims to provide an alternative to Google Maps and similar routing tools, with the added function of calculating CO2 emissions based on your choice of transportation.

The project was created for the course Agile software project management (DAT257) at Chalmers University of Technology during the autumn of 2021.

## How to run the application

The application is deployed to Azure App Services and can be reached at https://eco-maps.azurewebsites.net.

**Disclaimer**: Application is not guaranteed to be fully functional after deployment, run locally for best performance.

If you would like to run the application locally, follow these steps:

1. Clone the master branch to some location on your computer.

2. Install [Maven](https://maven.apache.org/install.html) on your computer.

3. Open a terminal/command prompt and change directory to `eco-maps` within the project folder cloned to your computer:  
`cd ...path-to-project.../eco-maps`  
Then run:  
`mvn clean install`  
Followed by:  
`java -jar target/eco-maps-1.0.jar`  

3. Application is now available in your browser at **localhost:8080**

## How to use the application

Demo available [here](https://www.youtube.com/watch?v=cISMGMmEBWI)

1. Type in the respective search bar where you want to travel from and to, select a location in the filtered dropdown menu.

2. Choose which way you want to travel, by car, bus, bicycle or foot. Take into account the carbon footprint based on your choice.

3. Follow the given route. You may also change locations and mode of transportation. Happy travels!

## The Team

Jonatan Axetorn

Carl Classon

William Husar

Oskar Jakobsson

Simon Länsberg

Anna Manfredsson
