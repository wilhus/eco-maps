package net.dat257fish.ecomaps.entity;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;

/*
Used for object mapping the root in JSON response from Västtrafik API
*/
@JsonAutoDetect(fieldVisibility = Visibility.ANY)
public class Feed {
    /*
    Links to node "LocationList" in Västtrafik API response
    */
    private ParentNode LocationList = new ParentNode();

    /*
    Getter
    */
    public ParentNode getLocationList() {
        return this.LocationList;
    }
}
