package net.dat257fish.ecomaps.controller;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import net.dat257fish.ecomaps.entity.Locations;
import net.dat257fish.ecomaps.links.LocationLinks;
import net.dat257fish.ecomaps.service.LocationsService;

import lombok.extern.slf4j.Slf4j;

/*
Used for communication with UI
*/
@Slf4j
@RestController
@RequestMapping("/api/")
public class LocationsController {
    
    @Autowired
	private LocationsService locationsService;
	
    // Listens to requests from UI
	@GetMapping(path = LocationLinks.LIST_LOCATIONS)
    public ResponseEntity<?> listLocations(@RequestParam String input) {
        final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(LocationsController.class);
        log.info("LocationsController:  list locations");
        List<Locations> resource = new ArrayList<>();
        try {
            // Request locations using input from UI
            resource = locationsService.getLocations(input);
        // Currently no Exception handling...
        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok(resource);
    }
}