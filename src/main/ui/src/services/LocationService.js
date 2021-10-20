/*
This function is used for fetching locations from backend API 
using an input from the application's search bar
*/
export async function getLocations(searchWord) {
    const response = await fetch("/api/locations?input="+searchWord);
    return await response.json();
}