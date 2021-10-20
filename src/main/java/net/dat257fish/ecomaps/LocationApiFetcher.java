package net.dat257fish.ecomaps;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import net.dat257fish.ecomaps.entity.Locations;
import net.dat257fish.ecomaps.entity.Feed; 

/*
Used for fetching locations from Västtrafik API
*/
@Component
public class LocationApiFetcher {
    private String url;
    private RestTemplate restTemplate;
    private HttpHeaders headers;
    private String access_token;

    /*
    Set url to Västtrafik's "location.name" API to get stops and addresses.
    Add access token to headers.
    */
    public void getToken() {
        authenticate();
        this.url = "https://api.vasttrafik.se/bin/rest.exe/v2/location.name?format=json&input=";
        this.headers = new HttpHeaders();
        this.headers.add("Authorization", "Bearer " + access_token); 
    }
    
    /*
    Get access token from Västtrafik's API.
    */
    public void authenticate() {
        this.restTemplate = new RestTemplate();
        // Base64 encoded key:secret from Västtrafik application
        String token_value = "TG9PbUI5NkEyNVZoNEQ0Zm1lS0pOU2xzdEFvYTpaMHQ3Wml2c1I0TVJ3UE1JVng0NjdPa1NTMFFh";
        String url = "https://api.vasttrafik.se/token?grant_type=client_credentials";
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Basic " + token_value); 
        headers.add("Content-Type", "application/x-www-form-urlencoded");
        HttpEntity<String> entity = new HttpEntity<String>(headers);
        // Do POST request with headers
        HttpEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        ObjectMapper mapper = new ObjectMapper();
        JsonNode jsonNode;
        try {
            // Read JSON result from API request
            jsonNode = mapper.readTree(response.getBody());
            // Add access token value from response to variable
            this.access_token = jsonNode.findValue("access_token").asText();
        // Currently no Exception handling...
        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    /*
    Get locations from Västtrafik API
    */
    public List<Locations> getLocations(String searchWord) throws JsonMappingException, JsonProcessingException {
        getToken();
        HttpEntity<String> entity = new HttpEntity<String>(headers);
        // Send the GET request with input from application
        HttpEntity<String> response = restTemplate.exchange(url+searchWord, HttpMethod.GET, entity, String.class);
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.setVisibility(PropertyAccessor.FIELD, Visibility.ANY);
        List<Locations> locations = new ArrayList<>();
        try {
            // Convert JSON response to location objects
            Feed feed = mapper.readValue(response.getBody(), Feed.class);
            // Add addresses to location list
            locations.addAll(feed.getLocationList().getCoordLocations());
            // Add stops to location list
            locations.addAll(feed.getLocationList().getStopLocations());
            // Sort locations by IDX (weighted)
            Collections.sort(locations);
        // Currently no Exception handling...
        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return locations;
    }
}