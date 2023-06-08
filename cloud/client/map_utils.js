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

    this.setOpacity( 1.0 );
    this.setRotationOrigin("center");
    this.setRotationAngle(0);
  }

}

class InfoMarker extends FixedMarker
{
  #htmlString = "";

  constructor( pos = [0.0, 0.0], { iconUrl = 'icons/leaflet/building_symbol.png', iconSize = [32,32], iconAnchor = [16,16] } = {}, { imageUrl = "", htmlLabel = "", linkUrl = "" } = {} ) //iconUrl = 'icons/leaflet/building_symbol.png')
  {
	  super( pos, { iconUrl: iconUrl, iconSize: iconSize, iconAnchor: iconAnchor } )

    this.#htmlString = '<div style="font-size:10px;line-height:100%;">';
    this.#htmlString += htmlLabel;
    if (linkUrl) this.#htmlString += '<br>Web site: <a href="' + linkUrl + '">' + linkUrl + '</a>' ;
    this.#htmlString += '<br>Position: lat: ' + pos[0].toString() + '\u00B0' + ', ' ;
    this.#htmlString += 'lon: ' + pos[1].toString() + '\u00B0' ;  //Disp.jsonToTable(contentJson, {});
    this.#htmlString += '<br><br>' + '<img src="' + imageUrl + '"/>';
  }

  usePopup()
  {
    this.bindPopup( this.#htmlString, {closeOnClick: true, autoClose: false} );
  }

  useTooltip()
  {
    this.bindTooltip(this.#htmlString);
  }

}


class MobileMarker extends FixedMarker
{
  constructor(pos = [0.0, 0.0], iconUrl = 'icons/leaflet/land_vehicle_symbol.png')
  {
	  super(pos, {iconUrl: iconUrl});
  }

  setPosition() {}
}


class WindBarbs //extends (L.Marker) FixedMarker? MobileMarker? Fartyg t ex?
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
    this.ALL_CHANNEL_ARRAY = [];
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
    this.HEADING_ARRAY = [];
    this.TEXT_ARRAY = [];
    this.TIME_ARRAY = [];
    this.STATUS_ARRAY = [];
  }


}



class MapContainer //extends L.Map
{
  #DEFAULT_ID = "map_id" ;
  #DEFAULT_ATTRIBUTION = true;

  #id = "";
  #attribution = true;

  #map = {};

  constructor( { id = null, attribution = null } = {} )
  {
    if (id === null) id = this.#DEFAULT_ID ;
    if (attribution === null) attribution = this.#DEFAULT_ATTRIBUTION;

    this.#id = id;
    this.#attribution = attribution;

    this.#map = new L.Map('map', {attributionControl: this.#attribution}); // L.map('mapid').setView([51.505, -0.09], 13);
  }

  get map() { return this.#map; }

}


class ChartContainer extends MapContainer
{
  #DEFAULT_CENTER = [62.827, 17.875];
  #DEFAULT_ZOOM = 12;

  #center = [];
  #zoom = 0;

  constructor( { id = null, center = null, zoom = null, attribution = null } = {} )
  {
    super( {id: id, attribution: attribution} ) ;

    if (center === null) center = this.#DEFAULT_CENTER;
    if (zoom === null) zoom = this.#DEFAULT_ZOOM;


    this.#center = center;
    this.#zoom = zoom;

    this.#setView();

    //const crs = new L.Proj.CRS('EPSG:32633', '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs', { origin: [-2500000.0, 9045984.0], resolutions: [21674.7100160867,10837.35500804335,5418.677504021675,2709.3387520108377,1354.6693760054188,677.3346880027094,338.6673440013547,169.33367200067735,84.66683600033868,42.33341800016934,21.16670900008467,10.583354500042335,5.291677250021167,2.6458386250105836,1.3229193125052918,0.6614596562526459,0.33072982812632296,0.16536491406316148] } );
  }

  #setView(center = this.#center, zoom = this.#zoom)
  {
    this.map.setView(center, zoom);
  }

  add(marker)
  {
    marker.addTo(this.map);
  }

  get center() { return this.#center; }

}


class OverlayButton
{
  #DEFAULT_BUTTON_ID = "button_id" ;
  #DEFAULT_SIZE_POS = {"h": 50, "w": 150, "r": 200, "t": 200} ;
  #DEFAULT_TEXT = "" ;
  #DEFAULT_DISABLED_TEXT = "Working..." ;
  #DEFAULT_DESIGN =
  {
    "enabled": {"button":{"style":{"opacity":"1.0","color":ElementProps.rgbaLiteral([0,0,0,255]),"backgroundColor":ElementProps.rgbaLiteral([127,127,127,63]),"cursor":"pointer"}},"text":{"content":this.#DEFAULT_TEXT,"style":{}}},
    "disabled": {"button":{"style":{"opacity":"0.5"}},"text":{"content":this.#DEFAULT_DISABLED_TEXT,"style":{}}},
    "toggled": {"button":{"style":{"opacity":"1.0","color":ElementProps.rgbaLiteral([0,127,0,255]),"backgroundColor":ElementProps.rgbaLiteral([0,127,0,63]),"cursor":"pointer"}},"text":{"content":this.#DEFAULT_TEXT,"style":{}}}
  } ;
  //#DEFAULT_DISABLED_DESIGN = { "text": {"content":this.#DEFAULT_DISABLED_TEXT, "style":{}} } ;

  #id = "" ;
  #sizePos = {};
  //#text = "" ;
  //#disabledText = "" ;
  #design = {};
  //#disabledDesign = {};

  #button = {};
  #enabled = false ;
  #clicked = false ;
  #toggled = false ;

  constructor( {id = null, sizePos = null, design = null} = {} ) // , disabledDesign = null text = null, disabledText = null} = {})
  {
    if (id === null) id = this.#DEFAULT_BUTTON_ID ;
    if (sizePos === null) sizePos = this.#DEFAULT_SIZE_POS;
    if (design === null) design = this.#DEFAULT_DESIGN;
    else
    {
      const enabledDesign = GetSafe.byKey(design, "enabled", this.#DEFAULT_DESIGN["enabled"]) ;
      this.#DEFAULT_DESIGN["enabled"]["button"] = {...this.#DEFAULT_DESIGN["enabled"]["button"], ...GetSafe.byKey(enabledDesign, "button", this.#DEFAULT_DESIGN["enabled"]["button"]) } ; // A button design is always necessary
      this.#DEFAULT_DESIGN["disabled"] = this.#DEFAULT_DESIGN["enabled"] ; // If a design is present for the enabled state, it is preferred over the static default
      this.#DEFAULT_DESIGN["toggled"] = this.#DEFAULT_DESIGN["enabled"] ; // If a design is present for the enabled state, it is preferred over the static default
    }

    //if (disabledDesign === null) disabledDesign = this.#DEFAULT_DISABLED_DESIGN;
    //if (text === null) text = this.#DEFAULT_TEXT ;
    //if (disabledText === null) disabledText = this.#DEFAULT_DISABLED_TEXT ;

    this.#id = id ;
    this.#sizePos = sizePos ;
    this.#design = design ;
    //this.#disabledDesign = disabledDesign ;
    //this.#text = text ;
    //this.#disabledText = disabledText ;

    this.#button = document.createElement("BUTTON");
    this.#enabled = true ;
    this.#clicked = false ;
    this.#toggled = false ;

    const div = document.createElement("DIV");
    document.body.appendChild(div);
    div.appendChild(this.#button);
    this.#button.id = this.id ;
    ElementProps.set( this.#button.style, { "position": "absolute", "padding": "0px", "z-index": "400" , "color": ElementProps.rgbaLiteral([0,0,0,255]), "backgroundColor": ElementProps.rgbaLiteral([127,127,127,63]) } ) ;
    ElementProps.set( this.#button.style, this.#getSizePosStyle() ) ;
    ElementProps.set( this.#button.style, this.#getDesignButtonStyle("enabled") ) ;

    let self = this;
    this.#button.addEventListener("click", function(){ self.#handleClick(); } ) ;
  }

  #getSizePosStyle()
  {
    let sizePosStyle = {};
    const height = GetSafe.byKey(this.#sizePos, "h");
    if (height !== null) sizePosStyle["height"] = ElementProps.pxLiteral(height) ;
    sizePosStyle["width"] = ElementProps.pxLiteral( GetSafe.byKey(this.#sizePos, "w", 120) ) ;
    const right = GetSafe.byKey(this.#sizePos, "r");
    if (right === null) sizePosStyle["left"] = ElementProps.pxLiteral( GetSafe.byKey(this.#sizePos, "l", 5) ) ;
    else sizePosStyle["right"] = ElementProps.pxLiteral(right) ;
    const top = GetSafe.byKey(this.#sizePos, "t");
    if (top === null) sizePosStyle["bottom"] = ElementProps.pxLiteral( GetSafe.byKey(this.#sizePos, "b", 5) ) ;
    else sizePosStyle["top"] = ElementProps.pxLiteral(top) ;
    return sizePosStyle;
  }

  #getDesignButtonStyle(state)
  {
    const stateDesign = GetSafe.byKey(this.#design, state, this.#DEFAULT_DESIGN[state]) ;
    const stateButton = GetSafe.byKey(stateDesign, "button", this.#DEFAULT_DESIGN[state]["button"]) ;
    const buttonStyle = GetSafe.byKey(stateButton, "style", this.#DEFAULT_DESIGN[state]["button"]["style"]) ;
    return buttonStyle;
  }

  #handleClick()
  {
    this.#updateFlags();
    this.#enabled = false;
    this.updateAppearance(this.#design, "disabled");
    this.clickAction();
    this.#enabled = true;
  }

  #updateFlags()
  {
	this.#clicked = true;
	if (!this.#toggled) this.#toggled = true;
    else this.#toggled = false;
    this.#button.disabled = true;
  }

  clearDiv()
  {
    Html.removeAllElements(this.#button, ["DIV"]);
  }

  updateButton(state = "enabled")
  {
    //const stateButton = GetSafe.byKey(designState, "button", this.#DEFAULT_DESIGN[state]["button"]) ;
    //const buttonStyle = GetSafe.byKey(stateButton, "style", this.#DEFAULT_DESIGN[state]["button"]["style"]) ;
    ElementProps.set( this.#button.style, this.#getDesignButtonStyle(state) ) ;
  }

  updateDiv()
  {
    this.clearDiv();
    const div = document.createElement("DIV");
    ElementProps.set( div.style, { "position": "relative", "display": "flex", "alignItems": "center" } ) ;
    this.#button.appendChild(div);
    return div;
  }

  updateText(designState = this.#DEFAULT_DESIGN["enabled"])
  {
    const text = GetSafe.byKey(designState, "text", this.#DEFAULT_DESIGN["enabled"]["text"]);
    const textContent = GetSafe.byKey(text, "content", this.#DEFAULT_DESIGN["enabled"]["text"]["content"]);
    Html.removeAllElements(this.#button, ["SPAN"]);
    const spanElement = document.createElement("SPAN");
    this.#button.appendChild(spanElement);
    spanElement.textContent = textContent;
    return spanElement;
  }

  updateAppearance(design = this.#design, state = null) //text = this.text
  {
    this.#button.disabled = !this.#enabled;
    this.clearDiv(this.button);
    if (state === null) state = (this.#toggled ? "toggled" : null) ;
    if (state === null) state = (this.#enabled ? "enabled" : "disabled") ;
    const stateDesign = GetSafe.byKey(design, state, this.#DEFAULT_DESIGN[state]) ;
    const span = this.updateText(stateDesign);
    const div = this.updateDiv();
    div.appendChild(span);
    this.updateButton(state);
  }

  clickAction()
  {
  }

  resetClicked()
  {
	this.#clicked = false;
  }

  get id() { return this.#id; }
  get sizePos() { return this.#sizePos; }
  //get text() { return this.#design["text"]["content"]; }
  get button() { return this.#button; }
  get enabled() { return this.#enabled; }
  get clicked() { return this.#clicked; }
  get toggled() { return this.#toggled; }
}



class ImageOverlayButton extends OverlayButton
{
  #DEFAULT_IMG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAABelBMVEUAAACAgICAgICSkpKAgICAgICOjo6AgICJiYmAgICIiIiHh4eWlpaAgICAgICFhYWAgICFhYWAgICEhISAgICEhISAgICAgICAgICAgICVlZWCgoKCgoKAgICAgICAgICBgYGBgYGAgICAgICAgICBgYGAgICBgYGAgICBgYGAgICBgYGAgICBgYGBgYGAgICBgYGAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICSkpKAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQkJCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIB/f3+AgICBgYGCgoKDg4OEhISFhYWGhoaHh4eIiIiJiYmKioqLi4uMjIyNjY2Ojo6Pj4+QoWs7AAAAbXRSTlMAAgQEBggJDA0ODxEREhQXGBkaGxwfIiQqMDM1NzpCRkdJSkxYXV5jZmdwd3h5e3x9gYKEiImKjJGSlJWWmJmdnqKkp6iqsLi5uru8vcDBwsTFxszS1Nna3N3d3uDh5Ofq7O7w8fL19/n6+/3+XfghRAAAAhdJREFUGBmFwQkjVFEAhuFXhKK02FJp1UJpUbRQpkJpX0SopIUx0zdMZMt/j3PuuXOXg+chrfFi7/Ox6ezs9Mend9qOsqumG58UM3Klnp0cy+SUkhtoZjuHM3l55TMH8brwQ9uaOkdaeb92ku8mqeqZdjFYScy+94qoxVlQyXA5ERXPFFohplahQSL65fwhZUNOF6HzcvBZUiB3msCh7wrg80+hr/uxHiuAz7IiejCOK4DPkqKyDWwZlDWOR1Fx99jUlJeFx7ycooyZGuCmLDwKckDWJWBMFmkKAasyXkGjLNIUYouMuWouyiJFTgFD1hl6ZZEkZwFrTUYnL2QUSZCziCMjw4QMEuQsE5LxlmkZxMlZo0TGCLMyiHogZ5wIGZ+ZlUHEupwWomRM8k0GJStyiJPxgTEZyzhLckiQ8ZqnsggU5ZDQIqOfu7Kw5uWQJKuDNlkYBTmkyGrliKx5NilEmoyZShiRBShEmqwh4KqsInIKeMhqA+rnlLCAh6yfVWx6pLhFPOZl3WJLc05RK3isyvpVh9GniDU8NhS4hnVgStJvGeN4/FVgtJzA2bwcPORkTxLqVqhAwqJC7ZSUDSiihZKCSvqI2jusuOLK+pLinhBX8US7eLiHhLKunHYw247HqS/a1ugJvKp7svL6db2c7TTcn1HKz9t17KTm8susImaG2qrYVdWZzsy7kcmJD2/6O1orSfkPRO0FC/ZwR/UAAAAASUVORK5CYII=";
  #DEFAULT_DISABLED_IMG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR42mMAAQAABQABoIJXOQAAAABJRU5ErkJggg==";
  #DEFAULT_DESIGN =
  {
    "enabled": {"img":{"content":this.#DEFAULT_IMG,"style":{}}},
    "disabled": {"img":{"content":this.#DEFAULT_DISABLED_IMG,"style":{}}},
    "toggled": {"img":{"content":this.#DEFAULT_IMG,"style":{}}}
  } ;
  //#DEFAULT_DISABLED_DESIGN = { "text": {"content":"Overlay button", "style":{}}, "img": {"content":this.#DEFAULT_DISABLED_IMG, "style":{}} } ;

  #design = {};
  //#disabledDesign = {};
  //#imgSrc = "" ;

  constructor( {id = null, sizePos = null, design = null} = {} ) //text = null, disabledText = null, imgSrc = null} = {})
  {
    super( {id: id, sizePos: sizePos, design: design} ) ; //text: text, disabledText: disabledText} ) ;

    if (design === null) design = this.#DEFAULT_DESIGN;
    else
    {
      const enabledDesign = GetSafe.byKey(design, "enabled", this.#DEFAULT_DESIGN["enabled"]) ;
      this.#DEFAULT_DESIGN["enabled"]["button"] = {...this.#DEFAULT_DESIGN["enabled"]["button"], ...GetSafe.byKey(enabledDesign, "button", this.#DEFAULT_DESIGN["enabled"]["button"]) } ; // A button design is always necessary, if left out a static default is maintained, if not it is substituted
      this.#DEFAULT_DESIGN["enabled"]["img"] = {...this.#DEFAULT_DESIGN["enabled"]["img"], ...GetSafe.byKey(enabledDesign, "img", this.#DEFAULT_DESIGN["enabled"]["img"]) } ; // An image design is always necessary for an ImageOverlayButton. If left out a static default is maintained, if not it is substituted
      this.#DEFAULT_DESIGN["disabled"] = this.#DEFAULT_DESIGN["enabled"] ; // If a design is present for the enabled state, it is preferred over the static default
      this.#DEFAULT_DESIGN["toggled"] = this.#DEFAULT_DESIGN["enabled"] ; // If a design is present for the enabled state, it is preferred over the static default
    }
    //if (disabledDesign === null) disabledDesign = this.#DEFAULT_DISABLED_DESIGN;
    //if (imgSrc === null) imgSrc = this.#DEFAULT_IMG_SRC ;

    this.#design = design ;
    //this.#disabledDesign = disabledDesign ;
    //this.#imgSrc = imgSrc;
  }

  #getImgHeightPx()
  {
    return ElementProps.pxLiteral( Math.trunc( GetSafe.byKey(this.sizePos, "h", 40) - 2*3 ) );
  }

  #updateImage(design = this.#DEFAULT_DESIGN["enabled"])
  {
    const img = GetSafe.byKey(design, "img", this.#DEFAULT_DESIGN["enabled"]["img"]);
    const imgContent = GetSafe.byKey(img, "content", this.#DEFAULT_DESIGN["enabled"]["img"]["content"]);
    Html.removeAllElements(this.button, ["IMG"]);
    const imgElement = document.createElement("IMG");
    imgElement.src = imgContent ;
    ElementProps.set( imgElement.style, { "height": this.#getImgHeightPx(), "vertical-align": "middle", "margin-left": "2px" , "margin-right": "2px" } );
    return imgElement
  }

  updateAppearance(design = this.#design, state = null) //text = this.text, imgSrc = this.#imgSrc)
  {
    this.button.disabled = !this.enabled;
    this.clearDiv(this.button);
    if (state === null) state = (this.toggled ? "toggled" : null) ;
    if (state === null) state = (this.enabled ? "enabled" : "disabled") ;
    const stateDesign = GetSafe.byKey(design, state, this.#DEFAULT_DESIGN[state]) ;
    const span = this.updateText(stateDesign);
    const img = this.#updateImage(stateDesign);
    const div = this.updateDiv();
    div.appendChild(img);
    div.appendChild(span);
    this.updateButton(state);
  }

}


class OpenUrlImageOverlayButton extends ImageOverlayButton
{
  #DEFAULT_OPEN_URL = "https://gustavsvik.eu";

  #openUrl = "" ;

  constructor( {id = null, sizePos = null, design = null, openUrl = null} = {} ) //text = null, disabledText = null, imgSrc = null, openUrl = null} = {})

  {
    //const text = "" ;
    //const disabledText = "" ;

    super( {id: id, sizePos: sizePos, design: design} ) ;

    if (openUrl === null) openUrl = this.#DEFAULT_OPEN_URL ;

    this.#openUrl = openUrl;
  }

  clickAction()
  {
    window.open(this.#openUrl);
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
/*
  self.geolocationAvailable = false ;
  if('geolocation' in navigator)
  {
    self.geolocationAvailable = true;
  }
  else
  {
    self.ownPositionAvailable = false ;
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
      /*
      if (self.geolocationAvailable)
      {
        const geolocationOptions = { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 };
        navigator.geolocation.watchPosition(handleGeolocationSuccess, handleGeolocationError, geolocationOptions);
      }
      */
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