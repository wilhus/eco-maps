package net.dat257fish.ecomaps.entity;

import java.util.List;
import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;

/*
Used for object mapping the nodes in JSON response from Västtrafik API
*/
@JsonAutoDetect(fieldVisibility = Visibility.ANY)
public class ParentNode {
    /*
    Links to node "StopLocation" in Västtrafik API response
    Used for storing stops
    */
    private List<Locations> StopLocation = new ArrayList<>();
    
    /*
    Links to node "CoordLocation" in Västtrafik API reponse
    Used for storing addresses
    */
    private List<Locations> CoordLocation = new ArrayList<>();

    /*
    Getters
    */
    public List<Locations> getStopLocations() {
        return this.StopLocation;
    }

    public List<Locations> getCoordLocations() {
        return this.CoordLocation;
    }
}
