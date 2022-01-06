"use strict";


class WindBarbs
{

  constructor(lower_bounds = [0, 1, 3, 8, 13, 18, 23, 28, 33, 38], dir_url = 'icons/leaflet/', name_prepend = '', name_append = '_kt', name_extension = 'png', size = [30,54], anchor = [15,48], popup_anchor = [0,0])
  {
    this.lower_bounds = lower_bounds;
	this.dir_url = dir_url;

	this.icons = {};
    for (let index = 0; index < this.lower_bounds.length; index++)
    {
      const bound_string = this.lower_bounds[index].toString().padStart(3, '0');
      this.icons[index] = new CustomIcon({iconUrl: dir_url + name_prepend + bound_string + name_append + '.' + name_extension, iconSize: size, iconAnchor: anchor, popupAnchor: popup_anchor });
    }
  }


  get_icon(wind_speed)
  {
    for (let index = this.lower_bounds.length - 1; index >= 0; index--)
    {
      if (parseFloat(wind_speed) > parseFloat(this.lower_bounds[index]))
      {
        return this.icons[index];
      }
    }
    return this.icons[this.lower_bounds[0]];
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
    this.SPEED_ARRAY = [];
    this.COURSE_ARRAY = [];
    this.TEXT_ARRAY = [];
    this.TIME_ARRAY = [];
  }


}



class IdInput
{


  constructor({id_button_style = {}, id_button_text = '', id_input_description = '', id_info_description = '', cookie_info_description = '', id_is_available = false, id_not_available_preamble_text = '', id_not_found_preamble_text = '', id_found_preamble_text = '', id_stored_preamble_text = ''} = {})
  {
    let self = this;

    self.id_button_style = id_button_style;
    self.id_button_text = id_button_text;
    self.id_input_description = id_input_description;
    self.id_info_description = id_info_description;
    self.cookie_info_description = cookie_info_description;
    self.id_is_available = id_is_available;
    self.id_not_available_preamble_text = id_not_available_preamble_text;
    self.id_not_found_preamble_text = id_not_found_preamble_text;
    self.id_found_preamble_text = id_found_preamble_text;
    self.id_stored_preamble_text = id_stored_preamble_text;

    let share_div = document.createElement("DIV");
    document.body.appendChild(share_div);
    //Help.set_properties( share_div.style, { "position": "relative" } );
    self.share_button = document.createElement("BUTTON");
    share_div.appendChild(self.share_button);
    self.share_button.id = "share_button";
    Help.set_properties( self.share_button.style, self.id_button_style ) ;

    self.share_button.addEventListener("click", function(){ self.create_dialog(self.id_is_available, self.id_not_available_preamble_text, self.id_not_found_preamble_text, self.id_found_preamble_text, self.id_stored_preamble_text); } );
    let share_button_text = document.createTextNode(self.id_button_text);
    self.share_button.appendChild(share_button_text);
    self.cookie_value = Help.get_cookie("mariex_user_id");
/*
    Ais.OWN_USER_ID = cookie_value;
if (Ais.OWN_POSITION_AVAILABLE && cookie_value !== null)
{
  this.share_button.innerText = "Identified as " + Ais.OWN_USER_ID;
  Help.set_properties( this.share_button.style, { "color": Help.rgba_literal_from_array([127,127,0,255]), "backgroundColor": Help.rgba_literal_from_array([127,127,0,63]) } ) ;
}
else if (Ais.OWN_LOCATION_POS.length === 2)
{
  this.share_button.innerText = "Sharing position anonymously" ;
  Help.set_properties( this.share_button.style, { "color": Help.rgba_literal_from_array([0,0,0,255]), "backgroundColor": Help.rgba_literal_from_array([127,127,127,63]) } );
}
*/
  }

  get_id()
  {
    return this.own_user_id;
  }

  get_share_button()
  {
    return this.share_button;
  }

  get_cookie_value()
  {
    return this.cookie_value;
  }

  set_id(own_user_id = "")
  {
    this.own_user_id = own_user_id;
  }

  set_id_is_available(id_is_available = false)
  {
    this.id_is_available = id_is_available;
  }

  set_not_available_label()
  {
    this.share_button.innerHTML = this.id_not_available_preamble_text;
    Help.set_properties( this.share_button.style, { "color": Help.rgba_literal_from_array([0,0,0,255]), "backgroundColor": Help.rgba_literal_from_array([127,0,0,63]) } );
  }

  set_not_found_label()
  {
    this.share_button.innerText = this.id_not_found_preamble_text;   //"Sharing position anonymously";
    Help.set_properties( share_button.style, { "color": Help.rgba_literal_from_array([0,0,0,255]), "backgroundColor": Help.rgba_literal_from_array([127,127,127,63]) } );
  }

  set_found_label(user_id)
  {
    this.share_button.innerText = this.id_found_preamble_text + user_id;
    Help.set_properties( this.share_button.style, { "color": Help.rgba_literal_from_array([127,127,0,255]), "backgroundColor": Help.rgba_literal_from_array([127,127,0,63]) } ) ;
  }

  set_stored_label(user_id)
  {
    this.share_button.innerText = this.id_stored_preamble_text + user_id;
    Help.set_properties( this.share_button.style, { "color": Help.rgba_literal_from_array([0,127,0,255]), "backgroundColor": Help.rgba_literal_from_array([0,127,0,63]) } ) ;
  }

  create_dialog(id_is_available, id_not_available_preamble_text, id_not_found_preamble_text, id_found_preamble_text, id_stored_preamble_text)
  {
    let self = this;

    let id_dialog = document.createElement("DIALOG");
    document.body.appendChild(id_dialog);
    dialogPolyfill.registerDialog(id_dialog);
    let dialog_div = document.createElement("DIV");
    id_dialog.appendChild(dialog_div);

    let description_div = document.createElement("DIV");
    Help.set_properties( description_div.style, {"position": "relative"} );
    description_div.innerHTML = this.id_input_description;
    dialog_div.appendChild(description_div);

    let id_input = document.createElement("INPUT");
    let id_info_button = document.createElement("BUTTON");
    let id_div = document.createElement("DIV");
    Help.set_properties( id_div.style, {"position": "relative", "top": "10px", "width": "100%"} );
    id_div.appendChild(id_input);
    Help.set_properties( id_input.style, {} );
    self.cookie_value = Help.get_cookie("mariex_user_id");
    //if (cookie_value !== null) Ais.OWN_USER_ID = cookie_value;
    if (typeof self.cookie_value !== 'undefined' && self.cookie_value !== null && self.cookie_value !== "") this.own_user_id = self.cookie_value;
    if (typeof self.own_user_id !== 'undefined' && self.own_user_id !== null && self.own_user_id !== "") this.own_user_id = self.own_user_id;
    //if (Ais.OWN_USER_ID === null) Help.set_properties( id_input, {"placeholder": "My user ID"} );
    if (typeof this.own_user_id === 'undefined' || this.own_user_id === null || this.own_user_id === "") Help.set_properties( id_input, {"placeholder": "My user ID"} );
    //else Help.set_properties( id_input, {"value": Ais.OWN_USER_ID} );
    else Help.set_properties( id_input, {"value": this.own_user_id} );
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
      //Are these really necessary? No setting in this dialog can disable positioning.
      if (!id_is_available) self.share_button.innerText = id_not_available_preamble_text;
      Help.set_properties( self.share_button.style, { "color": Help.rgba_literal_from_array([0,0,0,255]), "backgroundColor": Help.rgba_literal_from_array([127,127,127,63]) } );

      //Ais.OWN_USER_ID = id_input.value ;
      self.own_user_id = id_input.value ;
      //if ( Ais.OWN_POSITION_AVAILABLE && ( !store_cookie_check.checked || Ais.OWN_USER_ID === null || Ais.OWN_USER_ID === "" ) )
      if ( self.id_is_available && ( !store_cookie_check.checked || self.own_user_id === null || self.own_user_id === "" ) ) //Ais.OWN_POSITION_AVAILABLE
      {
        Help.set_cookie("mariex_user_id", "", 1000);
        self.cookie_value = "";
        self.share_button.innerText = id_not_found_preamble_text; //"Sharing position anonymously";
        Help.set_properties( self.share_button.style, { "color": Help.rgba_literal_from_array([0,0,0,255]), "backgroundColor": Help.rgba_literal_from_array([127,127,127,63]) } );
      }
      //else if (Ais.OWN_USER_ID === "99999") share_button.innerText = "Sharing position anonymously";
      //if ( Ais.OWN_POSITION_AVAILABLE && !store_cookie_check.checked && Ais.OWN_USER_ID !== null && Ais.OWN_USER_ID !== "" )
      if ( self.id_is_available && !store_cookie_check.checked && self.own_user_id !== null && self.own_user_id !== "" ) //Ais.OWN_POSITION_AVAILABLE
      {
        //this.share_button.innerText = "Identified as " + Ais.OWN_USER_ID;
        self.share_button.innerText = id_found_preamble_text + self.own_user_id; //"Identified as "
        Help.set_properties( self.share_button.style, { "color": Help.rgba_literal_from_array([127,127,0,255]), "backgroundColor": Help.rgba_literal_from_array([127,127,0,63]) } ) ;
      }
      //if (store_cookie_check.checked && Ais.OWN_USER_ID !== null && Ais.OWN_USER_ID !== "")
      if (store_cookie_check.checked && self.own_user_id !== null && self.own_user_id !== "")
      {
        Help.set_cookie("mariex_user_id", id_input.value, 1000);
        self.cookie_value = id_input.value;
        if (self.id_is_available) //Ais.OWN_POSITION_AVAILABLE
        {
          //this.share_button.innerText = "Device recognized as " + Ais.OWN_USER_ID;
          self.share_button.innerText = id_stored_preamble_text + self.own_user_id; //"Device recognized as "
          Help.set_properties( self.share_button.style, { "color": Help.rgba_literal_from_array([0,127,0,255]), "backgroundColor": Help.rgba_literal_from_array([0,127,0,63]) } ) ;
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
      window.alert(id_info_description)
    }

    function cookie_info()
    {
      window.alert(cookie_info_description)
    }

  }

}