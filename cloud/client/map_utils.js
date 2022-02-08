"use strict";



class TransparentDivIcon extends L.DivIcon
{
  constructor( { label = '*' } = {} )
  {
    super( { html: '<style> .leaflet-div-icon { background-color: transparent; border-color: transparent } </style> <span style="font-size:8px;line-height:100%;background-color:transparent;" />' + label, className: 'leaflet-div-icon' } );
  }
}



class TransparentLabelMarker extends L.Marker
{
  constructor( pos = [0.0, 0.0], { label = '*' } = {} )
  {
    const noIcon = new TransparentDivIcon( {label: label } );
    //noIcon.style.backgroundColor = 'transparent';
	super(pos, {icon: noIcon, opacity: 1.0});
  }
}



class DefaultIcon extends L.Icon
{
  constructor( { iconUrl = 'icons/leaflet/danger_over_symbol.png', iconSize = [30,54], iconAnchor = [15,48] } = {} ) //iconUrl = 'icons/leaflet/danger_over_symbol.png')
  {
    super( { iconUrl: iconUrl, iconSize: iconSize, iconAnchor: iconAnchor, popupAnchor: [0,0] } );
  }
}



class FixedMarker extends L.Marker
{
  constructor( pos = [0.0, 0.0], { iconUrl = 'icons/leaflet/building_symbol.png', iconSize = [32,32], iconAnchor = [16,16] } = {} ) //iconUrl = 'icons/leaflet/building_symbol.png')
  {
    const symbol = new DefaultIcon({iconUrl: iconUrl, iconSize: iconSize, iconAnchor: iconAnchor});
	super(pos, {icon: symbol});
/*
shoreMarker01.addTo(map);
shoreMarker01.setOpacity( 1.0 );
shoreMarker01.setRotationOrigin("center");
shoreMarker01.setRotationAngle(0);
let shore01HtmlString = '<div style="font-size:10px;line-height:100%;">';
shore01HtmlString += 'Västby Hamnförening<br>Web site: <a href="https://www.vastbyhamn.com">https://www.vastbyhamn.com</a><br>Position:' + '<br>' ;
shore01HtmlString += 'Lat: ' + shorePos01[0].toString() + '\u00B0' + '<br>' ;
shore01HtmlString += 'Lon: ' + shorePos01[1].toString() + '\u00B0' ;  //Disp.jsonToTable(contentJson, {});
const shore01ImageUrl = 'images/leaflet/' + 'shore_01_image.png' ;
shore01HtmlString += '<br><br>' + '<img src="' + shore01ImageUrl + '"/>';
if (!isTouchDevice) shoreMarker01.bindTooltip(shore01HtmlString);
else shoreMarker01.bindPopup(shore01HtmlString, {closeOnClick: true, autoClose: false});
*/
  }
}

/*
class MobileMarker extends FixedMarker
{
  constructor(pos = [0.0, 0.0], iconUrl = 'icons/leaflet/land_vehicle_symbol.png')
  {
	super(pos, {icon: symbol})
*/

class WindBarbs //extends L.Marker
{

  #lowerBounds = [0, 1, 3, 8, 13, 18, 23, 28, 33, 38, 43];
  #dirUrl = 'icons/leaflet/';
  #namePrepend = '';
  #nameAppend = '_kt';
  #nameExtension = 'png';
  #size = [30,54];
  #anchor = [15,48];
  #popupAnchor = [0,0];
  #icons = {};

  constructor()
  {
    for (let index = 0; index < this.#lowerBounds.length; index++)
    {
      const boundString = this.#lowerBounds[index].toString().padStart(3, '0');
      const iconUrl = this.#dirUrl + this.#namePrepend + boundString + this.#nameAppend + '.' + this.#nameExtension ;
      this.#icons[index] = new DefaultIcon({iconUrl: iconUrl, iconSize: this.#size, iconAnchor: this.#anchor, popupAnchor: this.#popupAnchor });
    }
  }


  getIcon(windSpeed)
  {
    for (let index = this.#lowerBounds.length - 1; index >= 0; index--)
    {
      if (parseFloat(windSpeed) > parseFloat(this.#lowerBounds[index]))
      {
        return this.#icons[index];
      }
    }
    return this.#icons[this.#lowerBounds[0]];
  }


}



class SurfaceObject
{

  id = '';
  lat = 0.0;
  lon = 0.0;

  constructor( { id = null, lat = null, lon = null } = {} )
  {
    this.id = id;
	this.lat = lat;
	this.lon = lon;
  }

}



class OwnSurfaceObject extends SurfaceObject
{

  id = '99999';
  lat = 0.0;
  lon = 0.0;

  constructor( { lat = 0.0, lon = 0.0 } = {} )
  {
	super( { id: '99999', lat: null, lon: null } );

    this.id = id;
	this.lat = lat;
	this.lon = lon;
  }

}



class SpaceObject extends SurfaceObject
{
  constructor( { id = '', pos = [0.0, 0.0], alt = 0.0 } = {} )
  {
    super( { id: id, pos: pos } );
    this.alt = alt;
  }

}



class AisData
{

  constructor()
  {
    this.OWN_ZOOM_LEVEL = null;
    this.OWN_POSITION_AVAILABLE = false;
    this.OWN_POSITION_FOLLOW = false;
    this.OWN_LOCATION_COORDS = {};
    this.OWN_LOCATION_POS = [];
    this.OWN_LOCATION_ACCURACY = null;
    this.OWN_LOCATION_ALTITUDE = null;
    this.OWN_LOCATION_ALTITUDE_ACCURACY = null;
    this.OWN_LOCATION_SPEED = null;
    this.OWN_LOCATION_HEADING = null;
    this.OWN_USER_ID = null;
    this.OWN_DATA_CHANNEL = null;
    this.OWN_DATA_IMAGE_BYTES = null;
    this.GET_ALL_AND_IMAGES = false;
    this.ALL_POS_ARRAY = [];
    this.ALL_TIME_ARRAY = [];
    this.ALL_MMSI_ARRAY = [];
    this.ID_ARRAY = [];
    this.POS_ARRAY = [];
    this.MMSI_ARRAY = [];
    this.MARKER_ARRAY = [];
    this.WIND_DIR_ARRAY = [];
    this.WIND_SPEED_ARRAY = [];
    this.AIR_TEMP_ARRAY = [];
    this.WATER_TEMP_ARRAY = [];
    this.WAVE_HEIGHT_ARRAY = [];
    this.SPEED_ARRAY = [];
    this.COURSE_ARRAY = [];
    this.TEXT_ARRAY = [];
    this.TIME_ARRAY = [];
  }


}



class OverlayButton
{

  #id = "" ;
  #sizePos = {};
  #text = "" ;
  #isToggle = false ;

  #button = {};

  constructor({id = null, sizePos = null, text = null, isToggle = null} = {})
  {
    if (id === null) id = "overlay_button" ;
    if (sizePos === null) sizePos = {"h": 40, "w": 120, "x": 5, "y": 5};
    if (text === null) text = "Overlay button" ;
    if (isToggle === null) isToggle = false ;

    this.#id = id ;
    this.#sizePos = sizePos ;
    this.#text = text ;
    this.#isToggle = isToggle ;

    const div = document.createElement("DIV");
    document.body.appendChild(div);
    this.#button = document.createElement("BUTTON");
    div.appendChild(this.#button);
    this.#button.id = this.id ;

    ElementProps.set( this.#button.style, { "position": "absolute", "padding": "0px", "z-index": "400" , "color": ElementProps.rgbaLiteral([0,0,0,255]), "backgroundColor": ElementProps.rgbaLiteral([127,127,127,63]) } ) ;
    ElementProps.set( this.#button.style, this.#getSizePosStyle() ) ;

    let self = this;

    this.#button.addEventListener("click", function(){ self.#handleClick(); } ) ;
  }

  #getSizePosStyle()
  {
    let sizePosStyle = {};
    sizePosStyle["height"] = ElementProps.pxLiteral( GetSafe.byKey(this.#sizePos, "h", 40) ) ;
    sizePosStyle["width"] = ElementProps.pxLiteral( GetSafe.byKey(this.#sizePos, "w", 120) ) ;
    sizePosStyle["right"] = ElementProps.pxLiteral( GetSafe.byKey(this.#sizePos, "x", 5) ) ;
    sizePosStyle["top"] = ElementProps.pxLiteral( GetSafe.byKey(this.#sizePos, "y", 5) ) ;
    return sizePosStyle;
  }

  #handleClick()
  {
    let self = this ;
  }

  updateDesign()
  {
    const text = document.createTextNode(this.#text);
    this.#button.appendChild(text);
  }

  get id() { return this.#id; }
  get sizePos() { return this.#sizePos; }
  get text() { return this.#text; }
  get isToggle() { return this.#isToggle; }
  get button() { return this.#button; }

}



class ImageOverlayButton extends OverlayButton
{

  #relImageUrl = "" ;

  constructor({id = null, sizePos = null, text = null, isToggle = null, relImageUrl = null} = {})
  {
    if (id === null) id = "image_overlay_button" ;
    if (text === null) text = "Image button" ;

    super( {id: id, sizePos: sizePos, text: text, isToggle: isToggle} ) ;

    if (relImageUrl === null) relImageUrl = 'icons/leaflet/' + 'danger_over_symbol.png' ;

    this.#relImageUrl = relImageUrl;

    let self = this ;
  }

  #getImgHeightPx()
  {
    return ElementProps.pxLiteral( Math.trunc( GetSafe.byKey(this.sizePos, "h", 40) * 0.7 ) );
  }

  updateDesign()
  {
    const div = document.createElement("DIV");
    this.button.appendChild(div);
    const img = document.createElement("IMG");
    div.appendChild(img);
    img.src = this.#relImageUrl;
    ElementProps.set( img.style, { "height": this.#getImgHeightPx(), "vertical-align": "middle", "margin-left": "-5px" , "margin-right": "5px" } );
    const span = document.createElement("SPAN");
    div.appendChild(span);
    span.textContent = this.text;
  }


}


/*
class ToggleImageOverlayButton extends ImageOverlayButton
{

  constructor({buttonId = null, buttonSizePos = null, buttonText = null, relImageUrl = null} = {})
  {
    super( {buttonId: buttonId, buttonSizePos: buttonSizePos, buttonText: buttonText, isToggle: true, relImageUrl: relImageUrl} );

    let self = this;
  }

}
*/


class IdInput
{

  constructor({idButtonStyle = {}, idButtonText = '', idInputDescription = '', idInfoDescription = '', cookieInfoDescription = '', idIsAvailable = false, idNotAvailablePreambleText = '', idNotFoundPreambleText = '', idFoundPreambleText = '', idStoredPreambleText = ''} = {})
  {
    let self = this;

    self.idButtonStyle = idButtonStyle;
    self.idButtonText = idButtonText;
    self.idInputDescription = idInputDescription;
    self.idInfoDescription = idInfoDescription;
    self.cookieInfoDescription = cookieInfoDescription;
    self.idIsAvailable = idIsAvailable;
    self.idNotAvailablePreambleText = idNotAvailablePreambleText;
    self.idNotFoundPreambleText = idNotFoundPreambleText;
    self.idFoundPreambleText = idFoundPreambleText;
    self.idStoredPreambleText = idStoredPreambleText;

    let shareDiv = document.createElement("DIV");
    document.body.appendChild(shareDiv);
    //ElementProps.set( shareDiv.style, { "position": "relative" } );
    self.shareButton = document.createElement("BUTTON");
    shareDiv.appendChild(self.shareButton);
    self.shareButton.id = "share_button";
    ElementProps.set( self.shareButton.style, self.idButtonStyle ) ;

    self.shareButton.addEventListener("click", function(){ self.createDialog(self.idIsAvailable, self.idNotAvailablePreambleText, self.idNotFoundPreambleText, self.idFoundPreambleText, self.idStoredPreambleText); } );
    let shareButtonText = document.createTextNode(self.idButtonText);
    self.shareButton.appendChild(shareButtonText);
    self.cookieValue = Cookie.get("mariex_user_id");
/*
    Ais.OWN_USER_ID = cookieValue;
if (Ais.OWN_POSITION_AVAILABLE && cookieValue !== null)
{
  this.shareButton.innerText = "Identified as " + Ais.OWN_USER_ID;
  ElementProps.set( this.shareButton.style, { "color": ElementProps.rgbaLiteral([127,127,0,255]), "backgroundColor": ElementProps.rgbaLiteral([127,127,0,63]) } ) ;
}
else if (Ais.OWN_LOCATION_POS.length === 2)
{
  this.shareButton.innerText = "Sharing position anonymously" ;
  ElementProps.set( this.shareButton.style, { "color": ElementProps.rgbaLiteral([0,0,0,255]), "backgroundColor": ElementProps.rgbaLiteral([127,127,127,63]) } );
}
*/
  }

  getId()
  {
    return this.ownUserId;
  }

  getShareButton()
  {
    return this.shareButton;
  }

  getCookieValue()
  {
    return this.cookieValue;
  }

  setId(ownUserId = "")
  {
    this.ownUserId = ownUserId;
  }

  setIdIsAvailable(idIsAvailable = false)
  {
    this.idIsAvailable = idIsAvailable;
  }

  setNotAvailableLabel()
  {
    this.shareButton.innerHTML = this.idNotAvailablePreambleText;
    ElementProps.set( this.shareButton.style, { "color": ElementProps.rgbaLiteral([0,0,0,255]), "backgroundColor": ElementProps.rgbaLiteral([127,0,0,63]) } );
  }

  setNotFoundLabel()
  {
    this.shareButton.innerText = this.idNotFoundPreambleText;   //"Sharing position anonymously";
    ElementProps.set( shareButton.style, { "color": ElementProps.rgbaLiteral([0,0,0,255]), "backgroundColor": ElementProps.rgbaLiteral([127,127,127,63]) } );
  }

  setFoundLabel(userId)
  {
    this.shareButton.innerText = this.idFoundPreambleText + userId;
    ElementProps.set( this.shareButton.style, { "color": ElementProps.rgbaLiteral([127,127,0,255]), "backgroundColor": ElementProps.rgbaLiteral([127,127,0,63]) } ) ;
  }

  setStoredLabel(userId)
  {
    this.shareButton.innerText = this.idStoredPreambleText + userId;
    ElementProps.set( this.shareButton.style, { "color": ElementProps.rgbaLiteral([0,127,0,255]), "backgroundColor": ElementProps.rgbaLiteral([0,127,0,63]) } ) ;
  }

  createDialog(idIsAvailable, idNotAvailablePreambleText, idNotFoundPreambleText, idFoundPreambleText, idStoredPreambleText)
  {
    let self = this;

    let idDialog = document.createElement("DIALOG");
    document.body.appendChild(idDialog);
    dialogPolyfill.registerDialog(idDialog);
    let dialogDiv = document.createElement("DIV");
    idDialog.appendChild(dialogDiv);

    let descriptionDiv = document.createElement("DIV");
    ElementProps.set( descriptionDiv.style, {"position": "relative"} );
    descriptionDiv.innerHTML = this.idInputDescription;
    dialogDiv.appendChild(descriptionDiv);

    let idInput = document.createElement("INPUT");
    let idInfoButton = document.createElement("BUTTON");
    let idDiv = document.createElement("DIV");
    ElementProps.set( idDiv.style, {"position": "relative", "top": "10px", "width": "100%"} );
    idDiv.appendChild(idInput);
    ElementProps.set( idInput.style, {} );
    self.cookieValue = Cookie.get("mariex_user_id");
    if (typeof self.cookieValue !== 'undefined' && self.cookieValue !== null && self.cookieValue !== "") this.ownUserId = self.cookieValue;
    if (typeof self.ownUserId !== 'undefined' && self.ownUserId !== null && self.ownUserId !== "") this.ownUserId = self.ownUserId;
    if (typeof this.ownUserId === 'undefined' || this.ownUserId === null || this.ownUserId === "") ElementProps.set( idInput, {"placeholder": "My user ID"} );
    else ElementProps.set( idInput, {"value": this.ownUserId} );
    idDiv.appendChild(idInfoButton);
    ElementProps.set( idInfoButton.style, {"height": "30px", "width": "30px", "border-radius": "50%", "border": "1px solid #000", "margin-left": "20px", "padding": "0px"} );
    idInfoButton.addEventListener("click", idInfo);
    let idInfoButtonText = document.createTextNode("i");
    idInfoButton.appendChild(idInfoButtonText);
    dialogDiv.appendChild(idDiv);

    let submitButton = document.createElement("BUTTON");
    let cancelButton = document.createElement("BUTTON");
    let storeCookieCheck = document.createElement("INPUT");
    let storeCookieLabel = document.createElement('LABEL');
    let cookieInfoButton = document.createElement("BUTTON");
    let idButtonDiv = document.createElement("DIV");
    ElementProps.set( idButtonDiv.style, {"position": "relative", "top": "30px"} );
    idButtonDiv.appendChild(submitButton);
    ElementProps.set( submitButton.style, {"padding": "10px"} );
    idButtonDiv.appendChild(cancelButton);
    ElementProps.set( cancelButton.style, {"padding": "10px", "margin-left": "10px"} );
    idButtonDiv.appendChild(storeCookieCheck);
    ElementProps.set( storeCookieCheck, {"id": "store_cookie_check", "type": "checkbox", "checked": "true"} );
    ElementProps.set( storeCookieCheck.style, {"padding": "10px", "margin-left": "15px"} );
    idButtonDiv.appendChild(storeCookieLabel);
    ElementProps.set( storeCookieLabel, {"htmlFor": "store_cookie_check", "innerText": "Set cookie"} );
    ElementProps.set( storeCookieLabel.style, {"margin-left": "5px"} );
    idButtonDiv.appendChild(cookieInfoButton);
    ElementProps.set( cookieInfoButton.style, {"height": "30px", "width": "30px", "border-radius": "50%", "border": "1px solid #000", "margin-left": "5px", "padding": "0px", "position": "absolute", "top": "50%", "-ms-transform": "translateY(-50%)", "transform": "translateY(-50%)"} );
    submitButton.addEventListener("click", submitData);
    cancelButton.addEventListener("click", cancel);
    cookieInfoButton.addEventListener("click", cookieInfo);
    let submitButtonText = document.createTextNode("Submit");
    submitButton.appendChild(submitButtonText);
    let cancelButtonText = document.createTextNode("Cancel");
    cancelButton.appendChild(cancelButtonText);
    let cookieInfoButtonText = document.createTextNode("i");
    cookieInfoButton.appendChild(cookieInfoButtonText);
    dialogDiv.appendChild(idButtonDiv);

    ElementProps.set( dialogDiv.style, {"position": "relative", "top": "-25px"} ); //"overflow-y": "auto",

    idDialog.showModal();

    window.scrollTo(0, 0);

    function submitData()
    {
      //Are these really necessary? No setting in this dialog can disable positioning.
      if (!idIsAvailable) self.shareButton.innerText = idNotAvailablePreambleText;
      ElementProps.set( self.shareButton.style, { "color": ElementProps.rgbaLiteral([0,0,0,255]), "backgroundColor": ElementProps.rgbaLiteral([127,127,127,63]) } );

      self.ownUserId = idInput.value ;
      if ( self.idIsAvailable && ( !storeCookieCheck.checked || self.ownUserId === null || self.ownUserId === "" ) ) //Ais.OWN_POSITION_AVAILABLE
      {
        Cookie.set("mariex_user_id", "", 1000);
        self.cookieValue = "";
        self.shareButton.innerText = idNotFoundPreambleText; //"Sharing position anonymously";
        ElementProps.set( self.shareButton.style, { "color": ElementProps.rgbaLiteral([0,0,0,255]), "backgroundColor": ElementProps.rgbaLiteral([127,127,127,63]) } );
      }
      if ( self.idIsAvailable && !storeCookieCheck.checked && self.ownUserId !== null && self.ownUserId !== "" ) //Ais.OWN_POSITION_AVAILABLE
      {
        self.shareButton.innerText = idFoundPreambleText + self.ownUserId; //"Identified as "
        ElementProps.set( self.shareButton.style, { "color": ElementProps.rgbaLiteral([127,127,0,255]), "backgroundColor": ElementProps.rgbaLiteral([127,127,0,63]) } ) ;
      }
      if (storeCookieCheck.checked && self.ownUserId !== null && self.ownUserId !== "")
      {
        Cookie.set("mariex_user_id", idInput.value, 1000);
        self.cookieValue = idInput.value;
        if (self.idIsAvailable)
        {
          self.shareButton.innerText = idStoredPreambleText + self.ownUserId; //"Device recognized as "
          ElementProps.set( self.shareButton.style, { "color": ElementProps.rgbaLiteral([0,127,0,255]), "backgroundColor": ElementProps.rgbaLiteral([0,127,0,63]) } ) ;
        }
      }

      idDialog.close();

      //async function
      //const userIdExistsResponse = await fetch( 'https://labremote.net/client/user_id_exists.php', { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: new URLSearchParams({'module_address': Ais.OWN_USER_ID}) } );
      //let newChannelData = null;
      //try
      //{
      //  newChannelData = await userIdExistsResponse.json();
      //  Ais.OWN_DATA_CHANNEL = newChannelData["new_channel_index"];
      //}
      //catch(e)
      //{
      //}
    }

    function cancel()
    {
      idDialog.close();
    }

    function idInfo()
    {
      window.alert(idInfoDescription)
    }

    function cookieInfo()
    {
      window.alert(cookieInfoDescription)
    }

  }

}