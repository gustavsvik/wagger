"use strict";



class IdInput
{


  constructor()
  {
  }


static create(description = '', id_info_description = '', cookie_info_description = '')
{
  let id_dialog = document.createElement("DIALOG");
  document.body.appendChild(id_dialog);
  dialogPolyfill.registerDialog(id_dialog);
  let dialog_div = document.createElement("DIV");
  id_dialog.appendChild(dialog_div);

  let description_div = document.createElement("DIV");
  Help.set_properties( description_div.style, {"position": "relative"} );
  description_div.innerHTML = description;
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
    window.alert(id_info_description)
  }

  function cookie_info()
  {
    window.alert(cookie_info_description)
  }

}

}