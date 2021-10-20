import React from "react";
import './SearchBar.css';
import CloseIcon from '../resources/close.png';
import PositionIcon from '../resources/pin.png';
import { getLocations } from '../services/LocationService'

/*
Creates a search bar with a placeholder text.
Search bar takes user input and provides autocomplete suggestions.
*/
class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filteredData: [],
            wordEntered: "",
            location: {}
        };
    }

    render() {
        /*
        Acts on changed input text
        */
        const handleFilter = (event) => {
            /*
            Get current value from search input
            */
            const searchWord = event.target.value;
            this.setState({ wordEntered: searchWord });
            if (searchWord === "") {
                this.setState({ filteredData: [] })
            } else {
                const list = [0]
                /*
                Resolve promise from backend API fetch
                */
                const resolvePromise = () => {
                    return Promise.resolve(getLocations(searchWord))
                }
                /*
                Get filtered locations list (item)
                */
                const getFilteredLocations = async item => {
                    return resolvePromise(item)
                }
                const getData = async () => {
                    return Promise.all(list.map(item => getFilteredLocations(item)))
                }
                /*
                Ask for updated data from backend to update the filtered data
                */
                getData().then(data => {
                    this.setState({ filteredData: data[0] })
                })
            }
        };
        /*
        Clear filtered data and input field
        */
        const clearInput = () => {
            this.setState({ filteredData: [] });
            this.setState({ wordEntered: "" });
        };
        /*
        Autofill input field on result item click
        */
        const autoFill = (value) => {
            this.setState({ wordEntered: value.name });
            this.setState({ filteredData: [] });
            this.setState({ location: value })
            this.props.latlon(value)
        };
        return (
            <div className="search">
                <div className="searchInputs">
                    {/* Set placeholder text and update value on input */}
                    <input
                        type="text"
                        placeholder={this.props.placeholder}
                        value={this.state.wordEntered}
                        onChange={handleFilter}
                    />
                    {/* Show close icon if there are filtered results available */}
                    <div className="searchIcon">
                        {this.state.filteredData.length === 0 ? (
                            <img src={PositionIcon} className="Position-Icon" alt="position" />
                        ) : (
                            <img src={CloseIcon} className="Close-Icon" id="clearBtn" onClick={clearInput} alt="close" />
                        )}
                    </div>
                </div>
                {/* Show the top 15 items from filtered data */}
                {this.state.filteredData.length !== 0 && (
                    <div className="dataResult">
                        {this.state.filteredData.slice(0, 15).map((value, key) => {
                            return (
                                <button className="dataItem" key={value.idx} onClick={() => autoFill(value)}>
                                    <p>{value.name}</p>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }
}

export default SearchBar;