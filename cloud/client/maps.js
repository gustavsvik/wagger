'use strict';

const width  = window.innerWidth || document.documentElement.clientWidth || 
document.body.clientWidth;
const height = window.innerHeight|| document.documentElement.clientHeight|| 
document.body.clientHeight;
//console.log(width, height);

let Ais = new AisData();

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

const sea_mobile_icon = new CustomIcon({iconUrl: 'icons/leaflet/ship_symbol.png', iconSize: [16,24],iconAnchor: [8,12]});
const sea_stationary_icon = new CustomIcon({iconUrl: 'icons/leaflet/ship_stationary_symbol.png', iconSize: [12,12], iconAnchor: [6,6]});
const shore_stationary_icon = new CustomIcon({iconUrl: 'icons/leaflet/building_symbol.png', iconSize: [16,18], iconAnchor: [8,11]});
const aton_special_mark_virtual_icon = new CustomIcon({iconUrl: 'icons/leaflet/ais_aton_special_mark_virtual.png', iconSize: [24,32], iconAnchor: [12,24]});
const shore_mobile_icon = new CustomIcon({iconUrl: 'icons/leaflet/land_vehicle_symbol.png'});
const danger_icon = new CustomIcon({iconUrl: 'icons/leaflet/danger_over_symbol.png', iconSize: [24,24], iconAnchor: [12,12]});

const wind_000_kt_icon = new CustomIcon({iconUrl: 'icons/leaflet/000_kt.png'});
const wind_001_kt_icon = new CustomIcon({iconUrl: 'icons/leaflet/001_kt.png'});
const wind_003_kt_icon = new CustomIcon({iconUrl: 'icons/leaflet/003_kt.png'});
const wind_008_kt_icon = new CustomIcon({iconUrl: 'icons/leaflet/008_kt.png'});
const wind_013_kt_icon = new CustomIcon({iconUrl: 'icons/leaflet/013_kt.png'});
const wind_018_kt_icon = new CustomIcon({iconUrl: 'icons/leaflet/018_kt.png'});
const wind_023_kt_icon = new CustomIcon({iconUrl: 'icons/leaflet/023_kt.png'});
const wind_028_kt_icon = new CustomIcon({iconUrl: 'icons/leaflet/028_kt.png'});
const wind_033_kt_icon = new CustomIcon({iconUrl: 'icons/leaflet/033_kt.png'});
const wind_038_kt_icon = new CustomIcon({iconUrl: 'icons/leaflet/038_kt.png'});


// center of the map
const center = [62.664450, 18.286383]; //[62.826, 17.879];

//const shore = [62.8315, 17.8705];
//const sea_mobile = [62.827, 17.90];
//const land_mobile = [62.832, 17.88];
//const buoy_1 = [62.8219465526254, 17.878395190126632];
//const buoy_2 = [62.830045904677235, 17.88962710650322];
//const virtual_1 = [62.82410637983922, 17.883320754338765];
//const virtual_2 = [62.8271661350588, 17.887655981226686];

// Create the map
let map = L.map('map').setView(center, 11);
// Set up the OSM layer
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
L.control.scale().addTo(map);
let markersLayer = new L.LayerGroup();// add a marker in the given location
markersLayer.addTo(map);

let myInterval = setInterval
(
  function() 
  {
    const is_touch_device = Help.isTouchDevice();
    markersLayer.clearLayers();
    let current_timestamp = parseInt((new Date().valueOf()) / 1000);

    const danger_pos_01 = [62.664450, 18.286383];
    let danger_marker_01 = L.marker(danger_pos_01, {icon: danger_icon}).addTo(map);
    danger_marker_01.setOpacity( 1.0 );
    danger_marker_01.setRotationOrigin("center");
    danger_marker_01.setRotationAngle(0);
    let danger_html_string = '<div style="font-size:10px;line-height:100%;">';
    //danger_html_string += 'VARNING! DRIVANDE MINA!<br>Ungefärlig position:' + '<br>' ;
    danger_html_string += 'Drivande mina röjd 210617<br>Ungefärlig position:' + '<br>' ;
    danger_html_string += 'Lat: ' + danger_pos_01[0].toString() + ' deg.' + '<br>' ;
    danger_html_string += 'Lon: ' + danger_pos_01[1].toString() + ' deg.' ;  //Disp.jsonToTable(content_json, {}); 
    const danger_image_url = 'images/leaflet/' + 'danger_01_image.png' ;
    danger_html_string += '<br><br>' + '<img src="' + danger_image_url + '"/>';
    if (!is_touch_device) danger_marker_01.bindTooltip(danger_html_string);
    else danger_marker_01.bindPopup(danger_html_string, {closeOnClick: false, autoClose: false});

    //console.log("Ais.MMSI_ARRAY.length", Ais.MMSI_ARRAY.length);
    for (let _mmsi_counter = 0; _mmsi_counter < Ais.MMSI_ARRAY.length; _mmsi_counter++)
    {
      const mmsi = Ais.MMSI_ARRAY[_mmsi_counter];
      const lat = Ais.POS_ARRAY[_mmsi_counter][1];
      const lon = Ais.POS_ARRAY[_mmsi_counter][0];
	  const wspeed = Ais.WIND_SPEED_ARRAY[_mmsi_counter];
	  const wdir = Ais.WIND_DIR_ARRAY[_mmsi_counter];
	  const speed = Ais.SPEED_ARRAY[_mmsi_counter];
	  const course = Ais.COURSE_ARRAY[_mmsi_counter];
      const content = Ais.TEXT_ARRAY[_mmsi_counter];
      const age = current_timestamp - Ais.TIME_ARRAY[_mmsi_counter];

      if (lat !== null && lon !== null)
      {
        let marker = L.marker([ lat, lon ], {icon: sea_stationary_icon}).addTo(map);
        //let marker = L.circleMarker([ latitude, longitude ]).addTo(map);
        //marker.setIcon(sea_stationary_icon);
        if (speed > 0) marker.setIcon(sea_mobile_icon);
        let time_opacity = (1200-(age-600))/1200 ;
        if (time_opacity > 1) time_opacity = 1;
        if (time_opacity < 0) time_opacity = 0;
        marker.setOpacity( time_opacity );
        marker.setRotationOrigin("center");
        marker.setRotationAngle(course);
        //console.log(wind_speed);
        const content_json = Help.json_safe_parse(content);
        if (content_json !== null) 
        {
          let html_string = '<div style="font-size:10px;line-height:100%;">';
          html_string += (age/60).toString().substring(0,3) + ' min. ago' + '<br>';

          if (wspeed !== null) 
          {
            if (wspeed > 38.0) marker.setIcon(wind_038_kt_icon);
            else if (wspeed > 33.0) marker.setIcon(wind_033_kt_icon);
            else if (wspeed > 28.0) marker.setIcon(wind_028_kt_icon);
            else if (wspeed > 23.0) marker.setIcon(wind_023_kt_icon);
            else if (wspeed > 18.0) marker.setIcon(wind_018_kt_icon);
            else if (wspeed > 13.0) marker.setIcon(wind_013_kt_icon);
			else if (wspeed > 8.0) marker.setIcon(wind_008_kt_icon);
            else if (wspeed > 3.0) marker.setIcon(wind_003_kt_icon);
			else if (wspeed > 1.0) marker.setIcon(wind_001_kt_icon);
            else marker.setIcon(wind_000_kt_icon);

            marker.setRotationOrigin("15px 48px");
            marker.setRotationAngle(wdir);
            if (wspeed !== null) html_string += 'Wind speed: ' + wspeed.toString().substring(0,3) + ' kt.' + '<br>';
            if (wdir !== null) html_string += 'Wind direction: ' + wdir.toString().substring(0,3) + ' deg.' + '<br>';
			if (mmsi !== null) html_string += 'ID: ' + mmsi.toString();
          }
          else
          {
            let type = Help.safe_get(content_json, "type");
            if ( type !== null) type = parseInt(type);
            if (type === 4)
            {
              marker.setIcon(shore_stationary_icon);
            }
            else if (type === 21)
            {
              const complete_name = Help.safe_get(content_json, "complete_name");
              if (complete_name !== null) html_string += 'Info: ' + complete_name.toString() + '<br>' ;
              marker.setIcon(aton_special_mark_virtual_icon);
            }
            else
            {
              if (speed !== null) html_string += 'Speed: ' + speed.toString() + ' kt.' + '<br>' ;
              if (course !== null) html_string += 'Course: ' + course.toString() + ' deg.' + '<br>' ;
              const shipname = Help.safe_get(content_json, "shipname");
              if (shipname !== null) html_string += 'Name: ' + shipname.toString() + '<br>' ;
              const callsign = Help.safe_get(content_json, "callsign");
              if (callsign !== null) html_string += 'Callsign: ' + callsign.toString() + '<br>' ;
              const destination = Help.safe_get(content_json, "destination");
              if (destination !== null) html_string += 'Destination: ' + destination.toString() + '<br>' ;
              const imo = Help.safe_get(content_json, "imo");
              if (imo !== null) html_string += 'IMO: ' + imo.toString() + '<br>' ;
            }
            if (mmsi !== null) html_string += 'ID: ' + mmsi.toString() + '<br>' ;
            if (lat !== null) html_string += 'Lat: ' + lat.toString() + ' deg.' + '<br>' ;
            if (lon !== null) html_string += 'Lon: ' + lon.toString() + ' deg.' ;  //Disp.jsonToTable(content_json, {});  

            const icon_filename = Help.safe_get(content_json, "icon_filename");
            if (icon_filename !== null)
            {
              const icon_url = 'icons/leaflet/' + icon_filename ;
              const icon = new CustomIcon({iconUrl: icon_url, iconSize: [32,32],iconAnchor: [16,16]})
              marker.setIcon(icon);
            }
          }

          const image_filename = Help.safe_get(content_json, "image_filename");
          if (image_filename !== null)
          {
            const image_url = 'images/leaflet/' + image_filename ;
            html_string += '<br><br>' + '<img src="' + image_url + '"/>';
          }

          if (!is_touch_device) marker.bindTooltip(html_string);
          else marker.bindPopup(html_string, {closeOnClick: false, autoClose: false}) ;

        }
        markersLayer.addLayer(marker);
      }
    }
    //console.log("Ais.ALL_POS_ARRAY.length", Ais.ALL_POS_ARRAY.length);
    for (let _pos_counter = 0; _pos_counter < Ais.ALL_POS_ARRAY.length; _pos_counter++)
    {
      const lat = Ais.ALL_POS_ARRAY[_pos_counter][1];
      const lon = Ais.ALL_POS_ARRAY[_pos_counter][0];
      const mmsi = Ais.ALL_MMSI_ARRAY[_pos_counter];
      const age = current_timestamp - parseInt(Ais.ALL_TIME_ARRAY[_pos_counter]);
      if (lat !== null && lon !== null )
      {
        let marker_2 = L.circleMarker([ lat, lon ], {opacity: 0.5, color: "#008000"}).addTo(map);
        marker_2.setRadius(4 - 4 * age/900);
        markersLayer.addLayer(marker_2);
        let html_string = '<div style="font-size:10px;line-height:100%;">' + (age/60).toString().substring(0,3)  + ' min. ago' + '<br>' + 'ID: ' + mmsi.toString() + '<br>' + 'Lat: ' + lat.toString() + '<br>' + 'Lon: ' + lon.toString() + '</div>';
        if (!is_touch_device) marker_2.bindTooltip(html_string);
        else marker_2.bindPopup(html_string, {closeOnClick: false, autoClose: false});
      }
    }
  }, 2000
);


const static_url = 'http://labremote.net/client/get_static_records_string.php?web_api_table_label=host' ; //'http://labremote.net/client/get_static_records.php?web_api_table=host&web_api_column=host_description' ;
const position_url = 'http://labremote.net/client/get_ais_data_records.php';

//let firstTime = true;

async function getISS() 
{
  const response = await fetch(static_url);
  let data = "";
  try
  {
    data = await response.json();
    //console.log("data", data);
  }
  catch(e)
  {
  }
  const data_array = Help.decodeTransferString(data);
  let data_string_array = [];
  if (data_array[2].length > 0) data_string_array = data_array[2][0];
  let timestamp_array = [];
  if (data_array[0].length > 0) timestamp_array = data_array[0][0];
  for (let _ais_string_counter = 0; _ais_string_counter < data_string_array.length; _ais_string_counter++)
  {

    const time = parseInt(timestamp_array[_ais_string_counter]);

    let ais_string = data_string_array[_ais_string_counter]
    if (ais_string.length > 0)
    {
      const regex_comma = /\|/g;
      const regex_semicolon = /\~/g;
      const ais_json_string = ais_string.replace(regex_semicolon, ";").replace(regex_comma, ",");

	  //try 
	  //{
        const ais_json = Help.json_safe_parse(ais_json_string); //[0];
        //console.log("ais_json", ais_json);
        const lon = Help.safe_get(ais_json, "lon");
        const lat = Help.safe_get(ais_json, "lat");
        const wdir = Help.safe_get(ais_json, "wdir");
        const wspeed = Help.safe_get(ais_json, "wspeed");
        const speed = Help.safe_get(ais_json, "speed");
        const course = Help.safe_get(ais_json, "course");
        const id = Help.safe_get(ais_json, "host_hardware_id");

        const mmsi_index = Ais.MMSI_ARRAY.indexOf(id);

        if (mmsi_index === -1)
        {
          Ais.MMSI_ARRAY.push( id ) ;
          Ais.POS_ARRAY.push( [ lon, lat ] ) ;
          Ais.WIND_DIR_ARRAY.push( wdir );
          Ais.WIND_SPEED_ARRAY.push( wspeed );
          Ais.SPEED_ARRAY.push( speed );
          Ais.COURSE_ARRAY.push( course );
          Ais.TEXT_ARRAY.push( ais_json_string );
          Ais.TIME_ARRAY.push( time ) ;
        }
        else
        {
          if (lon !== null && lat !== null) Ais.POS_ARRAY[mmsi_index] = [ lon, lat ] ;
          if (wdir !== null) Ais.WIND_DIR_ARRAY[mmsi_index] = wdir;
          if (wspeed !== null) Ais.WIND_SPEED_ARRAY[mmsi_index] = wspeed;
          if (speed !== null) Ais.SPEED_ARRAY[mmsi_index] = speed;
          if (course !== null) Ais.COURSE_ARRAY[mmsi_index] = course;
          Ais.TEXT_ARRAY[mmsi_index] = ais_json_string;
          Ais.TIME_ARRAY[mmsi_index] = time;
        }
      //}
      //catch(e)
      //{
      //}
    }
  }

  const position_response = await fetch(position_url);
  let position_data = "";
  try
  {
    position_data = await position_response.json();
  }
  catch(e)
  {
  }
  //console.log("position_data", position_data);
  const position_data_array = Help.decodeTransferString(position_data);
  let position_data_string_array = [];
  if (position_data_array[2].length > 0) position_data_string_array = position_data_array[2][0];
  let position_timestamp_array = [];
  if (position_data_array[0].length > 0) position_timestamp_array = position_data_array[0][0];

  Ais.ALL_POS_ARRAY = [];
  Ais.ALL_TIME_ARRAY = [];
  Ais.ALL_MMSI_ARRAY = [];
  let current_timestamp = parseInt((new Date().valueOf()) / 1000);
  for (let _position_string_counter = 0; _position_string_counter < position_data_string_array.length; _position_string_counter++)
  {
    let position_string = position_data_string_array[_position_string_counter]
    if (position_string.length > 0)
    {
      const regex_comma = /\|/g;
      const regex_semicolon = /\~/g;
      const position_json_string = position_string.replace(regex_semicolon, ";").replace(regex_comma, ",");
	  //try 
	  //{
        const position_json = Help.json_safe_parse(position_json_string); //[0];
        const type = Help.safe_get(position_json, "type");
        if ( [1,2,3,18,9].includes(parseInt(type)) ) 
        {
          //console.log("position_json_string", position_json_string);  
          Ais.ALL_POS_ARRAY.push( [ Help.safe_get(position_json, "lon"), Help.safe_get(position_json, "lat") ] ) ;
          Ais.ALL_MMSI_ARRAY.push( Help.safe_get(position_json, "mmsi") );
        }
        //else
        //{
        //Ais.ALL_POS_ARRAY.push( [ null, null ] ) ;
        //Ais.ALL_MMSI_ARRAY.push( null );
        //}
        const position_time = parseInt(position_timestamp_array[_position_string_counter]);
        Ais.ALL_TIME_ARRAY.push( position_time ) ;
      //}
      //catch(e)
      //{
      //}
    }
  }


  //const { latitude, longitude } = data;
  //marker.setLatLng([latitude, longitude]);
  //if (firstTime) 
  //{
  //  mymap.setView([latitude, longitude], 2);
  //  firstTime = false;
  //}
  //document.getElementById('lat').textContent = latitude.toFixed(2);
  //document.getElementById('lon').textContent = longitude.toFixed(2);
}

getISS();

setInterval(getISS, 5000);
