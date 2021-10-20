package net.dat257fish.ecomaps.service;

import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import org.springframework.stereotype.Component;

import net.dat257fish.ecomaps.entity.Locations;
import net.dat257fish.ecomaps.LocationApiFetcher;

@Component
public class LocationsService {
    private LocationApiFetcher fetcher;

    /*
    Create instance of location API fetcher
    */
    public LocationsService() {
        fetcher = new LocationApiFetcher();
    }

    /*
    Get locations from API fetcher using variable
    */
    public List<Locations> getLocations(String searchWord) throws JsonMappingException, JsonProcessingException {
        return fetcher.getLocations(searchWord);
    }

}
