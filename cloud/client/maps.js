'use strict';


const width  = window.innerWidth || document.documentElement.clientWidth ||
document.body.clientWidth;
const height = window.innerHeight|| document.documentElement.clientHeight||
document.body.clientHeight;

//let spaceObject = new SpaceObject();

let Ais = new AisData();

let chart = new ChartContainer({center: [62.827, 17.875], zoom: 14, attribution: false}); //L.Map( 'map', {attributionControl: false} ).setView(center, 12);
let map = chart.map;

Ais.OWN_ZOOM_LEVEL = 14;


let geolocationAvailable = false ;
if('geolocation' in navigator)
{
  geolocationAvailable = true;
}
else
{
  Ais.OWN_POSITION_AVAILABLE = false ;
}

setInterval(refreshData, 5000);
setInterval(refreshDisplay, 2000);
setInterval(refreshAishubData, 30000);
setInterval(redrawGui, 1000);

const httpData = new HttpData();

/*
const DefaultIcon = L.Icon.extend
(
{
  options:
  {
    iconSize: [30,54],
    iconAnchor: [15,48],
    popupAnchor:  [0,0]
  }
}
);
*/
/*
L.FixedSizeMarker = L.Marker.extend({
  options: {
    fontSize: 12,   // starting size of icon in pixels
    zoomBase: 3     // Zoom level where fontSize is the correct size
  },
  update: function () {
    if (this.Icon && this.Icon.tagName === 'DIV' && this._map) {
      let size = this.options.fontSize * Math.pow(2, (this._map.getZoom() - this.options.zoomBase));
      this.Icon.style.fontSize = size + 'px';
    }
    return L.Marker.prototype.update.call(this);
  }
});
L.fixedSizeMarker = (latlng, options) => new L.FixedSizeMarker(latlng, options);

const myIcon3 = L.divIcon({html:"Example_3"}); //className: 'my-div-icon',
L.fixedSizeMarker({lat: 0.7800052024755708, lng: -12.135975261193327},
                  {icon: myIcon3, fontSize: 24, zoomBase: 3}).addTo(map);
*/

const ownLocationMobileIcon = new DefaultIcon({iconUrl: 'icons/leaflet/own_ship_symbol.png', iconSize: [20,32],iconAnchor: [10,16]});
const ownLocationStationaryIcon = new DefaultIcon({iconUrl: 'icons/leaflet/own_ship_stationary_symbol.png', iconSize: [16,16], iconAnchor: [8,8]}); //000_kt.png', iconSize: [45,81],iconAnchor: [22.5,72]});
const seaMobileIcon = new DefaultIcon({iconUrl: 'icons/leaflet/ship_symbol.png', iconSize: [16,24],iconAnchor: [8,12]});
const seaStationaryIcon = new DefaultIcon({iconUrl: 'icons/leaflet/ship_stationary_symbol.png', iconSize: [12,12], iconAnchor: [6,6]});
const seaLostContactIcon = new DefaultIcon({iconUrl: 'icons/leaflet/ship_lost_contact_symbol.png', iconSize: [8,8], iconAnchor: [4,4]});
const shoreStationaryIcon = new DefaultIcon({iconUrl: 'icons/leaflet/building_symbol.png', iconSize: [16,18], iconAnchor: [8,11]});
const atonSpecialMarkVirtualIcon = new DefaultIcon({iconUrl: 'icons/leaflet/ais_aton_special_mark_virtual.png', iconSize: [24,32], iconAnchor: [12,24]});
const shoreMobileIcon = new DefaultIcon({iconUrl: 'icons/leaflet/land_vehicle_symbol.png'});
const ownLocationLostIcon = new DefaultIcon({iconUrl: 'icons/leaflet/danger_over_symbol.png', iconSize: [16,16], iconAnchor: [8,8]});

let windBarbs = new WindBarbs();

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
L.control.scale().addTo(map);
let markersLayer = new L.LayerGroup();
markersLayer.addTo(map);

const staticUrl = 'https://' + window.location.hostname + '/client/get_static_records_string.php'; //?web_api_table_label=device' ; //'http://labremote.net/client/get_static_records.php?web_api_table=host&web_api_column=host_description' ;
//const staticBrowserUrl = 'https://' + window.location.hostname + '/client/get_static_records_string.php?web_api_table_label=module' ; 
const positionUrl = 'https://' + window.location.hostname + '/client/get_ais_data_records.php';
const ownPositionUrl = 'https://' + window.location.hostname + '/client/get_own_pos_records.php';
const updateStaticUrl = 'https://' + window.location.hostname + '/client/update_static_data_client.php'
const sendRequestUrl = 'https://' + window.location.hostname + '/client/send_request.php';
const setRequestedUrl = 'https://' + window.location.hostname + '/host/set_requested.php';

//const noIcon = new TransparentDivIcon( { html: "Example" } );
//let noMarker = new TransparentLabelMarker([0.7800052024755708, -12.135975261193327], {label: '1.2'});
//noMarker.addTo(map);

//const latitudeVector = [62.00793,62.024597,62.041264,62.057926,62.074593,62.09126,62.107925,62.12459,62.14126,62.157925,62.17459,62.191257,62.20792,62.224586,62.241253,62.25792,62.274586,62.291252,62.30792,62.324585,62.34125,62.357914,62.37458,62.391247,62.407913,62.42458,62.441246,62.457912,62.47458,62.491245,62.507908,62.524574,62.54124,62.557907,62.574574,62.59124,62.607906,62.624573,62.64124,62.657906,62.67457,62.691235,62.7079,62.724567,62.741234,62.7579,62.774567,62.791233,62.8079,62.824562,62.84123,62.857895,62.87456,62.891228,62.907894,62.92456,62.941227,62.957893,62.974556,62.991222,63.00789];
//const longitudeVector = [18.013636,18.041412,18.06919,18.096966,18.124743,18.152521,18.180298,18.208075,18.235851,18.263628,18.291405,18.319181,18.34696,18.374737,18.402514,18.43029,18.458067,18.485844,18.51362,18.541399,18.569176,18.596952,18.62473,18.652506,18.680283,18.70806,18.735838,18.763615,18.791391,18.819168,18.846945,18.874722,18.902498,18.930277,18.958054,18.98583,19.013607];

let ownLocationMarker = null;
let ownAccuracyCircle = null;
if (geolocationAvailable)
{
  ownLocationMarker = L.marker(chart.center, {icon: ownLocationLostIcon});
  ownLocationMarker.addTo(map);
  ownAccuracyCircle = L.circle(chart.center, {color: 'steelblue', radius: 0, fillColor: 'steelblue', opacity: 0.2});
  ownAccuracyCircle.addTo(map);
  const geolocationOptions = { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 };
  //const watchID =
  navigator.geolocation.watchPosition(handleGeolocationSuccess, handleGeolocationError, geolocationOptions);
}

const isTouchDevice = Device.isTouch();

const dangerMarker01 = new InfoMarker([62.664450, 18.286383], {iconUrl: 'icons/leaflet/danger_over_symbol.png', iconSize: [24,24], iconAnchor: [12,12]}, { imageUrl: "images/leaflet/danger_01_image.png", htmlLabel: "Drivande mina röjd 210617<br>Ungefärlig position:" }) ;
chart.add(dangerMarker01);
if (!isTouchDevice) dangerMarker01.usePopup();
else dangerMarker01.usePopup();

const shoreMarker01 = new InfoMarker([62.83, 17.864], {iconUrl: 'icons/leaflet/shore_01_symbol.png', iconSize: [32,32], iconAnchor: [16,16]}, { imageUrl: "images/leaflet/shore_01_image.png", htmlLabel: "Västby Hamnförening", linkUrl: "https://www.vastbyhamn.com" }) ;
chart.add(shoreMarker01);
if (!isTouchDevice) shoreMarker01.usePopup();
else shoreMarker01.usePopup();

const shoreMarker02 = new InfoMarker([62.8323, 17.874], {iconUrl: 'icons/leaflet/shore_02_symbol.png', iconSize: [40,30], iconAnchor: [20,15]}, { imageUrl: "images/leaflet/shore_02_image.png", htmlLabel: "Höga Kusten Varvet", linkUrl: "https://hagakustenvarvet.se" }) ;
chart.add(shoreMarker02);
if (!isTouchDevice) shoreMarker02.usePopup();
else shoreMarker02.usePopup();

const shoreMarker03 = new InfoMarker([62.8311, 17.873], {iconUrl: 'icons/leaflet/shore_03_symbol.png', iconSize: [32,30], iconAnchor: [16,15] }, { imageUrl: "images/leaflet/shore_03_image.png", htmlLabel: "Green City Ferries", linkUrl: "https://greencityferries.com" }) ;
chart.add(shoreMarker03);
if (!isTouchDevice) shoreMarker03.usePopup();
else shoreMarker03.usePopup();

let idButtonText = 'Share position with Test Site Bothnia';
if (!Ais.OWN_POSITION_AVAILABLE) idButtonText = 'No own position to share';
const idInputDescription = '<br>Please enter a specific user ID (up to 10 characters will be displayed):';
const idInfoDescription = 'Welcome to the MarIEx position reporting tool of Test Site Bothnia! We try to take all precautions possible to keep our test sites safe and secure, and your help is greatly appreciated. By adding a user ID to identify your position marker on the chart (either an arbitrary one of your choice or your name, ship name, call sign, MMSI, or other presumably unique identifier) when present in or near one of our test areas, you can improve your visibility not only to our test management team but to your fellow seafarers and land travellers as well. Please consider when choosing your ID that it will be sent back (securely) to Test Site Bothnia and stored (securely) in our database before being publicly shared in this application, and take note that your ID may be shortened to its first 10 characters when displayed.';
const cookieInfoDescription = 'To be able to link your device to your position unambiguously for the benefit of the Test Site Bothnia team and your fellow seafarers and land travellers, you can permit the MarIEx app to set a single cookie containing your user ID only (which is non-shareable with other sites). If you uncheck the box no new cookie will be set on the device and any cookies previously set by MarIEx will be removed.';
const idIsAvailable = Ais.OWN_POSITION_AVAILABLE ;
const idNotAvailablePreambleText = 'No own position to share';
const idNotFoundPreambleText = 'Sharing position anonymously'; //'Share position with Test Site Bothnia';
const idFoundPreambleText = 'Identified as ';
const idStoredPreambleText = 'Device recognized as ';
const idButtonStyle = { "position": "absolute", "width": "280px", "top": "5px", "right": "5px", "padding": "10px", "z-index": "400" , "color": ElementProps.rgbaLiteral([0,0,0,255]), "backgroundColor": ElementProps.rgbaLiteral([127,127,127,63]) };
let idInput = new IdInput({idButtonStyle: idButtonStyle, idButtonText: idButtonText, idInputDescription: idInputDescription, idInfoDescription: idInfoDescription, cookieInfoDescription: cookieInfoDescription, idIsAvailable: idIsAvailable, idNotAvailablePreambleText: idNotAvailablePreambleText, idNotFoundPreambleText: idNotFoundPreambleText, idFoundPreambleText: idFoundPreambleText, idStoredPreambleText: idStoredPreambleText});
let shareButton = idInput.getShareButton();
let cookieValue = idInput.getCookieValue();

if (Ais.OWN_POSITION_AVAILABLE && (typeof cookieValue !== 'undefined' && cookieValue !== null && cookieValue !== "") )
{
  Ais.OWN_USER_ID = cookieValue;
  idInput.setId(cookieValue);
  shareButton.innerText = "Identified as " + Ais.OWN_USER_ID;
  ElementProps.set( this.shareButton.style, { "color": ElementProps.rgbaLiteral([127,127,0,255]), "backgroundColor": ElementProps.rgbaLiteral([127,127,0,63]) } ) ;
}
else if (Ais.OWN_LOCATION_POS.length === 2)
{
  shareButton.innerText = "Sharing position anonymously" ;
  ElementProps.set( this.shareButton.style, { "color": ElementProps.rgbaLiteral([0,0,0,255]), "backgroundColor": ElementProps.rgbaLiteral([127,127,127,63]) } );
}

let cameraDiv = document.createElement("DIV");
document.body.appendChild(cameraDiv);
let cameraButton = document.createElement("BUTTON");
cameraDiv.appendChild(cameraButton);
cameraButton.id = "camera_button";
ElementProps.set( cameraButton.style, { "position": "absolute", "width": "280px", "top": "50px", "right": "5px", "padding": "10px", "z-index": "400" , "color": ElementProps.rgbaLiteral([0,0,0,255]), "backgroundColor": ElementProps.rgbaLiteral([127,127,127,63]) } ) ;
cameraButton.addEventListener("click", createImageInput);
let cameraButtonText = document.createTextNode("Share observation");
cameraButton.appendChild(cameraButtonText);

const guabButton = new OpenUrlImageOverlayButton( { sizePos: {"w": 106, "h": 40, "r": 0, "b": 0}, "design": {"enabled":{"button":{"style":{"border":"none","background-color":"transparent","outline":"none","cursor":"pointer"}},"img":{"content":'images/leaflet/guab_01_image.png',"style":{}}} }, "openUrl":'https://gustavsvik.eu' } ); // , "disabled":{"img":{"content":'images/leaflet/guab_01_image.png',"style":{}}}  { text: "Class button test" } );
guabButton.updateAppearance();

const tsbButton = new OpenUrlImageOverlayButton( { sizePos: {"w": 98, "h": 40, "r": 107, "b": 0}, "design": {"enabled":{"button":{"style":{"border":"none","background-color":"transparent","outline":"none","cursor":"pointer"}},"img":{"content":'images/leaflet/tsb_01_image.png',"style":{}}} }, "openUrl":'https://testsitebothnia.eu' } ); // , "disabled":{"img":{"content":'images/leaflet/tsb_01_image.png',"style":{}}}  { text: "Class button test" } );
tsbButton.updateAppearance();

const centerButton = new ImageOverlayButton
(
{
  "sizePos": {"w": 137, "h": 40, "r": 148, "t": 95},
  "design":
  {
    "enabled":{"button":{"style":{"opacity":"1.0","color":ElementProps.rgbaLiteral([0,0,0,255]),"backgroundColor":ElementProps.rgbaLiteral([127,127,127,63]),"cursor":"pointer"}},"img":{"content":'images/leaflet/crosshair.png',"style":{}},"text":{"content":"Center","style":{}}},
    "disabled":{"button":{"style":{"opacity":"0.5"}},"img":{"content":'images/leaflet/crosshair.png',"style":{}},"text":{"content":"Working...","style":{}}},
    "toggled":{"button":{"style":{"opacity":"1.0","color":ElementProps.rgbaLiteral([0,127,0,255]),"backgroundColor":ElementProps.rgbaLiteral([0,127,0,63]),"cursor": "pointer"}},"img":{"content":'images/leaflet/crosshair.png',"style":{}},"text":{"content":"Following","style":{}}}
  }
}
); //, "imgSrc": 'images/leaflet/crosshair.png' //{ text: "Class button test" } );
centerButton.updateAppearance();

let moreInfoDiv = document.createElement("DIV");
document.body.appendChild(moreInfoDiv);
let moreInfoButton = document.createElement("BUTTON");
moreInfoDiv.appendChild(moreInfoButton);
moreInfoButton.id = "more_info_button";
ElementProps.set( moreInfoButton.style, { "position": "absolute", "height":"40px", "width": "137px", "top": "95px", "right": "5px", "padding": "0px", "z-index": "400" , "color": ElementProps.rgbaLiteral([0,0,0,255]), "backgroundColor": ElementProps.rgbaLiteral([127,127,127,63]) } ) ;
const moreInfo01ImageUrl = 'icons/leaflet/' + 'ship_symbol_black.png' ;
moreInfoButton.innerHTML = '<div><img style="height:30px;vertical-align:middle;margin-left:-5px;margin-right:5px" src="' + moreInfo01ImageUrl + '"/><span style="">More info</span></div>';
moreInfoButton.addEventListener("click", showMoreInfo);

/*
function followPosition()
{
  if (!Ais.OWN_POSITION_FOLLOW)
  {
    Ais.OWN_POSITION_FOLLOW = true;
    ElementProps.set( centerButton.style, { "color": ElementProps.rgbaLiteral([0,127,0,255]), "backgroundColor": ElementProps.rgbaLiteral([0,127,0,63]) } ) ;
    Ais.OWN_ZOOM_LEVEL = map.getZoom();
  }
  else
  {
    Ais.OWN_POSITION_FOLLOW = false;
    ElementProps.set( centerButton.style, { "color": ElementProps.rgbaLiteral([0,0,0,255]), "backgroundColor": ElementProps.rgbaLiteral([127,127,127,63]) } ) ;
  }
}
*/

function showMoreInfo()
{
  if (!Ais.GET_ALL_AND_IMAGES)
  {
    Ais.GET_ALL_AND_IMAGES = true;
    ElementProps.set( moreInfoButton.style, { "color": ElementProps.rgbaLiteral([0,127,0,255]), "backgroundColor": ElementProps.rgbaLiteral([0,127,0,63]) } ) ;
  }
  else
  {
    Ais.GET_ALL_AND_IMAGES = false;
    ElementProps.set( moreInfoButton.style, { "color": ElementProps.rgbaLiteral([0,0,0,255]), "backgroundColor": ElementProps.rgbaLiteral([127,127,127,63]) } ) ;
  }
}

function createImageInput()
{
  let imageDialog = document.createElement("DIALOG");
  document.body.appendChild(imageDialog);
  dialogPolyfill.registerDialog(imageDialog);
  let dialogDiv = document.createElement("DIV");
  imageDialog.appendChild(dialogDiv);

  let descriptionDiv = document.createElement("DIV");
  ElementProps.set( descriptionDiv.style, {"position": "relative"} );
  descriptionDiv.innerHTML = '<br>Use the text field below to describe (anonymously if you prefer) your finds and/or hit the button to attach related media files:' //'<br>Welcome to the MarIEx environmental reporting tool of Test Site Bothnia! We try to take all precautions possible to keep our test sites safe and secure, and your help is greatly appreciated. Here you can report occurrences in or near test site areas of e g:<ul><li>Severe winds, waves, thunderstorms, precipitation, flooding, ice formation and other sudden weather changes for the worse and potentially hazardous natural phenomena</li><li>Divers, swimmers, water skiers, jet ski riders, kayakers and other unprotected personnel</li><li>Seals and other vulnerable aquatic mammals or other kinds of species</li><li>Algae blooms or infestations of jellyfish or other invasive or harmful species</li><li>Natural objects (e g logs) or man-made equipment (e g buoys or vehicles) adrift, stranded or abandoned</li><li>Refuse, oil spills or other kinds of man-made pollution</li><li>Containers of harmful substances or other hazardous items like mines or other kinds of unexploded munitions</li><li>Other harmful activity in progress, such as pollution, vandalism, theft or reckless or unsafe behaviour</li><li>Unidentifiable or evasive vessels (e g submarines) or other suspicious equipment or personnel (e g divers)</li></ul>Use the text field below to describe (anonymously if you prefer) your finds and/or hit the button to attach related media files:';
  dialogDiv.appendChild(descriptionDiv);

  let attachButton = document.createElement("BUTTON");
  let shareInfoButton = document.createElement("BUTTON");
  let attachButtonDiv = document.createElement("DIV");
  ElementProps.set( attachButtonDiv.style, {"position": "relative", "top": "10px"} );
  attachButtonDiv.appendChild(attachButton);
  ElementProps.set( attachButton.style, {"padding": "10px"} );
  attachButtonDiv.appendChild(shareInfoButton);
  ElementProps.set( shareInfoButton.style, {"height": "30px", "width": "30px", "border-radius": "50%", "border": "1px solid #000", "margin-left": "20px", "padding": "0px"} );
  attachButton.addEventListener("click", getImage);
  shareInfoButton.addEventListener("click", shareInfo);
  let attachButtonText = document.createTextNode("Attach image or file");
  attachButton.appendChild(attachButtonText);
  let shareInfoButtonText = document.createTextNode("i");
  shareInfoButton.appendChild(shareInfoButtonText);
  dialogDiv.appendChild(attachButtonDiv);

  let imageTextarea = document.createElement("TEXTAREA");
  let textareaDiv = document.createElement("DIV");
  ElementProps.set( textareaDiv.style, {"position": "relative", "top": "10px"} );
  textareaDiv.appendChild(imageTextarea);
  ElementProps.set( imageTextarea, {"rows": "10"} ); //, "cols": "35"
  ElementProps.set( imageTextarea.style, {fieldStyle: {"font-size": "10pt"}, "position": "relative", "top": "10px", "width": "100%"} );
  let defaultText = 'My contact information (email or phone, not required): ';
  if (Ais.OWN_LOCATION_POS.length === 2) defaultText += '\r\n' + 'My current location: ' + Ais.OWN_LOCATION_POS[0].toString().substring(0,8) + ',' + Ais.OWN_LOCATION_POS[1].toString().substring(0,8);
  defaultText += '\r\n\r\n' + 'My observation: ' + '\r\n';
  imageTextarea.value = defaultText;
  dialogDiv.appendChild(textareaDiv);

  let submitButton = document.createElement("BUTTON");
  let cancelButton = document.createElement("BUTTON");
  let shareButtonDiv = document.createElement("DIV");
  ElementProps.set( shareButtonDiv.style, {"position": "relative", "top": "30px"} );
  shareButtonDiv.appendChild(submitButton);
  ElementProps.set( submitButton.style, {"padding": "10px"} );
  shareButtonDiv.appendChild(cancelButton);
  ElementProps.set( cancelButton.style, {"padding": "10px", "margin-left": "10px"} );
  submitButton.addEventListener("click", submitData);
  cancelButton.addEventListener("click", cancel);
  let submitButtonText = document.createTextNode("Submit");
  submitButton.appendChild(submitButtonText);
  let cancelButtonText = document.createTextNode("Cancel");
  cancelButton.appendChild(cancelButtonText);
  dialogDiv.appendChild(shareButtonDiv);

  ElementProps.set( dialogDiv.style, {"position": "relative", "top": "-25px"} ); //"overflow-y": "auto",

  imageDialog.showModal();

  window.scrollTo(0, 0);

  function shareInfo()
  {
    window.alert('Welcome to the MarIEx environmental reporting tool of Test Site Bothnia! We try to take all precautions possible to keep our test sites safe and secure, and your help is greatly appreciated. Here you can report occurrences in or near test site areas of e g:\n\n- Severe winds, waves, thunderstorms, precipitation, flooding, ice formation and other sudden weather changes for the worse and potentially hazardous natural phenomena\n- Divers, swimmers, water skiers, jet ski riders, kayakers and other unprotected personnel\n- Seals and other vulnerable aquatic mammals or other kinds of species\n- Algae blooms or infestations of jellyfish or other invasive or harmful species\n- Natural objects (e g logs) or man-made equipment (e g buoys or vehicles) adrift, stranded or abandoned\n- Refuse, oil spills or other kinds of man-made pollution\n- Containers of harmful substances or other hazardous items like mines or other kinds of unexploded munitions\n- Other harmful activity in progress, such as pollution, vandalism, theft or reckless or unsafe behaviour\n- Unidentifiable or evasive vessels (e g submarines) or other suspicious equipment or personnel (e g divers)')
  }

  function submitData()
  {
    imageDialog.close();
  }

  function cancel()
  {
    imageDialog.close();
  }


  function getImage()
  {
    let imageDiv = document.createElement("DIV");
    document.body.appendChild(imageDiv);
    let imageInput = document.createElement("INPUT");
    imageInput.addEventListener("change", getImageFile);
    imageDiv.appendChild(imageInput);

    ElementProps.set( imageInput, {"id": "image_input", "type": "file", "accept": "image/*", "style": "display:none"} );   // ,audio/*,video/* "capture": "user" //force camera input only

    imageInput.click();

    function getImageFile(event)
    {
      //const image = document.createElement("IMG");
      const imageFile = event.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', imageReader)
      reader.readAsDataURL(imageFile);

      function imageReader(event)
      {
        const ownDataImageBytes = event.target.result.split(',')[1];
        Ais.OWN_DATA_IMAGE_BYTES = ownDataImageBytes;
      }
    }
  }

}


/*
let imageDiv = document.createElement("DIV");
document.body.appendChild(imageDiv);
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
//ElementProps.set( video.style, { "position": "absolute", "bottom": "0px", "right": "100px", "padding": "10px", "z-index": "400" } );
imageDiv.appendChild(video);
cameraButton.addEventListener('click', event => {
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


function handleGeolocationSuccess(position)
{
  const ownCoords = position.coords;

  //ownLocationMarker = L.marker(center, {icon: ownLocationStationaryIcon});
  //ownLocationMarker.addTo(map);
  //ownAccuracyCircle = L.circle(center, {color: 'steelblue', radius: 0, fillColor: 'steelblue', opacity: 0.2});
  //ownAccuracyCircle.addTo(map);

  Ais.OWN_POSITION_AVAILABLE = true;
  idInput.setIdIsAvailable(Ais.OWN_POSITION_AVAILABLE);
  Ais.OWN_USER_ID = idInput.getId();

  //shareButton.innerText = idNotFoundPreambleText;   //"Sharing position anonymously";
  //ElementProps.set( shareButton.style, { "color": ElementProps.rgbaLiteral([0,0,0,255]), "backgroundColor": ElementProps.rgbaLiteral([127,127,127,63]) } );
  idInput.setNotFoundLabel();

  cookieValue = idInput.getCookieValue();
  if ( (typeof cookieValue !== 'undefined' && cookieValue !== null && cookieValue !== "") ) // && (typeof Ais.OWN_USER_ID === 'undefined' || Ais.OWN_USER_ID === "" || Ais.OWN_USER_ID === null) )
  {
    Ais.OWN_USER_ID = cookieValue;
    idInput.setStoredLabel(Ais.OWN_USER_ID);
  }
  if ( (typeof cookieValue === 'undefined' || cookieValue === null || cookieValue === "") && (typeof Ais.OWN_USER_ID !== 'undefined' && Ais.OWN_USER_ID !== "" && Ais.OWN_USER_ID !== null) )
  {
    idInput.setFoundLabel(Ais.OWN_USER_ID);
  }

  Ais.OWN_LOCATION_COORDS = { "lat": ownCoords.latitude, "lon": ownCoords.longitude, "accuracy": ownCoords.accuracy, "alt": ownCoords.altitude, "alt_accuracy": ownCoords.altitudeAccuracy, "speed": ownCoords.speed, "heading": ownCoords.heading };
  Ais.OWN_LOCATION_POS[0] = ownCoords.latitude;
  Ais.OWN_LOCATION_POS[1] = ownCoords.longitude;
  Ais.OWN_LOCATION_ACCURACY = ownCoords.accuracy;
  Ais.OWN_LOCATION_ALTITUDE = ownCoords.altitude;
  Ais.OWN_LOCATION_ALTITUDE_ACCURACY = ownCoords.altitudeAccuracy;
  Ais.OWN_LOCATION_SPEED = ownCoords.speed;
  Ais.OWN_LOCATION_HEADING = ownCoords.heading;
}


function handleGeolocationError()
{
  Ais.OWN_POSITION_AVAILABLE = false;
  idInput.setIdIsAvailable(Ais.OWN_POSITION_AVAILABLE);

  Ais.OWN_LOCATION_POS = [];

  ownLocationMarker.setIcon(ownLocationLostIcon);
  ownAccuracyCircle.setRadius(0);

  if (!isTouchDevice) ownLocationMarker.bindTooltip(idNotAvailablePreambleText);
  else ownLocationMarker.bindPopup(idNotAvailablePreambleText, {closeOnClick: true, autoClose: false});
  idInput.setNotAvailableLabel();
}


function redrawGui()
{
  tsbButton.updateAppearance();
  tsbButton.resetClicked();

  guabButton.updateAppearance();
  guabButton.resetClicked();

  centerButton.updateAppearance();
  if (centerButton.toggled) Ais.OWN_POSITION_FOLLOW = true;
  else Ais.OWN_POSITION_FOLLOW = false;
  centerButton.resetClicked();
}


function refreshDisplay()
{

  markersLayer.clearLayers();

  let currentTimestamp = parseInt((new Date().valueOf()) / 1000);

  if (Ais.OWN_LOCATION_POS.length === 2)
  {
    ownLocationMarker.setIcon(ownLocationStationaryIcon);
    ownLocationMarker.setLatLng(Ais.OWN_LOCATION_POS);
    let ownLocationHtmlString = '<div style="font-size:10px;line-height:100%;">';
    if (Ais.OWN_USER_ID !== null && Ais.OWN_USER_ID !== "") ownLocationHtmlString += 'User ID: ' + Ais.OWN_USER_ID + '<br>' ;
    ownLocationHtmlString += 'Lat: ' + Ais.OWN_LOCATION_POS[0].toString().substring(0,8) + '\u00B0' + '<br>' ;
    ownLocationHtmlString += 'Lon: ' + Ais.OWN_LOCATION_POS[1].toString().substring(0,8) + '\u00B0' + '<br>' ;
    if (Ais.OWN_LOCATION_ACCURACY !== null)
    {
      ownLocationHtmlString += 'Accuracy: ' + Ais.OWN_LOCATION_ACCURACY.toString().substring(0,6) + ' m' ;
      ownAccuracyCircle.setLatLng(Ais.OWN_LOCATION_POS);
      ownAccuracyCircle.setRadius(parseInt(Ais.OWN_LOCATION_ACCURACY));
    }
    if (Ais.OWN_LOCATION_ALTITUDE !== null) ownLocationHtmlString += '<br>Altitude: ' + Ais.OWN_LOCATION_ALTITUDE.toString().substring(0,6) + ' m' ;
    if (Ais.OWN_LOCATION_ALTITUDE_ACCURACY !== null) ownLocationHtmlString += '<br>Altitude: ' + Ais.OWN_LOCATION_ALTITUDE_ACCURACY.toString().substring(0,6) + ' m' ;
    if (Ais.OWN_LOCATION_SPEED !== null)
    {
      ownLocationHtmlString += '<br>Speed: ' + Ais.OWN_LOCATION_SPEED.toString().substring(0,6) + ' m/s' ;
      if (Ais.OWN_LOCATION_SPEED > 0) ownLocationMarker.setIcon(ownLocationMobileIcon);
      if (Ais.OWN_LOCATION_HEADING !== null)
      {
        ownLocationHtmlString += '<br>Heading: ' + Ais.OWN_LOCATION_HEADING.toString().substring(0,6) + '\u00B0' ;
        ownLocationMarker.setRotationOrigin("center");
        ownLocationMarker.setRotationAngle(Ais.OWN_LOCATION_HEADING);
      }
    }
    if (!isTouchDevice) ownLocationMarker.bindTooltip(ownLocationHtmlString);
    else ownLocationMarker.bindPopup(ownLocationHtmlString, {closeOnClick: true, autoClose: false});

    if (Ais.OWN_POSITION_FOLLOW && Ais.OWN_LOCATION_POS.length === 2)
    {
      map.flyTo(Ais.OWN_LOCATION_POS);
      const centerPos = map.getCenter(); // get map center
      const mapBounds = map.getBounds();
      const mapBoundNorth = L.latLng(mapBounds.getNorth(), centerPos['lng']);
      const mapBoundEast = L.latLng(centerPos['lat'], mapBounds.getEast());
      const mapDistanceNorth = mapBoundNorth.distanceTo(centerPos);
      const mapDistanceEast = mapBoundEast.distanceTo(centerPos);
      const marginFactor = Math.min(mapDistanceNorth, mapDistanceEast) / Ais.OWN_LOCATION_ACCURACY;
      const zoomLevelAdjust = Math.floor(Math.log2(marginFactor));
      const currentZoomLevel = map.getZoom();
      if (zoomLevelAdjust < 0) map.flyTo(Ais.OWN_LOCATION_POS, currentZoomLevel + zoomLevelAdjust);
    }
  }

  for (let _idCounter = 0; _idCounter < Ais.ID_ARRAY.length; _idCounter++)
  {
    const id = Ais.ID_ARRAY[_idCounter];
    const mmsi = Ais.MMSI_ARRAY[_idCounter];
    const lat = Ais.POS_ARRAY[_idCounter][1];
    const lon = Ais.POS_ARRAY[_idCounter][0];
    const wspeed = Ais.WIND_SPEED_ARRAY[_idCounter];
    const wdir = Ais.WIND_DIR_ARRAY[_idCounter];
    const airtemp = Ais.AIR_TEMP_ARRAY[_idCounter];
    const watertemp = Ais.WATER_TEMP_ARRAY[_idCounter];
    const waveheight = Ais.WAVE_HEIGHT_ARRAY[_idCounter];
    const speed = Ais.SPEED_ARRAY[_idCounter];
    const course = Ais.COURSE_ARRAY[_idCounter];
    const content = Ais.TEXT_ARRAY[_idCounter];
    const age = currentTimestamp - Ais.TIME_ARRAY[_idCounter];

    if (lat !== null && lon !== null)
    {
      let marker = L.marker([ lat, lon ], {icon: seaStationaryIcon});

      if (speed > 0)
      {
        marker.setIcon(seaMobileIcon);
      }
      let timeOpacity = (1200-(age-600))/1200 ;
      if (timeOpacity > 1) timeOpacity = 1;
      if (timeOpacity < 0) timeOpacity = 0;
      if (timeOpacity > 0.1)
      {
        marker.setOpacity(timeOpacity);
        marker.setRotationOrigin("center");
        marker.setRotationAngle(course);
      }
      else
      {
        marker.setIcon(seaLostContactIcon);
        marker.setOpacity(0.2);
        marker.setRotationAngle(0.0);
      }

      const contentJson = GetSafe.json(content);
      if (contentJson !== null)
      {
        let type = GetSafe.byKey(contentJson, "type");
        if ( type !== null) type = parseInt(type);

        let htmlString = '<div style="font-size:10px;line-height:100%;">';
        htmlString += (age/60).toString().substring(0,3) + ' min. ago' + '<br>';

        if (type === 8)
        {
          marker.setIcon( windBarbs.getIcon(0) );

          if (wspeed !== null)
          {
            marker.setIcon( windBarbs.getIcon(wspeed) );
            marker.setRotationOrigin("15px 48px");
            marker.setRotationAngle(wdir);
            htmlString += 'Wind speed: ' + wspeed.toString().substring(0,3) + ' kt.' + '<br>';
          }
          if (wdir !== null) htmlString += 'Wind direction: ' + wdir.toString().substring(0,3) + '\u00B0' + '<br>';
          if (airtemp !== null) htmlString += 'Air temperature: ' + airtemp.toString().substring(0,4) + '\u00B0C' + '<br>';
          if (watertemp !== null) htmlString += 'Water temperature: ' + watertemp.toString().substring(0,4) + '\u00B0C' + '<br>';
          if (waveheight !== null) htmlString += 'Wave height: ' + waveheight.toString().substring(0,4) + ' m.' + '<br>';
          if (id !== null) htmlString += 'ID: ' + id.toString();
        }
        else
        {
          if (type === 4)
          {
            marker.setIcon(shoreStationaryIcon);
          }
          else if (type === 21)
          {
            const completeName = GetSafe.byKey(contentJson, "complete_name");
            if (completeName !== null) htmlString += 'Info: ' + completeName.toString() + '<br>' ;
            marker.setIcon(atonSpecialMarkVirtualIcon);
          }
          else
          {
            if (speed !== null) htmlString += 'Speed: ' + speed.toString().substring(0,6) + ' kt.' + '<br>' ;
            if (course !== null) htmlString += 'Course: ' + course.toString() + '' + '<br>' ;
            const shipname = GetSafe.byKey(contentJson, "shipname");
            if (shipname !== null) htmlString += 'Name: ' + shipname.toString() + '<br>' ;
            const callsign = GetSafe.byKey(contentJson, "callsign");
            if (callsign !== null) htmlString += 'Callsign: ' + callsign.toString() + '<br>' ;
            const destination = GetSafe.byKey(contentJson, "destination");
            if (destination !== null) htmlString += 'Destination: ' + destination.toString() + '<br>' ;
            const imo = GetSafe.byKey(contentJson, "imo");
            if (imo !== null) htmlString += 'IMO: ' + imo.toString() + '<br>' ;
          }
          if (mmsi !== null) htmlString += 'MMSI: ' + mmsi.toString() + '<br>' ;
          if (id !== null) htmlString += 'ID: ' + id.toString() + '<br>' ;
          if (lat !== null) htmlString += 'Lat: ' + lat.toString().substring(0,8) + '\u00B0' + '<br>' ;
          if (lon !== null) htmlString += 'Lon: ' + lon.toString().substring(0,8) + '\u00B0' ;  //Disp.jsonToTable(contentJson, {});

          const iconFilename = GetSafe.byKey(contentJson, "icon_filename");
          if (iconFilename !== null)
          {
            const iconUrl = 'icons/leaflet/' + iconFilename ;
            const icon = new DefaultIcon({iconUrl: iconUrl, iconSize: [32,32],iconAnchor: [16,16]})
            marker.setIcon(icon);
          }
        }

        const imageFilename = GetSafe.byKey(contentJson, "image_filename");
        if ( Ais.GET_ALL_AND_IMAGES && imageFilename !== null) //!isTouchDevice
        {
          const imageUrl = 'images/leaflet/' + imageFilename ;
          htmlString += '<br><br>' + '<img src="' + imageUrl + '"/>';
        }

        if (!isTouchDevice) marker.bindTooltip(htmlString);
        else marker.bindPopup(htmlString, {closeOnClick: true, autoClose: false}) ;
      }

      markersLayer.addLayer(marker);
    }
  }

  for (let _posCounter = 0; _posCounter < Ais.ALL_POS_ARRAY.length; _posCounter++)
  {
    const lat = Ais.ALL_POS_ARRAY[_posCounter][1];
    const lon = Ais.ALL_POS_ARRAY[_posCounter][0];
    const id = Ais.ALL_ID_ARRAY[_posCounter];
    //console.log("mmsi", mmsi);
    const age = currentTimestamp - parseInt(Ais.ALL_TIME_ARRAY[_posCounter]);
    if (lat !== null && lon !== null)
    {
      // && parseFloat(id) > 0.0 let marker_2 = new TransparentLabelMarker([ lat, lon ], {label: id.toString().substring(0,4)});

      let marker_2 = L.circleMarker([ lat, lon ], {opacity: 0.5, color: "#00c600"});
      if (id === "99999") marker_2 = L.circleMarker([ lat, lon ], {opacity: 0.5, color: "#ff0000"});
      marker_2.setRadius(4 - 4 * age/900);
      const id_label = id;
      if (id_label === "99999") id_label = "Anonymous";
      let htmlString = '<div style="font-size:10px;line-height:100%;">' + (age/60).toString().substring(0,3)  + ' min. ago' + '<br>' + 'ID: ' + id.toString() + '<br>' + 'Lat: ' + lat.toString().substring(0,8) + '<br>' + 'Lon: ' + lon.toString().substring(0,8) + '</div>'; // + ' m.'
      if (!isTouchDevice) marker_2.bindTooltip(htmlString);
      else marker_2.bindPopup(htmlString, {closeOnClick: true, autoClose: false});

      markersLayer.addLayer(marker_2);
    }
  }
}


async function refreshData()
{
  /*
  const geolocationOptions = { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 };
  const watchID = navigator.geolocation.getCurrentPosition(handleGeolocationSuccess, handleGeolocationError, geolocationOptions);
  */
  let response = null;
  try
  {
    response = await fetch(staticUrl);
  }
  catch(e)
  {
    console.error(e);
  }
  let data = "";
  try
  {
    data = await response.json();
  }
  catch(e)
  {
    console.error(e);
  }

  const dataArray = Transform.delimitedStringToArrays(data);
  let dataStringArray = [];
  if (dataArray[2].length > 0) dataStringArray = dataArray[2][0];
  let timestampArray = [];
  if (dataArray[0].length > 0) timestampArray = dataArray[0][0];
  for (let _aisStringCounter = 0; _aisStringCounter < dataStringArray.length; _aisStringCounter++)
  {

    const time = parseInt(timestampArray[_aisStringCounter]);

    let aisString = dataStringArray[_aisStringCounter]
    if (aisString.length > 0)
    {
      //const regexComma = /\|/g;
      //const regexSemicolon = /\~/g;
      //let aisJsonString = aisString.replace(regexSemicolon, ";");
      //aisJsonString = aisJsonString.replace(regexComma, ",");
      const aisJsonString = Transform.fromArmoredString(aisString);
      //console.log("aisJsonString", aisJsonString);
	  //try
	  //{
        let aisJson = GetSafe.json(aisJsonString); //[0];
        let aisJsonDict = aisJson;

        let id = GetSafe.byKey(aisJsonDict, "host_hardware_id");

        if (Array.isArray(aisJson))
        {
          id = aisJson[0][2]
          aisJsonDict = aisJson[0][3];
        }

        //console.log("aisJson", aisJson);
        const mmsi = GetSafe.byKey(aisJsonDict, "mmsi");
        const lon = GetSafe.byKey(aisJsonDict, "lon");
        const lat = GetSafe.byKey(aisJsonDict, "lat");
        const wdir = GetSafe.byKey(aisJsonDict, "wdir");
        const wspeed = GetSafe.byKey(aisJsonDict, "wspeed");
        const airtemp = GetSafe.byKey(aisJsonDict, "airtemp");
        const watertemp = GetSafe.byKey(aisJsonDict, "watertemp");
        const waveheight = GetSafe.byKey(aisJsonDict, "waveheight");
        const speed = GetSafe.byKey(aisJsonDict, "speed");
        const course = GetSafe.byKey(aisJsonDict, "course");
        const heading = GetSafe.byKey(aisJsonDict, "heading");

        const idIndex = Ais.ID_ARRAY.indexOf(id);

        if (idIndex === -1)
        {
          Ais.ID_ARRAY.push( id ) ;
          Ais.MMSI_ARRAY.push( mmsi )
          Ais.POS_ARRAY.push( [ lon, lat ] ) ;
          Ais.WIND_DIR_ARRAY.push( wdir );
          Ais.WIND_SPEED_ARRAY.push( wspeed );
          Ais.AIR_TEMP_ARRAY.push( airtemp );
          Ais.WATER_TEMP_ARRAY.push( watertemp );
          Ais.WAVE_HEIGHT_ARRAY.push( waveheight );
          Ais.SPEED_ARRAY.push( speed );
          Ais.COURSE_ARRAY.push( course );
          Ais.TEXT_ARRAY.push( aisJsonString );
          Ais.TIME_ARRAY.push( time ) ;
        }
        else
        {
          if (mmsi !== null) Ais.MMSI_ARRAY[idIndex] = mmsi;
          if (lon !== null && lat !== null) Ais.POS_ARRAY[idIndex] = [ lon, lat ] ;
          if (wdir !== null) Ais.WIND_DIR_ARRAY[idIndex] = wdir;
          if (wspeed !== null) Ais.WIND_SPEED_ARRAY[idIndex] = wspeed;
          if (airtemp !== null) Ais.AIR_TEMP_ARRAY[idIndex] = airtemp;
          if (watertemp !== null) Ais.WATER_TEMP_ARRAY[idIndex] = watertemp;
          if (waveheight !== null) Ais.WAVE_HEIGHT_ARRAY[idIndex] = waveheight;
          if (speed !== null) Ais.SPEED_ARRAY[idIndex] = speed;
          if (course !== null) Ais.COURSE_ARRAY[idIndex] = course;
          Ais.TEXT_ARRAY[idIndex] = aisJsonString;
          Ais.TIME_ARRAY[idIndex] = time;
        }
      //}
      //catch(e)
      //{
      //}
    }
  }

  let positionStringArray = []

  if ( Ais.GET_ALL_AND_IMAGES )
  {
    let positionResponse = null;
    try
    {
      positionResponse = await fetch(positionUrl, { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: new URLSearchParams({'channels': '148;154;', 'duration': '900'}) });
    }
    catch(e)
    {
      console.error(e);
    }
    let positionData = "";
    try
    {
      positionData = await positionResponse.json();
    }
    catch(e)
    {
      console.error(e);
    }
    positionStringArray[0] = positionData
  }

  const ownPositionResponse = await fetch( ownPositionUrl, { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: new URLSearchParams({'channels': '99999;', 'duration': '300'}) } );
  let ownPositionData = null;
  try
  {
    ownPositionData = await ownPositionResponse.json();
  }
  catch(e)
  {
    console.error(e);
  }
  positionStringArray[1] = ownPositionData

//Get AISHUB data separately at longer intervals (1 min?) at some point
//  const aishubPositionResponse = await fetch(positionUrl, { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: new URLSearchParams({'channels': '153;'}) });
//  let positionData = null;
//  try
//  {
//    aishubPositionData = await aishubPositionResponse.json();
//  }
//  catch(e)
//  {
//  }
//  positionStringArray[2] = aishubPositionData

  let currentTimestamp = parseInt((new Date().valueOf()) / 1000);
  Ais.ALL_POS_ARRAY = [];
  Ais.ALL_TIME_ARRAY = [];
  Ais.ALL_ID_ARRAY = [];

  if ( Ais.GET_ALL_AND_IMAGES )
  {

  for (let _positionDataCounter = 0; _positionDataCounter < positionStringArray.length; _positionDataCounter++)
  {
    const positionDataArray = Transform.delimitedStringToArrays(positionStringArray[_positionDataCounter]);
    //console.log("positionDataArray", positionDataArray);
    let positionDataStringArray = [];
    if (positionDataArray[2].length > 0) positionDataStringArray = positionDataArray[2][0];
    let positionTimestampArray = [];
    if (positionDataArray[0].length > 0) positionTimestampArray = positionDataArray[0][0];

    for (let _positionStringCounter = 0; _positionStringCounter < positionDataStringArray.length; _positionStringCounter++)
    {
      let positionString = positionDataStringArray[_positionStringCounter];

      if (positionString.length > 0)
      {
        //const regexComma = /\|/g;
        //const regexSemicolon = /\~/g;
        //const positionJsonString = positionString.replace(regexSemicolon, ";").replace(regexComma, ",");
        const positionJsonString = Transform.fromArmoredString(positionString);

        const positionJson = GetSafe.json(positionJsonString); //[0];
        if (positionJson !== null)
        {
          for (let _positionJsonCounter = 0; _positionJsonCounter < positionJson.length; _positionJsonCounter++)
          {
            const type = GetSafe.byKey(positionJson[_positionJsonCounter], "type");
            if ( [1,2,3,18,9].includes(parseInt(type)) )
            {
              Ais.ALL_POS_ARRAY.push( [ GetSafe.byKey(positionJson[_positionJsonCounter], "lon"), GetSafe.byKey(positionJson[_positionJsonCounter], "lat") ] ) ;
              Ais.ALL_ID_ARRAY.push( GetSafe.byKey(positionJson[_positionJsonCounter], "mmsi") );
            }
            const positionTime = parseInt(positionTimestampArray[_positionStringCounter]);
            Ais.ALL_TIME_ARRAY.push( positionTime ) ;
          }
        }
      }
    }
  }

  }

  let ownPositionJsonString = JSON.stringify(Ais.OWN_LOCATION_COORDS);

  //const regexPipe = new RegExp(',', 'g');
  //const regexTilde = new RegExp(';', 'g');

  let userId = null;
  if (Ais.OWN_POSITION_AVAILABLE && typeof Ais.OWN_USER_ID !== 'undefined' && Ais.OWN_USER_ID !== null && Ais.OWN_USER_ID !== "") userId = Ais.OWN_USER_ID;
  if (userId === null) userId = "99999";
  if (Ais.OWN_LOCATION_POS.length === 2) // userId !== null ||
  {
    ownPositionJsonString = '[[null, null, ' + '"' + userId + '"' + ', ' + ownPositionJsonString + ']]' ;

    const newChannelResponse = await fetch( updateStaticUrl, { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: new URLSearchParams({'common_description': ownPositionJsonString, 'module_address': userId}) } );
    //body: "common_description=" + encodeURIComponent(ownPositionJsonString) } );
    let newChannelData = null;
    try
    {
      newChannelData = await newChannelResponse.json();
      Ais.OWN_DATA_CHANNEL = newChannelData["new_channel_index"];
    }
    catch(e)
    {
      console.error(e);
    }
    //ownPositionJsonString = ownPositionJsonString.replace(regexTilde, '~');
    ownPositionJsonString = Transform.fromUnarmoredString(ownPositionJsonString); //ownPositionJsonString.replace(regexPipe, '|');
    const ownPositionUploadRequest = await fetch( sendRequestUrl, { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: new URLSearchParams({'channels': '99999;;'}) } );
    if (!ownPositionUploadRequest.ok) console.error(ownPositionUploadRequest);
    const ownPositionTransferString = "99999;" + currentTimestamp.toString() + ",-9999.0,," + ownPositionJsonString + ",;" ;
    const ownPositionSetRequested = await fetch( setRequestedUrl, { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: new URLSearchParams({'returnstring': ownPositionTransferString}) } );
    if (!ownPositionSetRequested.ok) console.error(ownPositionSetRequested);
  }

  if (Ais.OWN_DATA_CHANNEL !== null && Ais.OWN_DATA_IMAGE_BYTES !== null)
  {
    const ownDataChannelString = (Ais.OWN_DATA_CHANNEL).toString(); //"99999";
    const ownDataImageBytes = Ais.OWN_DATA_IMAGE_BYTES;
    Ais.OWN_DATA_IMAGE_BYTES = null;
    const ownImageUploadRequest = await fetch( sendRequestUrl, { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: new URLSearchParams({'channels': ownDataChannelString + ';;'}) } );
    if (!ownImageUploadRequest.ok) console.error(ownImageUploadRequest);
    const ownImageTransferString = ownDataChannelString + ";" + currentTimestamp.toString() + ",-9999.0,," + ownDataImageBytes + ",;" ;
    const ownImageSetRequested = await fetch( setRequestedUrl, { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: new URLSearchParams({'returnstring': ownImageTransferString}) } );
    if (!ownImageSetRequested.ok) console.error(ownImageSetRequested);
  }

}



async function refreshAishubData()
{
  if ( true ) //Ais.GET_ALL_AND_IMAGES
  {
    httpData.post();
    console.log(new Date());
  }
}
