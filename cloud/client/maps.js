'use strict';


//const uuid = uuidv4();
//console.log("uuid", uuid);

const width  = window.innerWidth || document.documentElement.clientWidth || 
document.body.clientWidth;
const height = window.innerHeight|| document.documentElement.clientHeight|| 
document.body.clientHeight;
//console.log(width, height);

let geolocation_available = false;
if('geolocation' in navigator) 
{
  geolocation_available = true;
} 
else 
{
  /* geolocation IS NOT available */
}

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

const own_location_mobile_icon = new CustomIcon({iconUrl: 'icons/leaflet/own_ship_symbol.png', iconSize: [20,32],iconAnchor: [10,16]});
const own_location_stationary_icon = new CustomIcon({iconUrl: 'icons/leaflet/own_ship_stationary_symbol.png', iconSize: [16,16], iconAnchor: [8,8]}); //000_kt.png', iconSize: [45,81],iconAnchor: [22.5,72]});
const sea_mobile_icon = new CustomIcon({iconUrl: 'icons/leaflet/ship_symbol.png', iconSize: [16,24],iconAnchor: [8,12]});
const sea_stationary_icon = new CustomIcon({iconUrl: 'icons/leaflet/ship_stationary_symbol.png', iconSize: [12,12], iconAnchor: [6,6]});
const shore_stationary_icon = new CustomIcon({iconUrl: 'icons/leaflet/building_symbol.png', iconSize: [16,18], iconAnchor: [8,11]});
const aton_special_mark_virtual_icon = new CustomIcon({iconUrl: 'icons/leaflet/ais_aton_special_mark_virtual.png', iconSize: [24,32], iconAnchor: [12,24]});
const shore_mobile_icon = new CustomIcon({iconUrl: 'icons/leaflet/land_vehicle_symbol.png'});
const danger_icon = new CustomIcon({iconUrl: 'icons/leaflet/danger_over_symbol.png', iconSize: [24,24], iconAnchor: [12,12]});
const shore_01_symbol = new CustomIcon({iconUrl: 'icons/leaflet/shore_01_symbol.png', iconSize: [32,32], iconAnchor: [16,16]});
const shore_02_symbol = new CustomIcon({iconUrl: 'icons/leaflet/shore_02_symbol.png', iconSize: [40,30], iconAnchor: [20,15]});

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
const center = [62.827, 17.875]; //[62.664450, 18.286383];

//const shore = [62.8315, 17.8705];
//const sea_mobile = [62.827, 17.90];
//const land_mobile = [62.832, 17.88];
//const buoy_1 = [62.8219465526254, 17.878395190126632];
//const buoy_2 = [62.830045904677235, 17.88962710650322];
//const virtual_1 = [62.82410637983922, 17.883320754338765];
//const virtual_2 = [62.8271661350588, 17.887655981226686];

// Create the map
let map = L.map( 'map', {attributionControl: false} ).setView(center, 14);
// Set up the OSM layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
L.control.scale().addTo(map);
let markersLayer = new L.LayerGroup();// add a marker in the given location
markersLayer.addTo(map);

const static_url = 'https://' + window.location.hostname + '/client/get_static_records_string.php?web_api_table_label=host' ; //'http://labremote.net/client/get_static_records.php?web_api_table=host&web_api_column=host_description' ;
const position_url = 'https://' + window.location.hostname + '/client/get_ais_data_records.php';
const own_position_url = 'https://' + window.location.hostname + '/client/get_own_pos_records.php';

let own_location_marker = null;
let own_accuracy_circle = null;
if (geolocation_available)
{
  const geolocation_options = { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 };
  const watchID = navigator.geolocation.watchPosition(handle_geolocation_success, handle_geolocation_error, geolocation_options);
  own_location_marker = L.marker(center, {icon: own_location_stationary_icon});
  own_location_marker.addTo(map);
  own_accuracy_circle = L.circle(center, {color: 'steelblue', radius: 0, fillColor: 'steelblue', opacity: 0.2});
  own_accuracy_circle.addTo(map);
}

const is_touch_device = Help.isTouchDevice();

const danger_pos_01 = [62.664450, 18.286383];
let danger_marker_01 = L.marker(danger_pos_01, {icon: danger_icon});
danger_marker_01.addTo(map);
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
else danger_marker_01.bindPopup(danger_html_string, {closeOnClick: true, autoClose: false});

const shore_pos_01 = [62.83, 17.864]; //[62.664450, 18.286383];
let shore_marker_01 = L.marker(shore_pos_01, {icon: shore_01_symbol});
shore_marker_01.addTo(map);
shore_marker_01.setOpacity( 1.0 );
shore_marker_01.setRotationOrigin("center");
shore_marker_01.setRotationAngle(0);
let shore_01_html_string = '<div style="font-size:10px;line-height:100%;">';
shore_01_html_string += 'Västby Hamnförening<br>Web site: <a href="https://www.vastbyhamn.com">https://www.vastbyhamn.com</a><br>Position:' + '<br>' ;
shore_01_html_string += 'Lat: ' + shore_pos_01[0].toString() + ' deg.' + '<br>' ;
shore_01_html_string += 'Lon: ' + shore_pos_01[1].toString() + ' deg.' ;  //Disp.jsonToTable(content_json, {}); 
const shore_01_image_url = 'images/leaflet/' + 'shore_01_image.png' ;
shore_01_html_string += '<br><br>' + '<img src="' + shore_01_image_url + '"/>';
if (!is_touch_device) shore_marker_01.bindTooltip(shore_01_html_string);
else shore_marker_01.bindPopup(shore_01_html_string, {closeOnClick: true, autoClose: false});

const shore_pos_02 = [62.832, 17.874]; //[62.664450, 18.286383];
let shore_marker_02 = L.marker(shore_pos_02, {icon: shore_02_symbol});
shore_marker_02.addTo(map);
shore_marker_02.setOpacity( 1.0 );
shore_marker_02.setRotationOrigin("center");
shore_marker_02.setRotationAngle(0);
let shore_02_html_string = '<div style="font-size:10px;line-height:100%;">';
shore_02_html_string += 'Höga Kusten Varvet<br>Web site: <a href="https://www.hagakustenvarvet.se">https://www.hagakustenvarvet.se</a><br>Position:' + '<br>' ;
shore_02_html_string += 'Lat: ' + shore_pos_02[0].toString() + ' deg.' + '<br>' ;
shore_02_html_string += 'Lon: ' + shore_pos_02[1].toString() + ' deg.' ;  //Disp.jsonToTable(content_json, {}); 
const shore_02_image_url = 'images/leaflet/' + 'shore_02_image.png' ;
shore_02_html_string += '<br><br>' + '<img src="' + shore_02_image_url + '"/>';
if (!is_touch_device) shore_marker_02.bindTooltip(shore_02_html_string);
else shore_marker_02.bindPopup(shore_02_html_string, {closeOnClick: true, autoClose: false});

setInterval(refresh_data, 5000);
setInterval(refresh_display, 2000);


let share_div = document.createElement("DIV");
document.body.appendChild(share_div);
//Help.set_properties( share_div.style, { "position": "relative" } );
let share_button = document.createElement("BUTTON");
share_div.appendChild(share_button);
share_button.id = "share_button";
Help.set_properties( share_button.style, { "position": "absolute", "width": "280px", "top": "10px", "right": "5px", "padding": "10px", "z-index": "400" , "color": Help.rgba_literal_from_array([0,0,0,255]), "backgroundColor": Help.rgba_literal_from_array([127,127,127,63]) } ) ;
share_button.addEventListener("click", create_id_input);
let share_button_text = document.createTextNode("Share position with Test Site Bothnia");
share_button.appendChild(share_button_text);
let cookie_value = Help.get_cookie("mariex_user_id");
Ais.OWN_USER_ID = cookie_value;

if (Ais.OWN_POSITION_AVAILABLE && cookie_value !== null) 
{
  share_button.innerText = "Identified as " + Ais.OWN_USER_ID;
  Help.set_properties( share_button.style, { "color": Help.rgba_literal_from_array([127,127,0,255]), "backgroundColor": Help.rgba_literal_from_array([127,127,0,63]) } ) ;
}
else if (Ais.OWN_LOCATION_POS.length === 2) 
{
  share_button.innerText = "Sharing position anonymously" ;
  Help.set_properties( share_button.style, { "color": Help.rgba_literal_from_array([0,0,0,255]), "backgroundColor": Help.rgba_literal_from_array([127,127,127,63]) } );
}
let camera_div = document.createElement("DIV");
document.body.appendChild(camera_div);
let camera_button = document.createElement("BUTTON");
camera_div.appendChild(camera_button);
camera_button.id = "camera_button";
Help.set_properties( camera_button.style, { "position": "absolute", "width": "280px", "top": "60px", "right": "5px", "padding": "10px", "z-index": "400" , "color": Help.rgba_literal_from_array([0,0,0,255]), "backgroundColor": Help.rgba_literal_from_array([127,127,127,63]) } ) ;
camera_button.addEventListener("click", create_image_input);
let camera_button_text = document.createTextNode("Share observation with Test Site Bothnia");
camera_button.appendChild(camera_button_text);

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


function open_guab_website()
{
  window.open('https://gustavsvik.eu')
}


function open_tsb_website()
{
  window.open('https://testsitebothnia.eu')
}


function create_id_input()
{
  let id_dialog = document.createElement("DIALOG");
  document.body.appendChild(id_dialog);
  dialogPolyfill.registerDialog(id_dialog);
  let dialog_div = document.createElement("DIV");
  id_dialog.appendChild(dialog_div);

  let description_div = document.createElement("DIV");
  Help.set_properties( description_div.style, {"position": "relative"} );
  description_div.innerHTML = '<br>Please enter a specific user ID (up to 10 characters will be displayed):'; //'<br>Welcome to the MarIEx position reporting tool of Test Site Bothnia! We try to take all precautions possible to keep our test sites safe and secure, and your help is greatly appreciated. By adding a user ID to identify your position marker on the chart (either an arbitrary one of your choice or your name, ship name, call sign, MMSI, or other presumably unique identifier) when present in or near one of our test areas, you can improve your visibility not only to our test management team but to your fellow sea and land travellers as well. Please note that only the first 10 characters of your ID will be shown on screen.';
  dialog_div.appendChild(description_div);

  let id_input = document.createElement("INPUT");
  let id_info_button = document.createElement("BUTTON");
  let id_div = document.createElement("DIV");
  Help.set_properties( id_div.style, {"position": "relative", "top": "10px", "width": "100%"} );
  id_div.appendChild(id_input);
  Help.set_properties( id_input.style, {} );
  let cookie_value = Help.get_cookie("mariex_user_id");
  if (cookie_value !== null) Ais.OWN_USER_ID = cookie_value;
  if (Ais.OWN_USER_ID === null) Help.set_properties( id_input, {"placeholder": "My user ID"} );
  else Help.set_properties( id_input, {"value": Ais.OWN_USER_ID} );
  id_div.appendChild(id_info_button);
  Help.set_properties( id_info_button.style, {"height": "30px", "width": "30px", "border-radius": "50%", "border": "1px solid #000", "margin-left": "20px", "padding": "0px"} );
  id_info_button.addEventListener("click", id_info);
  let id_info_button_text = document.createTextNode("i");
  id_info_button.appendChild(id_info_button_text);
  dialog_div.appendChild(id_div);

  let submit_button = document.createElement("BUTTON");
  let cancel_button = document.createElement("BUTTON");
  let store_cookie_check = document.createElement("INPUT");
  let store_cookie_label = document.createElement('LABEL');
  let cookie_info_button = document.createElement("BUTTON");
  let id_button_div = document.createElement("DIV");
  Help.set_properties( id_button_div.style, {"position": "relative", "top": "30px"} );
  id_button_div.appendChild(submit_button);
  Help.set_properties( submit_button.style, {"padding": "10px"} );
  id_button_div.appendChild(cancel_button);
  Help.set_properties( cancel_button.style, {"padding": "10px", "margin-left": "10px"} );
  id_button_div.appendChild(store_cookie_check);
  Help.set_properties( store_cookie_check, {"id": "store_cookie_check", "type": "checkbox", "checked": "true"} );
  Help.set_properties( store_cookie_check.style, {"padding": "10px", "margin-left": "15px"} );
  id_button_div.appendChild(store_cookie_label);
  Help.set_properties( store_cookie_label, {"htmlFor": "store_cookie_check", "innerText": "Set cookie"} );
  Help.set_properties( store_cookie_label.style, {"margin-left": "5px"} );
  id_button_div.appendChild(cookie_info_button);
  Help.set_properties( cookie_info_button.style, {"height": "30px", "width": "30px", "border-radius": "50%", "border": "1px solid #000", "margin-left": "5px", "padding": "0px", "position": "absolute", "top": "50%", "-ms-transform": "translateY(-50%)", "transform": "translateY(-50%)"} );
  submit_button.addEventListener("click", submit_data);
  cancel_button.addEventListener("click", cancel);
  cookie_info_button.addEventListener("click", cookie_info);
  let submit_button_text = document.createTextNode("Submit");
  submit_button.appendChild(submit_button_text);
  let cancel_button_text = document.createTextNode("Cancel");
  cancel_button.appendChild(cancel_button_text);
  let cookie_info_button_text = document.createTextNode("i");
  cookie_info_button.appendChild(cookie_info_button_text);
  dialog_div.appendChild(id_button_div);

  Help.set_properties( dialog_div.style, {"position": "relative", "top": "-25px"} ); //"overflow-y": "auto", 

  id_dialog.showModal();

  window.scrollTo(0, 0);

  function submit_data()
  {
    Ais.OWN_USER_ID = id_input.value ;
    if ( Ais.OWN_POSITION_AVAILABLE && ( !store_cookie_check.checked || Ais.OWN_USER_ID === null || Ais.OWN_USER_ID === "" ) )
    {
      Help.set_cookie("mariex_user_id", null, null);
      share_button.innerText = "Sharing position anonymously";
      Help.set_properties( share_button.style, { "color": Help.rgba_literal_from_array([0,0,0,255]), "backgroundColor": Help.rgba_literal_from_array([127,127,127,63]) } );
    }
    //else if (Ais.OWN_USER_ID === "99999") share_button.innerText = "Sharing position anonymously";
    if ( Ais.OWN_POSITION_AVAILABLE && !store_cookie_check.checked && Ais.OWN_USER_ID !== null && Ais.OWN_USER_ID !== "" ) 
    {
      share_button.innerText = "Identified as " + Ais.OWN_USER_ID;
      Help.set_properties( share_button.style, { "color": Help.rgba_literal_from_array([127,127,0,255]), "backgroundColor": Help.rgba_literal_from_array([127,127,0,63]) } ) ;
    }
    if (store_cookie_check.checked && Ais.OWN_USER_ID !== null && Ais.OWN_USER_ID !== "") 
    {
      Help.set_cookie("mariex_user_id", id_input.value, 1000);
      if (Ais.OWN_POSITION_AVAILABLE) 
      {
        share_button.innerText = "Device recognized as " + Ais.OWN_USER_ID;
        Help.set_properties( share_button.style, { "color": Help.rgba_literal_from_array([0,127,0,255]), "backgroundColor": Help.rgba_literal_from_array([0,127,0,63]) } ) ;
      }
    }

    id_dialog.close();

    //async function
    //const user_id_exists_response = await fetch( 'https://labremote.net/client/user_id_exists.php', { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: new URLSearchParams({'module_address': Ais.OWN_USER_ID}) } );
    //let new_channel_data = null;
    //try
    //{
    //  new_channel_data = await user_id_exists_response.json();
    //  Ais.OWN_DATA_CHANNEL = new_channel_data["new_channel_index"];
    //}
    //catch(e)
    //{
    //}

  }

  function cancel()
  {
    id_dialog.close();
  }

  function id_info()
  {
    window.alert('Welcome to the MarIEx position reporting tool of Test Site Bothnia! We try to take all precautions possible to keep our test sites safe and secure, and your help is greatly appreciated. By adding a user ID to identify your position marker on the chart (either an arbitrary one of your choice or your name, ship name, call sign, MMSI, or other presumably unique identifier) when present in or near one of our test areas, you can improve your visibility not only to our test management team but to your fellow seafarers and land travellers as well. Please consider when choosing your ID that it will be sent back (securely) to Test Site Bothnia and stored (securely) in our database before being publicly shared in this application, and take note that your ID may be shortened to its first 10 characters when displayed.')
  }

  function cookie_info()
  {
    window.alert('To be able to link your device to your position unambiguously for the benefit of the Test Site Bothnia team and your fellow seafarers and land travellers, you can permit the MarIEx app to set a single cookie containing your user ID only (which is non-shareable with other sites). If you uncheck the box no new cookie will be set on the device and any cookies previously set by MarIEx will be removed.')
  }

}


function create_image_input()
{
  let image_dialog = document.createElement("DIALOG");
  document.body.appendChild(image_dialog);
  dialogPolyfill.registerDialog(image_dialog);
  let dialog_div = document.createElement("DIV");
  image_dialog.appendChild(dialog_div);

  let description_div = document.createElement("DIV");
  Help.set_properties( description_div.style, {"position": "relative"} );
  description_div.innerHTML = '<br>Use the text field below to describe (anonymously if you prefer) your finds and/or hit the button to attach related media files:' //'<br>Welcome to the MarIEx environmental reporting tool of Test Site Bothnia! We try to take all precautions possible to keep our test sites safe and secure, and your help is greatly appreciated. Here you can report occurrences in or near test site areas of e g:<ul><li>Severe winds, waves, thunderstorms, precipitation, flooding, ice formation and other sudden weather changes for the worse and potentially hazardous natural phenomena</li><li>Divers, swimmers, water skiers, jet ski riders, kayakers and other unprotected personnel</li><li>Seals and other vulnerable aquatic mammals or other kinds of species</li><li>Algae blooms or infestations of jellyfish or other invasive or harmful species</li><li>Natural objects (e g logs) or man-made equipment (e g buoys or vehicles) adrift, stranded or abandoned</li><li>Refuse, oil spills or other kinds of man-made pollution</li><li>Containers of harmful substances or other hazardous items like mines or other kinds of unexploded munitions</li><li>Other harmful activity in progress, such as pollution, vandalism, theft or reckless or unsafe behaviour</li><li>Unidentifiable or evasive vessels (e g submarines) or other suspicious equipment or personnel (e g divers)</li></ul>Use the text field below to describe (anonymously if you prefer) your finds and/or hit the button to attach related media files:';
  dialog_div.appendChild(description_div);

  let attach_button = document.createElement("BUTTON");
  let share_info_button = document.createElement("BUTTON");
  let attach_button_div = document.createElement("DIV");
  Help.set_properties( attach_button_div.style, {"position": "relative", "top": "10px"} );
  attach_button_div.appendChild(attach_button);
  Help.set_properties( attach_button.style, {"padding": "10px"} );
  attach_button_div.appendChild(share_info_button);
  Help.set_properties( share_info_button.style, {"height": "30px", "width": "30px", "border-radius": "50%", "border": "1px solid #000", "margin-left": "20px", "padding": "0px"} );
  attach_button.addEventListener("click", get_image);
  share_info_button.addEventListener("click", share_info);
  let attach_button_text = document.createTextNode("Attach image or file");
  attach_button.appendChild(attach_button_text);
  let share_info_button_text = document.createTextNode("i");
  share_info_button.appendChild(share_info_button_text);
  dialog_div.appendChild(attach_button_div);

  let image_textarea = document.createElement("TEXTAREA");
  let textarea_div = document.createElement("DIV");
  Help.set_properties( textarea_div.style, {"position": "relative", "top": "10px"} );
  textarea_div.appendChild(image_textarea);
  Help.set_properties( image_textarea, {"rows": "10"} ); //, "cols": "35"
  Help.set_properties( image_textarea.style, {fieldStyle: {"font-size": "10pt"}, "position": "relative", "top": "10px", "width": "100%"} );
  let default_text = 'My contact information (email or phone, not required): ';
  if (Ais.OWN_LOCATION_POS.length === 2) default_text += '\r\n' + 'My current location: ' + Ais.OWN_LOCATION_POS[0].toString().substring(0,8) + ',' + Ais.OWN_LOCATION_POS[1].toString().substring(0,8);
  default_text += '\r\n\r\n' + 'My observation: ' + '\r\n';
  image_textarea.value = default_text;
  dialog_div.appendChild(textarea_div);

  let submit_button = document.createElement("BUTTON");
  let cancel_button = document.createElement("BUTTON");
  let share_button_div = document.createElement("DIV");
  Help.set_properties( share_button_div.style, {"position": "relative", "top": "30px"} );
  share_button_div.appendChild(submit_button);
  Help.set_properties( submit_button.style, {"padding": "10px"} );
  share_button_div.appendChild(cancel_button);
  Help.set_properties( cancel_button.style, {"padding": "10px", "margin-left": "10px"} );
  submit_button.addEventListener("click", submit_data);
  cancel_button.addEventListener("click", cancel);
  let submit_button_text = document.createTextNode("Submit");
  submit_button.appendChild(submit_button_text);
  let cancel_button_text = document.createTextNode("Cancel");
  cancel_button.appendChild(cancel_button_text);
  dialog_div.appendChild(share_button_div);

  Help.set_properties( dialog_div.style, {"position": "relative", "top": "-25px"} ); //"overflow-y": "auto", 

  image_dialog.showModal();

  window.scrollTo(0, 0);

  function share_info()
  {
    window.alert('Welcome to the MarIEx environmental reporting tool of Test Site Bothnia! We try to take all precautions possible to keep our test sites safe and secure, and your help is greatly appreciated. Here you can report occurrences in or near test site areas of e g:\n\n- Severe winds, waves, thunderstorms, precipitation, flooding, ice formation and other sudden weather changes for the worse and potentially hazardous natural phenomena\n- Divers, swimmers, water skiers, jet ski riders, kayakers and other unprotected personnel\n- Seals and other vulnerable aquatic mammals or other kinds of species\n- Algae blooms or infestations of jellyfish or other invasive or harmful species\n- Natural objects (e g logs) or man-made equipment (e g buoys or vehicles) adrift, stranded or abandoned\n- Refuse, oil spills or other kinds of man-made pollution\n- Containers of harmful substances or other hazardous items like mines or other kinds of unexploded munitions\n- Other harmful activity in progress, such as pollution, vandalism, theft or reckless or unsafe behaviour\n- Unidentifiable or evasive vessels (e g submarines) or other suspicious equipment or personnel (e g divers)')
  }

  function submit_data()
  {
    image_dialog.close();
  }

  function cancel()
  {
    image_dialog.close();
  }

}


function get_image()
{
  let image_div = document.createElement("DIV");
  document.body.appendChild(image_div);
  let image_input = document.createElement("INPUT");
  image_input.addEventListener("change", get_image_file);
  image_div.appendChild(image_input);

  Help.set_properties( image_input, {"id": "image_input", "type": "file", "accept": "image/*", "style": "display:none"} );   //"capture": "user" //force camera input only

  image_input.click();

  function get_image_file(event)
  {
    const image = document.createElement("IMG"); 
    const image_file = event.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', image_reader)
    reader.readAsDataURL(image_file);

    function image_reader(event)
    {
      const own_data_image_bytes = event.target.result.split(',')[1];
      Ais.OWN_DATA_IMAGE_BYTES = own_data_image_bytes;
    }
  }
}

/*
let image_div = document.createElement("DIV");
document.body.appendChild(image_div);
if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) 
{
const video = document.createElement('video');
video.muted = true;
video.autoplay = true;
video.loop = true;
video.setAttribute('playsinline', true);
//const source = document.createElement('source');
//source.setAttribute('src', 'https://res.cloudinary.com/dthskrjhy/video/upload/v1545324364/ASR/Typenex_Dandelion_Break_-_Fade_To_Black.mp4');
//video.appendChild(source);
//Help.set_properties( video.style, { "position": "absolute", "bottom": "0px", "right": "100px", "padding": "10px", "z-index": "400" } );
image_div.appendChild(video);
camera_button.addEventListener('click', event => {
  const constraints = {
    video: true,
    audio: false
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(error => {
      console.error(error);
    });
});
}
*/


function handle_geolocation_success(position) 
{
  //console.log("position", position)
  const own_coords = position.coords;

  Ais.OWN_POSITION_AVAILABLE = true;
  share_button.innerText = "Sharing position anonymously";
  Help.set_properties( share_button.style, { "color": Help.rgba_literal_from_array([0,0,0,255]), "backgroundColor": Help.rgba_literal_from_array([127,127,127,63]) } );
  cookie_value = Help.get_cookie("mariex_user_id");
  if (cookie_value !== null && Ais.OWN_USER_ID !== "" && Ais.OWN_USER_ID !== null) 
  {
    Ais.OWN_USER_ID = cookie_value;
    share_button.innerText = "Device recognized as " + Ais.OWN_USER_ID;
    Help.set_properties( share_button.style, { "color": Help.rgba_literal_from_array([0,127,0,255]), "backgroundColor": Help.rgba_literal_from_array([0,127,0,63]) } ) ;
  }
  if (cookie_value === null && Ais.OWN_USER_ID !== "" && Ais.OWN_USER_ID !== null) 
  {
    share_button.innerText = "Identified as " + Ais.OWN_USER_ID;
    Help.set_properties( share_button.style, { "color": Help.rgba_literal_from_array([127,127,0,255]), "backgroundColor": Help.rgba_literal_from_array([127,127,0,63]) } ) ;
  }

  Ais.OWN_LOCATION_COORDS = { "lat": own_coords.latitude, "lon": own_coords.longitude, "accuracy": own_coords.accuracy, "alt": own_coords.altitude, "alt_accuracy": own_coords.altitudeAccuracy, "speed": own_coords.speed, "heading": own_coords.heading };
  Ais.OWN_LOCATION_POS[0] = own_coords.latitude;
  Ais.OWN_LOCATION_POS[1] = own_coords.longitude;
  Ais.OWN_LOCATION_ACCURACY = own_coords.accuracy;
  Ais.OWN_LOCATION_ALTITUDE = own_coords.altitude;
  Ais.OWN_LOCATION_ALTITUDE_ACCURACY = own_coords.altitudeAccuracy;
  Ais.OWN_LOCATION_SPEED = own_coords.speed;
  Ais.OWN_LOCATION_HEADING = own_coords.heading;
  //console.log("Ais.OWN_LOCATION_ACCURACY", Ais.OWN_LOCATION_ACCURACY);
}


function handle_geolocation_error() 
{
  Ais.OWN_POSITION_AVAILABLE = false;
}


function refresh_display() 
{

  markersLayer.clearLayers();

  let current_timestamp = parseInt((new Date().valueOf()) / 1000);

  if (Ais.OWN_LOCATION_POS.length === 2)
  {
    own_location_marker.setIcon(own_location_stationary_icon);
    own_location_marker.setLatLng(Ais.OWN_LOCATION_POS);
    let own_location_html_string = '<div style="font-size:10px;line-height:100%;">';
    if (Ais.OWN_USER_ID !== null && Ais.OWN_USER_ID !== "") own_location_html_string += 'User ID: ' + Ais.OWN_USER_ID + '<br>' ;
    //console.log('Help.get_cookie("mariex_user_id")', Help.get_cookie("mariex_user_id"))
    own_location_html_string += 'Lat: ' + Ais.OWN_LOCATION_POS[0].toString().substring(0,8) + ' deg.' + '<br>' ;
    own_location_html_string += 'Lon: ' + Ais.OWN_LOCATION_POS[1].toString().substring(0,8) + ' deg.' + '<br>' ;
    if (Ais.OWN_LOCATION_ACCURACY !== null)
    {
      own_location_html_string += 'Accuracy: ' + Ais.OWN_LOCATION_ACCURACY.toString().substring(0,6) + ' m' ;
      own_accuracy_circle.setLatLng(Ais.OWN_LOCATION_POS);
      own_accuracy_circle.setRadius(parseInt(Ais.OWN_LOCATION_ACCURACY));
    }
    if (Ais.OWN_LOCATION_ALTITUDE !== null) own_location_html_string += '<br>Altitude: ' + Ais.OWN_LOCATION_ALTITUDE.toString().substring(0,6) + ' m' ;
    if (Ais.OWN_LOCATION_ALTITUDE_ACCURACY !== null) own_location_html_string += '<br>Altitude: ' + Ais.OWN_LOCATION_ALTITUDE_ACCURACY.toString().substring(0,6) + ' m' ;
    if (Ais.OWN_LOCATION_SPEED !== null) 
    {
      own_location_html_string += '<br>Speed: ' + Ais.OWN_LOCATION_SPEED.toString().substring(0,6) + ' m/s' ;
      if (Ais.OWN_LOCATION_SPEED > 0) own_location_marker.setIcon(own_location_mobile_icon);
      if (Ais.OWN_LOCATION_HEADING !== null)
      {
        own_location_html_string += '<br>Heading: ' + Ais.OWN_LOCATION_HEADING.toString().substring(0,6) + ' deg.' ;
        own_location_marker.setRotationOrigin("center");
        own_location_marker.setRotationAngle(Ais.OWN_LOCATION_HEADING);
      }
    }
    if (!is_touch_device) own_location_marker.bindTooltip(own_location_html_string);
    else own_location_marker.bindPopup(own_location_html_string, {closeOnClick: true, autoClose: false});
  }

  //console.log("Ais.MMSI_ARRAY.length", Ais.MMSI_ARRAY.length);
  for (let _id_counter = 0; _id_counter < Ais.ID_ARRAY.length; _id_counter++)
  {
    const id = Ais.ID_ARRAY[_id_counter];
    const lat = Ais.POS_ARRAY[_id_counter][1];
    const lon = Ais.POS_ARRAY[_id_counter][0];
	const wspeed = Ais.WIND_SPEED_ARRAY[_id_counter];
	const wdir = Ais.WIND_DIR_ARRAY[_id_counter];
	const speed = Ais.SPEED_ARRAY[_id_counter];
	const course = Ais.COURSE_ARRAY[_id_counter];
    const content = Ais.TEXT_ARRAY[_id_counter];
    const age = current_timestamp - Ais.TIME_ARRAY[_id_counter];

    if (lat !== null && lon !== null)
    {
      let marker = L.marker([ lat, lon ], {icon: sea_stationary_icon});

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
        let type = Help.safe_get(content_json, "type");
        if ( type !== null) type = parseInt(type);

        let html_string = '<div style="font-size:10px;line-height:100%;">';
        html_string += (age/60).toString().substring(0,3) + ' min. ago' + '<br>';

        if (type === 8) 
        {
          marker.setIcon(wind_000_kt_icon);
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
          marker.setRotationOrigin("15px 48px");
          marker.setRotationAngle(wdir);
          html_string += 'Wind speed: ' + wspeed.toString().substring(0,3) + ' kt.' + '<br>';
          }
          if (wdir !== null) html_string += 'Wind direction: ' + wdir.toString().substring(0,3) + ' deg.' + '<br>';
          if (id !== null) html_string += 'ID: ' + id.toString();
        }
        else
        {
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
          if (id !== null) html_string += 'ID: ' + id.toString() + '<br>' ;
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
        if (!is_touch_device && image_filename !== null)
        {
          const image_url = 'images/leaflet/' + image_filename ;
          html_string += '<br><br>' + '<img src="' + image_url + '"/>';
        }

        if (!is_touch_device) marker.bindTooltip(html_string);
        else marker.bindPopup(html_string, {closeOnClick: true, autoClose: false}) ;

      }
      markersLayer.addLayer(marker);
    }
  }
  //console.log("Ais.ALL_POS_ARRAY.length", Ais.ALL_POS_ARRAY.length);
  for (let _pos_counter = 0; _pos_counter < Ais.ALL_POS_ARRAY.length; _pos_counter++)
  {
    const lat = Ais.ALL_POS_ARRAY[_pos_counter][1];
    const lon = Ais.ALL_POS_ARRAY[_pos_counter][0];
    const id = Ais.ALL_ID_ARRAY[_pos_counter];
    //console.log("mmsi", mmsi);
    const age = current_timestamp - parseInt(Ais.ALL_TIME_ARRAY[_pos_counter]);
    if (lat !== null && lon !== null )
    {
      let marker_2 = L.circleMarker([ lat, lon ], {opacity: 0.5, color: "#00c600"});
      if (id === "99999") marker_2 = L.circleMarker([ lat, lon ], {opacity: 0.5, color: "#ff0000"});
      marker_2.setRadius(4 - 4 * age/900);
      markersLayer.addLayer(marker_2);
      let html_string = '<div style="font-size:10px;line-height:100%;">' + (age/60).toString().substring(0,3)  + ' min. ago' + '<br>' + 'ID: ' + id.toString() + '<br>' + 'Lat: ' + lat.toString() + '<br>' + 'Lon: ' + lon.toString() + '</div>';
      if (!is_touch_device) marker_2.bindTooltip(html_string);
      else marker_2.bindPopup(html_string, {closeOnClick: true, autoClose: false});
    }
  }
}


//let firstTime = true;

async function refresh_data() 
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
      let ais_json_string = ais_string.replace(regex_semicolon, ";");
      ais_json_string = ais_json_string.replace(regex_comma, ",");
      //console.log("ais_json_string", ais_json_string);
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

        const id_index = Ais.ID_ARRAY.indexOf(id);

        if (id_index === -1)
        {
          Ais.ID_ARRAY.push( id ) ;
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
          if (lon !== null && lat !== null) Ais.POS_ARRAY[id_index] = [ lon, lat ] ;
          if (wdir !== null) Ais.WIND_DIR_ARRAY[id_index] = wdir;
          if (wspeed !== null) Ais.WIND_SPEED_ARRAY[id_index] = wspeed;
          if (speed !== null) Ais.SPEED_ARRAY[id_index] = speed;
          if (course !== null) Ais.COURSE_ARRAY[id_index] = course;
          Ais.TEXT_ARRAY[id_index] = ais_json_string;
          Ais.TIME_ARRAY[id_index] = time;
        }
      //}
      //catch(e)
      //{
      //}
    }
  }

  let position_string_array = []

  const position_response = await fetch(position_url, { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: new URLSearchParams({'channels': '148;'}) });
  let position_data = null;
  try
  {
    position_data = await position_response.json();
  }
  catch(e)
  {
  }
  position_string_array[0] = position_data

  const own_position_response = await fetch( own_position_url, { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: new URLSearchParams({'channels': '99999;'}) } );
  let own_position_data = null;
  try
  {
    own_position_data = await own_position_response.json();
  }
  catch(e)
  {
  }
  position_string_array[1] = own_position_data

  let current_timestamp = parseInt((new Date().valueOf()) / 1000);
  Ais.ALL_POS_ARRAY = [];
  Ais.ALL_TIME_ARRAY = [];
  Ais.ALL_ID_ARRAY = [];

  for (let _position_data_counter = 0; _position_data_counter < position_string_array.length; _position_data_counter++)
  {
    const position_data_array = Help.decodeTransferString(position_string_array[_position_data_counter]);
    let position_data_string_array = [];
    if (position_data_array[2].length > 0) position_data_string_array = position_data_array[2][0];
    let position_timestamp_array = [];
    if (position_data_array[0].length > 0) position_timestamp_array = position_data_array[0][0];

    for (let _position_string_counter = 0; _position_string_counter < position_data_string_array.length; _position_string_counter++)
    {
      let position_string = position_data_string_array[_position_string_counter];

      if (position_string.length > 0)
      {
      const regex_comma = /\|/g;
      const regex_semicolon = /\~/g;
      const position_json_string = position_string.replace(regex_semicolon, ";").replace(regex_comma, ",");

      const position_json = Help.json_safe_parse(position_json_string); //[0];
      if (position_json !== null)
      {
        for (let _position_json_counter = 0; _position_json_counter < position_json.length; _position_json_counter++)
        {
          const type = Help.safe_get(position_json[_position_json_counter], "type");
          if ( [1,2,3,18,9].includes(parseInt(type)) ) 
          {
            Ais.ALL_POS_ARRAY.push( [ Help.safe_get(position_json[_position_json_counter], "lon"), Help.safe_get(position_json[_position_json_counter], "lat") ] ) ;
            Ais.ALL_ID_ARRAY.push( Help.safe_get(position_json[_position_json_counter], "mmsi") );
          }
          const position_time = parseInt(position_timestamp_array[_position_string_counter]);
          Ais.ALL_TIME_ARRAY.push( position_time ) ;
        }
      }
    }
  }
  }

  let own_position_json_string = JSON.stringify(Ais.OWN_LOCATION_COORDS);

  const regex_pipe = new RegExp(',', 'g');
  const regex_tilde = new RegExp(';', 'g');

  let user_id = null;
  if (Ais.OWN_POSITION_AVAILABLE && Ais.OWN_USER_ID !== null && Ais.OWN_USER_ID !== "") user_id = Ais.OWN_USER_ID;
  //console.log('Help.get_cookie("mariex_user_id")', Help.get_cookie("mariex_user_id"))
  if (user_id !== null || Ais.OWN_LOCATION_POS.length === 2)
  {
    if (user_id === null) user_id = "99999";
    own_position_json_string = '[[null, null, ' + '"' + user_id + '"' + ', ' + own_position_json_string + ']]' ;

    const new_channel_response = await fetch( 'https://' + window.location.hostname + '/client/update_static_data_client.php', { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: new URLSearchParams({'common_description': own_position_json_string, 'module_address': Ais.OWN_USER_ID}) } );
    //body: "common_description=" + encodeURIComponent(own_position_json_string) } );
    let new_channel_data = null;
    try
    {
      new_channel_data = await new_channel_response.json();
      Ais.OWN_DATA_CHANNEL = new_channel_data["new_channel_index"];
      //console.log("Ais.OWN_DATA_CHANNEL", Ais.OWN_DATA_CHANNEL);
    }
    catch(e)
    {
    }

    own_position_json_string = own_position_json_string.replace(regex_tilde, '~');
    own_position_json_string = own_position_json_string.replace(regex_pipe, '|');
    const own_position_upload_request = await fetch( 'https://' + window.location.hostname + '/client/send_request.php', { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: new URLSearchParams({'channels': '99999;;'}) } );
    //body: "channels=" + encodeURIComponent("99999;;") } );
    const own_position_transfer_string = "99999;" + current_timestamp.toString() + ",-9999.0,," + own_position_json_string + ",;" ;
    //console.log("own_position_transfer_string", own_position_transfer_string);
    const own_position_set_requested = await fetch( 'https://' + window.location.hostname + '/host/set_requested.php', { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: new URLSearchParams({'returnstring': own_position_transfer_string}) } );
    //body: "returnstring=" + encodeURIComponent(own_position_transfer_string) } );
  }

  if (Ais.OWN_DATA_CHANNEL !== null && Ais.OWN_DATA_IMAGE_BYTES !== null)  
  {
    const own_data_channel_string = (Ais.OWN_DATA_CHANNEL).toString(); //"99999";
    const own_data_image_bytes = Ais.OWN_DATA_IMAGE_BYTES;
    Ais.OWN_DATA_IMAGE_BYTES = null;
    //console.log("own_data_channel_string", own_data_channel_string);
    //console.log("own_data_image_bytes", own_data_image_bytes);
    const own_image_upload_request = await fetch( 'https://' + window.location.hostname + '/client/send_request.php', { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: new URLSearchParams({'channels': own_data_channel_string + ';;'}) } );
    //body: "channels=" + encodeURIComponent( own_data_channel_string + ";;") } );
    const own_image_transfer_string = own_data_channel_string + ";" + current_timestamp.toString() + ",-9999.0,," + own_data_image_bytes + ",;" ;
    //console.log("own_image_transfer_string", own_image_transfer_string);
    const own_image_set_requested = await fetch( 'https://' + window.location.hostname + '/host/set_requested.php', { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: new URLSearchParams({'returnstring': own_image_transfer_string}) } );
    //body: "returnstring=" + encodeURIComponent(own_image_transfer_string) } );
  }

}
