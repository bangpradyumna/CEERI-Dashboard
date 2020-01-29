let url = "http://www.mocky.io/v2/5e31a6b13200009887888708";
let url2 = "https://nodesdarsh.free.beeceptor.com";
var map;

window.onload = function loadPage(){
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            mapInit(data.center); // Initialize map using center coordinates
            // addDefaultData(data.def);
            fetchDataForNode(data.def);
            return data.markers;
        })
        .then((data) =>{
            addAllMarkers(data);
        });
}

function mapInit(center) {
    map = new MapmyIndia.Map("map",{ center:[center.lat, center.lng],zoomControl: true,hybrid:true,zoom:4 });
}

function addAllMarkers(markers){
    markers.forEach(element => {
        addMarker(element);
    });
}

function addMarker(mk){
    let tempMk = new L.marker([mk.lat, mk.lng]).addTo(map);
    tempMk.on("click", function (e) {
        console.log(mk);
        fetchDataForNode(mk);
    })
    return tempMk;
}

// function addDefaultData(props){
//     // Something to fetch data of default city
//     return;
// }

function fetchDataForNode(props){
    // Fetch a data for node "props"
    fetch(url2+"/"+props.id)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            $('.sparkbar.pm10').sparkline(data.pm10, { type: 'bar', height: '20', barWidth: 40, barSpacing: 4, barColor: '#00C0DD', negBarColor: "#001DFF" });
        });
    // $('.sparkbar.pm10').sparkline([1,5,-1,-10,20], { type: 'bar', height: '20', barWidth: 40, barSpacing: 4, barColor: '#00C0DD', negBarColor: "#001DFF" });
    // console.log("Fetching data for ");
    // console.log(props);
}

// http://www.mocky.io/v2/5e31a6b13200009887888708