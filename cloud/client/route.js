'use strict';


//const uuid = uuidv4();
//console.log("uuid", uuid);

const width  = window.innerWidth || document.documentElement.clientWidth ||
document.body.clientWidth;
const height = window.innerHeight|| document.documentElement.clientHeight||
document.body.clientHeight;
//console.log(width, height);

const CustomIcon = L.Icon.extend
(
{
  options:
  {
    //shadowUrl: 'leaf-shadow.png',
    //shadowSize:   [50, 64],
    //shadowAnchor: [4, 62],
    iconSize: [30,54],
    iconAnchor: [15,48],
    popupAnchor:  [0,0]
  }
}
);

const own_location_mobile_icon = new CustomIcon({iconUrl: 'icons/leaflet/own_ship_symbol.png', iconSize: [20,32],iconAnchor: [10,16]});
const own_location_stationary_icon = new CustomIcon({iconUrl: 'icons/leaflet/own_ship_stationary_symbol.png', iconSize: [16,16], iconAnchor: [8,8]}); //000_kt.png', iconSize: [45,81],iconAnchor: [22.5,72]});
const sea_mobile_icon = new CustomIcon({iconUrl: 'icons/leaflet/ship_symbol.png', iconSize: [16,24],iconAnchor: [8,12]});
const sea_stationary_icon = new CustomIcon({iconUrl: 'icons/leaflet/ship_stationary_symbol.png', iconSize: [12,12], iconAnchor: [6,6]});

// center of the map
const center = [61.1713915, 12.8971463]; //[62.664450, 18.286383];

// Create the map
let map = L.map( 'map', {attributionControl: false} ).setView(center, 5);
// Set up the OSM layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
L.control.scale().addTo(map);
let markersLayer = new L.LayerGroup();// add a marker in the given location
markersLayer.addTo(map);

const own_position_url = 'https://' + window.location.hostname + '/client/get_own_pos_records.php';

const is_touch_device = Help.isTouchDevice();


let guab_div = document.createElement("DIV");
document.body.appendChild(guab_div);
Help.set_properties( guab_div.style, { "position": "relative" } );
let guab_button = document.createElement("BUTTON");
guab_div.appendChild(guab_button);
guab_button.id = "guab_button";
Help.set_properties( guab_button.style, { "position": "absolute", "width": "110px", "bottom": "0px", "right": "0px", "padding": "0px", "z-index": "400" , "color": Help.rgba_literal_from_array([0,0,0,255]), "backgroundColor": Help.rgba_literal_from_array([127,127,127,63]) } ) ;
const guab_01_image_url = 'images/leaflet/' + 'guab_01_image.png' ;
guab_button.innerHTML = '<img src="' + guab_01_image_url + '"/>';
guab_button.addEventListener("click", open_guab_website);

let tsb_div = document.createElement("DIV");
document.body.appendChild(tsb_div);
Help.set_properties( tsb_div.style, { "position": "relative" } );
let tsb_button = document.createElement("BUTTON");
tsb_div.appendChild(tsb_button);
tsb_button.id = "tsb_button";
Help.set_properties( tsb_button.style, { "position": "absolute", "width": "110px", "bottom": "0px", "right": "110px", "padding": "0px", "z-index": "400" , "color": Help.rgba_literal_from_array([0,0,0,255]), "backgroundColor": Help.rgba_literal_from_array([127,127,127,63]) } ) ;
const tsb_01_image_url = 'images/leaflet/' + 'tsb_01_image.png' ;
tsb_button.innerHTML = '<img src="' + tsb_01_image_url + '"/>';
tsb_button.addEventListener("click", open_tsb_website);


setInterval(refresh_display, 2000);
refresh_data();


function open_guab_website()
{
  window.open('https://gustavsvik.eu')
}


function open_tsb_website()
{
  window.open('https://testsitebothnia.eu')
}


function refresh_display()
{
  //markersLayer.clearLayers();
}


async function refresh_data()
{

  let position_string_array = [];

  const own_position_response = await fetch( own_position_url, { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: new URLSearchParams({'channels': '99999;', 'duration': '-9999', 'sql_like_condition': 'Lisa-Marie'}) } );
  let own_position_data = null;
  try
  {
    own_position_data = await own_position_response.json();
  }
  catch(e)
  {
  }

  //console.log("own_position_data", own_position_data);

  const data_array = Help.decodeTransferString(own_position_data);
  let data_string_array = [];
  if (data_array[2].length > 0) data_string_array = data_array[2][0];
  let timestamp_array = [];
  if (data_array[0].length > 0) timestamp_array = data_array[0][0];
  for (let _ais_string_counter = 0; _ais_string_counter < data_string_array.length; _ais_string_counter++)
  {
    const time = parseInt(timestamp_array[_ais_string_counter]);
    const datetime = new Date(time*1000);
    const utc_time_string = datetime.toGMTString();

    let ais_string = data_string_array[_ais_string_counter]

    if (ais_string.length > 0)
    {
      const regex_comma = /\|/g;
      const regex_semicolon = /\~/g;
      let ais_json_string = ais_string.replace(regex_semicolon, ";");
      ais_json_string = ais_json_string.replace(regex_comma, ",");

      const ais_json = Help.json_safe_parse(ais_json_string)[0]; //[0];

      const lon = Help.safe_get(ais_json, "lon");
      const lat = Help.safe_get(ais_json, "lat");
      const speed = Help.safe_get(ais_json, "speed");
      const heading = Help.safe_get(ais_json, "heading");
      const mmsi = Help.safe_get(ais_json, "mmsi");

      if ( mmsi !== null && lat !== null && lon !== null)
      {
        let marker_2 = L.circleMarker([ lat, lon ], {opacity: 0.5, color: "#00c600"});
        marker_2.setRadius(1) // - 4 * age/900);
        markersLayer.addLayer(marker_2);
        let html_string = '<div style="font-size:10px;line-height:100%;">' + 'ID: ' + mmsi.toString() + '<br>' + utc_time_string.substring(0,16) + '<br>' + utc_time_string.substring(17) + '<br>' + 'Lat: ' + lat.toString() + '&deg' + '<br>' + 'Lon: ' + lon.toString()  + '&deg';
        if (speed !== null) html_string += '<br>' + 'Speed: ' + (speed*1.94384).toFixed(1) + ' kt';
        if (heading !== null) html_string += '<br>' + 'Heading: ' + parseFloat(heading).toFixed(1) + ' &deg';
        html_string += '</div>';
        if (!is_touch_device) marker_2.bindTooltip(html_string);
        else marker_2.bindPopup(html_string, {closeOnClick: true, autoClose: false});
      }
    }
  }
}
