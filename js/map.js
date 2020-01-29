var url = "https://darshmap.free.beeceptor.com";

// var props = getProps(url);
// console.log(props);

let map = fetch(url)
            .then(response => response.json())
            .then(data => mapInit(data.center));

// var props;
// fetch(url)
//     .then(response => response.json())
//     .then(data => mapInit(data.center));
// var map = mapInit(props.center);
// 
// function getProps(url) 
// {
//   let response = fetch(url);
//   let data = response.json();
//   return response;
// }

function mapInit(center) {
    var tempMap = new MapmyIndia.Map("map",{ center:[center.lat, center.lng],zoomControl: true,hybrid:true,zoom:4 });
    return tempMap;
}

