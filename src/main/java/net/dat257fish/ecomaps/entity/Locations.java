package net.dat257fish.ecomaps.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import lombok.Data;

/*
Used for object mapping locations in JSON response from Västtrafik API
*/
@Entity
@Data
public class Locations implements Comparable<Locations> {
    
    // Id of stop
    @Id
	@Column
    private String id;

    // Name of address or stop
    @Column
    @NotNull(message="{NotNull.Location.name}")
    private String name;

    // Longitude of address or stop
    @Column
    @NotNull(message="{NotNull.Location.lon}")
    private String lon;

    // Latitude of address or stop
    @Column
    @NotNull(message="{NotNull.Location.lat}")
    private String lat;

    // Ordered by weight
    @Column
    @NotNull(message="{NotNull.Location.idx}")
    private String idx;

    /*
    Compares locations by their weight, sorted in IDX
    */
    @Override
    public int compareTo(Locations o) {
        return Integer.compare(Integer.valueOf(this.idx), Integer.valueOf(o.getIdx()));
    }

    /*
    Getters
    */
    public String getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public String getLon() {
        return this.lon;
    }

    public String getLat() {
        return this.lat;
    }

    public String getIdx() {
        return this.idx;
    }
}