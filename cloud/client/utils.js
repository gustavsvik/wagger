"use strict";



class HttpData
{

  #baseUrl = "";
  #params = "";

  constructor(baseUrl = 'https://' + window.location.hostname + '/client/get_ais_data_records.php', params = {'channels': '154;'})
  {
	this.#baseUrl = baseUrl;
	this.#params = params;
  }

  async post()
  {
    let response = null;
    try
    {
      response = await fetch(this.#baseUrl, { method: 'POST', headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: new URLSearchParams(this.#params) });
    }
    catch(e)
    {
      console.error(e);
    }
    let data = "";
    try
    {
      data = await response.json();
      console.log(data);
    }
    catch(e)
    {
      console.error(e);
    }

    return data;
  }


}



class GetSafe
{

  static byKey(obj, key, def = null)
  {
    let val = def;
    if (obj !== null)
    {
      if (key in obj) val = obj[key];
    }
    return val;
  }

  static json(json_string)
  {
    let json = null;
    try
    {
      json = JSON.parse(json_string);
    }
    catch(e)
    {
    }
    return json;
  }

}



class Device
{

  static isTouch()
  {
    return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
  }

}



class ElementProps
{

  static set(elem, prop_object)
  {
    for (let _prop in prop_object) elem[_prop] = prop_object[_prop];
  }

  static rgbaArray(color)
  {
    let rgb = [];;
    if (color.search(/rgb/) !== -1) rgb = color.match(/([0-9]+\.?[0-9]*)/g);
    if (rgb.length === 3) rgb.push(1);
    for (let i = 0; i < rgb.length; i++) rgb[i] = parseInt(rgb[i], 10);
    rgb[3] *= 255;

    return rgb;
  }

  static rgbaLiteral( rgba_array )
  {
    return "rgba(" + rgba_array[0].toString() + "," + rgba_array[1].toString() + "," + rgba_array[2].toString() + "," + (rgba_array[3]/255).toString() + ")";
  }

  static pxLiteral( noOfPixels = 0 )
  {
	return noOfPixels.toString() + "px";
  }

}



class Cookie
{

  constructor()
  {
  }

  static set(name, val = null, days = null, path = '/')
  {
    let setval = "";
    if (val !== null) setval = val;
    let expires = new Date(0).toUTCString();
    if (days !== null) expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(setval) + '; expires=' + expires + '; path=' + path + '; SameSite=Strict' ;
  }

  static get(name)
  {
    const cookie_parts = document.cookie.split('; ');
    let all_keys_array = [];
    let all_values_array = [];
    for (let pair_counter = 0; pair_counter < cookie_parts.length; pair_counter++)
    {
      const key_value_pair = cookie_parts[pair_counter].split('=');
      all_keys_array.push(key_value_pair[0]);
      all_values_array.push(key_value_pair[1]);
    }
    const name_index = all_keys_array.indexOf(name);
    if (name_index > -1) return all_values_array[name_index];
    else return null;
  }

}



class Transform
{

  static delimitedStringToArrays(data, field_length)
  {
    let _json_string = null;
    if (data === null || typeof data === 'undefined' || data === "") _json_string = "";
    else _json_string = data.returnstring;

    let _json_array = _json_string.split(";");
    let _no_of_channels = (_json_array.length - 1) / 2;
    let _channel_string = "";
    let _channel_data = "";
    let _channel_data_array = _channel_data.split(",");
    let _timestamp_matrix = [];
    let _value_matrix = [];
    let _bytestring_matrix = [];

    if (typeof field_length === 'undefined') field_length = 4;
    for (let _channel_index = 0; _channel_index < _no_of_channels; _channel_index++)
    {
      _channel_string = _json_array[_channel_index*2];
      _channel_data = _json_array[_channel_index*2 + 1];
      _channel_data_array = _channel_data.split(",");
      let _field_data_array_length = (_channel_data_array.length - 1)/field_length - 0 ;

      let _timestamp_array = [];
      let _value_array = [];
      let _subsamples_string_array = [];
      let _base64_string_array = [];
      for (let _sample_index = 0; _sample_index < _field_data_array_length ; _sample_index++)
      {
        _timestamp_array[_sample_index] = parseInt( _channel_data_array[_sample_index*4+0] );
        _value_array[_sample_index] = parseFloat(_channel_data_array[_sample_index*4+1]);
        _base64_string_array[_sample_index] = _channel_data_array[_sample_index*4+3];
      }
      _timestamp_matrix.push(_timestamp_array);
      let _channel_int = parseInt(_channel_string);
      _value_matrix.push([_channel_int, _value_array]);
      _bytestring_matrix.push(_base64_string_array);
    }
    return [_timestamp_matrix, _value_matrix, _bytestring_matrix] ;
  }

}



class Help
{

  static set_properties(elem, prop_object)
  {
    for (let _prop in prop_object) elem[_prop] = prop_object[_prop];
  }


  static safe_get(obj, key, def = null)
  {
    let val = def;
    if (obj !== null)
    {
      if (key in obj) val = obj[key];
    }
    return val;
  }


  static json_safe_parse(json_string)
  {
    let json = null;
    try
    {
      json = JSON.parse(json_string);
    }
    catch(e)
    {
    }
    return json;
  }


  static jsonToTable(json, labels)
  {
    let json_table = '' ; //'<div style="font-size:10px;line-height:100%;">';
    //for (let i = 0; i < json.length; i++) json[i]
    for(let key in json)
    {
      //labels(key)
      try
      {
        json_table += key.toString() + ': ' + json[key].toString() + '<br>';
      }
      catch(e)
      {
      }
    }
    json_table += '</div>';
    return json_table
  }


  static isTouchDevice()
  {
    return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
  }


  static rgba_array_from_literal(color)
  {
    let rgb = [];;
    if (color.search(/rgb/) !== -1) rgb = color.match(/([0-9]+\.?[0-9]*)/g);
    if (rgb.length === 3) rgb.push(1);
    for (let i = 0; i < rgb.length; i++) rgb[i] = parseInt(rgb[i], 10);
    rgb[3] *= 255;

    return rgb;
  }


  static rgba_literal_from_array( rgba_array )
  {
    return "rgba(" + rgba_array[0].toString() + "," + rgba_array[1].toString() + "," + rgba_array[2].toString() + "," + (rgba_array[3]/255).toString() + ")";
  }


  static decodeTransferString(data, field_length)
  {
    let _json_string = null;
    if (data === null || typeof data === 'undefined' || data === "") _json_string = "";
    else _json_string = data.returnstring;

    let _json_array = _json_string.split(";");
    let _no_of_channels = (_json_array.length - 1) / 2;
    let _channel_string = "";
    let _channel_data = "";
    let _channel_data_array = _channel_data.split(",");
    let _timestamp_matrix = [];
    let _value_matrix = [];
    let _bytestring_matrix = [];

    if (typeof field_length === 'undefined') field_length = 4;
    for (let _channel_index = 0; _channel_index < _no_of_channels; _channel_index++)
    {
      _channel_string = _json_array[_channel_index*2];
      _channel_data = _json_array[_channel_index*2 + 1];
      _channel_data_array = _channel_data.split(",");
      let _field_data_array_length = (_channel_data_array.length - 1)/field_length - 0 ;

      let _timestamp_array = [];
      let _value_array = [];
      let _subsamples_string_array = [];
      let _base64_string_array = [];
      for (let _sample_index = 0; _sample_index < _field_data_array_length ; _sample_index++)
      {
        _timestamp_array[_sample_index] = parseInt( _channel_data_array[_sample_index*4+0] );
        _value_array[_sample_index] = parseFloat(_channel_data_array[_sample_index*4+1]);
        _base64_string_array[_sample_index] = _channel_data_array[_sample_index*4+3];
      }
      _timestamp_matrix.push(_timestamp_array);
      let _channel_int = parseInt(_channel_string);
      _value_matrix.push([_channel_int, _value_array]);
      _bytestring_matrix.push(_base64_string_array);
    }
    return [_timestamp_matrix, _value_matrix, _bytestring_matrix] ;
  }


  static rounded_string(value, display_length)
  {
    if (value === 0.0) value += Number.EPSILON ;
    const decades = Math.floor( Math.log10( Math.abs(value) ) ) ;
    let decimal_places = 0;
    decimal_places = display_length - Math.abs(decades) - 2 ;
    if (decades < 0) decimal_places += 1 ;
    if (decimal_places < 0) decimal_places = 0 ;
    const rounded_value_string = value.toFixed(decimal_places);
    return rounded_value_string;
  }

}



class Disp
{

  constructor()
  {
    this.data = [];
  }


  static rGBAArrayFromLiteral(color)
  {
    let rgb = [];;
    if (color.search(/rgb/) !== -1) rgb = color.match(/([0-9]+\.?[0-9]*)/g);
    if (rgb.length === 3) rgb.push(1);
    for (let i = 0; i < rgb.length; i++) rgb[i] = parseInt(rgb[i], 10);
    rgb[3] *= 255;

    return rgb;
  }


  static rGBALiteralFromArray( rgba_array )
  {
    return "rgba(" + rgba_array[0].toString() + "," + rgba_array[1].toString() + "," + rgba_array[2].toString() + "," + (rgba_array[3]/255).toString() + ")";
  }


  static setProperties( elem, prop_object )
  {
    for (let _prop in prop_object) elem[_prop] = prop_object[_prop];
  }


  static getProperty( elem, prop )
  {
    let _style = window.getComputedStyle(elem, null);
    let val = _style.getPropertyValue(prop);
    return val
  }


  static addFonts(font_filenames, font_path)
  {
    let _font_families = "";
    for (let _i = 0; _i < font_filenames.length; _i++)
    {
      let _filename = font_filenames[_i];
      let _dot_parts = _filename.split('.');
      let _extension = _dot_parts[_dot_parts.length - 1];
      let _filetype = _extension ;
      if (_filetype === 'ttf') _filetype = 'truetype';
      let _name = _dot_parts[0];
      let _arg_string = "url(." + font_path + _filename + ") format('" + _filetype + "')";
      let _font = new FontFace( _name, _arg_string ); //, {style: 'normal', unicodeRange: 'U+000-5FF', weight: '500'} );
      _font.load().then(function() {document.fonts.add(_font); } ).catch(e => console.error(e.message));
      _font_families += "'" + _name + "'";
      if (_i < font_filenames.length - 1) _font_families += ", ";
    }
    return _font_families;
  }


  static getTagChannelIndex(html_element)
  {
    let _id = html_element.id;
    let  _fields = _id.split("_");
    let _tag_string = null ;
    let _index_string = null ;
    if (_fields.length > 0)
    {
      _tag_string = _fields[0];
      if (_fields.length > 1) _index_string = _fields[1];
    }
    return [_tag_string, _index_string];
  }


  static getChannelElement(element_ids)
  {
    let _tag_string = null ;
    let _index_string = null ;
    if (element_ids.length > 0)
    {
      _tag_string = element_ids[0];
      if (element_ids.length > 1) _index_string = element_ids[1];
    }
    let channel_element = null ;
    let _tag_index_string = _tag_string ;
    if(_tag_index_string !== null)
    {
      if(_index_string !== null) _tag_index_string += "_" + _index_string ;
      channel_element = document.getElementById(_tag_index_string);
    }
    return channel_element;
  }


  static removeAllElements(container, tag_name_array)
  {
    for (let _i = 0, _len = tag_name_array.length; _i != _len; ++_i)
    {
      let _all_tag_elements = container.getElementsByTagName(tag_name_array[_i]);
      for (let _i = 0, _len = _all_tag_elements.length; _i != _len; ++_i) _all_tag_elements[0].parentNode.removeChild(_all_tag_elements[0]) ;
    }
  }


  static htmlSpaces(num)
  {
    let _spaces_string = "";
    for (let _i = 0; _i < num; _i++)
    {
      _spaces_string += "&nbsp;"
    }
    return _spaces_string;
  }


  static getTimeLagText(view_lag)
  {
    let _lag_text = "";
    if ( view_lag > 365*24*60*60 ) _lag_text = parseInt(view_lag/(365*24*60*60)).toString() + " y";
    else if ( view_lag > 24*60*60 ) _lag_text = parseInt(view_lag/(24*60*60)).toString() + " d";
    else if ( view_lag > 60*60 ) _lag_text = parseInt(view_lag/(60*60)).toString() + " h";
    else if ( view_lag > 60 ) _lag_text = parseInt(view_lag/60).toString() + " m";
    else _lag_text = parseInt(view_lag/1).toString() + " s";
    return _lag_text;
  }


  setDisplayTextProperties(display_index, hovered_touched_element, time_adjust_microsecs, full_no_of_digits, text_alpha, hovered_touched_text_alpha)
  {
    this.setAllTextAlpha(display_index, text_alpha);
    if (typeof this.data[display_index] !== 'undefined')
    {
      let _screen = this.data[display_index].screens[0];

      let _hovered_tag = "";
      let _hovered_index = "";

      if ( hovered_touched_element !== null ) [_hovered_tag, _hovered_index] = Disp.getTagChannelIndex(hovered_touched_element);

      let _time = _screen.time;
      if (_time !== null) // All displays except the title page
      {
        let _time_label = Disp.getChannelElement( [ "timelabel", null ] );
        _time_label.innerHTML = _time.str_val + _time.padding;
        if ( _hovered_tag === "timebkg" ) _time_label.innerHTML = _time.str_val + _time.info + ( - time_adjust_microsecs / 1000000 ).toString().substring(0,7) + " s";
      }
      for (let _i = 0; _i < _screen.channels.length; _i++)
      {
        let _channel = _screen.channels[_i];
        let _index_str = (_channel.index).toString();
        if ( _hovered_index === _index_str ) this.setAllTextAlpha(display_index, 255);
        let _label = Disp.getChannelElement( [ "label", _index_str ] );
        _label.innerHTML = _channel.str_val + _channel.padding;
        if ( _hovered_index === _index_str ) _label.innerHTML = (_channel.val).toString().substring(0, full_no_of_digits) + " " + _channel.unit + _channel.info; // _channel.str_val + _channel.info; .substring(0,12)
      }
      for (let _img_channel_index = 0; _img_channel_index < _screen.img_channels.length; _img_channel_index++)
      {
      }
      for (let _i = 0; _i < _screen.ctrl_channels.length; _i++)
      {
        let _ctrl = _screen.ctrl_channels[_i];
        let _index_str = (_ctrl.index).toString();
        if ( _hovered_index === _index_str ) this.setAllTextAlpha(display_index, 255);
        if (_ctrl.type === "datetime")
        {
        }
        else
        {
          let _setval = Disp.getChannelElement( [ "setval", _index_str ] );
          _setval.innerHTML = _ctrl.str_val + _ctrl.padding;
          if ( _hovered_index === _index_str )
          {
            _setval.innerHTML = _ctrl.str_val + _ctrl.info;
            let _slider = Disp.getChannelElement (["slider", _index_str]);
            _slider.value = _ctrl.val;
          }
        }
      }
    }
  }


  setAllTextAlpha(display_index, text_alpha)
  {
    if (typeof this.data[display_index] !== 'undefined')
    {
      let _screen = this.data[display_index].screens[0];

      for (let _i = 0; _i < _screen.channels.length; _i++)
      {
        let _channel = _screen.channels[_i];
        let _index_str = (_channel.index).toString();
        let _label = Disp.getChannelElement( [ "label", _index_str ] );
        let _current_color = Disp.getProperty(_label, 'color');
        let _rgba = Disp.rGBAArrayFromLiteral(_current_color);
        _rgba[3] = text_alpha;
        _label.style.color = Disp.rGBALiteralFromArray( _rgba );
      }
    }
  }


  placeAndSizeTextElements()
  {
  }


  setControlElementStyle()
  {
  }


}



class App
{

  constructor()
  {
    this.CANVAS = {};
    this.CANVAS_POS_X = 250 ;
    this.CANVAS_POS_Y = 10 ;
    this.STD_SCALE_HEIGHT = 480;
    this.DISPLAY_SELECT = {};
    this.DISPLAY_INFO_TEXT = {};
    this.DISPLAY_TIMEOUT_TEXT = {};
    this.STANDARD_FONT_FAMILIES = "'Arial', 'Verdana'";
    this.STANDARD_FONTSIZE = 14;
    this.WARNING_FONTSIZE = 36;
    this.TIMEOUT_FONTSIZE = 14;
    this.MAX_DISPLAY_DIGITS = 13;
    this.STANDARD_FOREGROUND_COLOR = [255,255,255,255];
    this.STANDARD_BACKGROUND_COLOR = [0,0,255,255];
    this.FRAME_RATE = 5 ;
    this.REQUEST_INTERVAL = 2 ;
    this.NTP_SYNC_INTERVAL = 60 ;
    this.TIME_ZONE = "UTC";
    this.BROWSER_URL = window.location.hostname;
    this.CLIENT_URL = window.location.protocol + "//" + this.BROWSER_URL  + "/client/";
    this.FILES_DIR = "images/";
    this.FILES_URL = this.CLIENT_URL + this.FILES_DIR;
    this.WAIT_MESSAGE = "Retrieving data...";
    this.last_get = 5;
    this.last_request = 0;
    this.last_time_sync = 0;
    this.display_index = 0;
    this.display_timeout = 900 ;
    this.display_browser_viewport = false;
    this.display_viewport = {} ;
    this.display_viewport.w = 853 ;
    this.display_viewport.h = 480 ;
    this.display_img_scale = 1.0 ;
    this.display_kiosk_interval = 0 ;
    this.display_kiosk_adjust = {} ;
    this.display_kiosk_adjust.x = 0 ;
    this.display_kiosk_adjust.y = 0 ;
    this.display_kiosk_height = 0 ;
    this.display_is_static = false;
    this.display_image_loading = false;
    this.display_timed_out = false;
    this.display_override_font = {};
    this.display_override_font.filename = "";
    this.display_override_font.path = "";
    this.all_font_families = "";
    this.text_element_alpha = 255;
    this.chan_index_string = "";
    this.img_chan_index_string = "";
    this.ctrl_chan_index_string = "";
    this.img_url = "";
    this.img = {};
    this.test_img = {};
    this.img_height = this.STD_SCALE_HEIGHT;
    this.img_width = 4/3 * this.img_height;
    this.start_time = -9999;
    this.end_time = -9999;
    this.time_bins = 10;
    this.time_bin_size = 1;
    this.data_time_string = "";
    this.data_timestamp = 0 ;
    this.server_time_string = this.WAIT_MESSAGE ;
    this.server_timestamp = 0 ;
    this.frames_active = 0 ;
    this.saved_frames = 0 ;
    this.ntp = {}
    this.ntp.t1 = 0 ;
    this.ntp.t2 = 0 ;
    this.ntp.t3 = 0 ;
    this.ntp.t4 = 0 ;
    this.ntp.adjustment = 0 ;
    this.ntp.timestamp = 0 ;
    this.ntp.time_string = 0 ;
    this.canvas_shift_x = 0 ;
    this.canvas_shift_y = 0 ;
    this.moved_slider = null ;
    this.pressed_send = null ;
    this.hovered_clicked_label = null ;
  }


  static arrayElementsIn(arr)
  {
    if (!Array.isArray(arr) || !arr.length) return false;
    return true;
  }


  static isValidNumber(num_or_str)
  {
    let _num = parseFloat(num_or_str);
    return !isNaN(num_or_str) && !isNaN(_num) && isFinite(_num);
  }


  static isValidGT(num_or_str_1, num_or_str_2)
  {
    if ( App.isValidNumber(num_or_str_1) && App.isValidNumber(num_or_str_2) ) return parseFloat(num_or_str_1) > parseFloat(num_or_str_2);
    return false;
  }


  static isValidDate(d)
  {
    let _date_valid = false;
    if (Object.prototype.toString.call(d) === "[object Date]")
    {
      if (isNaN(d.getTime())) {}
      else { _date_valid = true; }
    }
    else {}
    return _date_valid;
  }


  static maxOfArray(a)
  {
    return Math.max(...a.map(e => Array.isArray(e) ? maxOfArray(e) : e));
  }


  static nthMaxOfArray(a, down_from_max)
  {
    let _a_max = App.maxOfArray(a);
    if (a.length - down_from_max < 1) down_from_max += a.length - down_from_max - 1;
    if ( down_from_max < 0 ) down_from_max = 0;
    for (let _i = 0; _i < down_from_max; _i += 1)
    {
      let _index = a.indexOf(_a_max);
      if (_index > -1) a.splice(_index, 1);
      _a_max = App.maxOfArray(a);
    }
    return _a_max;
  }


  static findWithAttr(arr, attr, val)
  {
    for(let _i = 0; _i < arr.length; _i += 1) if (arr[_i][attr] === val) { return _i; }
    return -1;
  }


  setCanvasAutoScaleCenter(imgs, current_imgs)
  {
    let _no_of_imgs = imgs.length;
    if (_no_of_imgs > 0)
    {
      for (let _i = 0; _i < _no_of_imgs; _i++)
      {
        let _width = current_imgs[_i].width ;
        let _height =  current_imgs[_i].height ;
        let _img = imgs[_i];
        if (_img.dim === "source" && _width > 1 && _height > 1)
        {
          if (this.display_kiosk_height > 0) _img.disp.h = this.display_kiosk_height ;
          let _img_disp_scale = _height / _img.disp.h ;
          this.display_img_scale = _img.disp.h / this.STD_SCALE_HEIGHT ;
          this.img_height = _height / _img_disp_scale;
          this.img_width = _width / _img_disp_scale;
        }
        if (_img.disp.pos === "center")
        {
          this.canvas_shift_x = parseInt( ( this.display_viewport.w - this.img_width ) / 2 ) ; //Math.max( , 0 ) ;
          this.canvas_shift_y = parseInt( ( this.display_viewport.h - this.img_height ) / 2 ) ; //Math.max( , 0 ) ;
        }
      }
    }
  }


  placeAndSizeCanvasElements(screen_elements, element_tag, x_shift, y_shift)
  {
    if (screen_elements !== null)
    {
      let _no_of_elements = screen_elements.length;
      if (_no_of_elements > 0)
      {
        for (let _i = 0; _i < _no_of_elements; _i++)
        {
          let _element = screen_elements[_i];
          if (_element !== null)
          {
            let _disp = _element.disp;
            if (typeof _element.index === 'undefined') _element.index = null;
            let _html_element = Disp.getChannelElement([element_tag, _element.index]);
            if (_html_element !== null)
            {
              Disp.setProperties( _html_element.style,
              {
                fontSize: (parseInt(_disp.size * this.display_img_scale/this.display_img_scale)).toString() + "px",
                left: (parseInt(_disp.pos.x * this.display_img_scale + this.CANVAS_POS_X + this.canvas_shift_x - _disp.size/2 + x_shift)).toString() + "px",
                top: (parseInt(_disp.pos.y * this.display_img_scale + this.CANVAS_POS_Y + this.canvas_shift_y - _disp.size + x_shift)).toString() + "px"
              } ) ;
            }
          }
        }
      }
    }
  }

  placeAndSizeCanvasText(text_html_element, font_size, x_font_scale, x_shift)
  {
    Disp.setProperties( text_html_element.style,
    {
      fontSize: (parseInt(font_size * A.display_img_scale/A.display_img_scale)).toString() + "px",
      left: (parseInt(A.CANVAS_POS_X + A.canvas_shift_x + Math.max(A.img_width/2 - font_size*x_font_scale + x_shift, 0))).toString() + "px",
      top: (parseInt(A.CANVAS_POS_Y + A.canvas_shift_y + A.img_height/2 - font_size/2)).toString() + "px",
    } ) ;
  }

  decodeTransferString(data, field_length)
  {
    let _latest_time_array = [];
    let _json_string = data.returnstring;
    let _json_array = _json_string.split(";");
    let _no_of_channels = (_json_array.length - 1) / 2;
    let _channel_string = "";
    let _channel_data = "";
    let _channel_data_array = _channel_data.split(",");
    let _timestamp_matrix = [];
    let _value_matrix = [];
    let _bytestring_matrix = [];

    if (typeof field_length === 'undefined') field_length = 4;
    for (let _channel_index = 0; _channel_index < _no_of_channels; _channel_index++)
    {
      _channel_string = _json_array[_channel_index*2];
      _channel_data = _json_array[_channel_index*2 + 1];
      _channel_data_array = _channel_data.split(",");
      let _field_data_array_length = (_channel_data_array.length - 1)/field_length - 0 ;

      let _timestamp_array = [];
      let _value_array = [];
      let _subsamples_string_array = [];
      let _base64_string_array = [];
      for (let _sample_index = 0; _sample_index < _field_data_array_length ; _sample_index++)
      {
        _timestamp_array[_sample_index] = parseInt( _channel_data_array[_sample_index*4+0] );
        _value_array[_sample_index] = parseFloat(_channel_data_array[_sample_index*4+1]);
        _base64_string_array[_sample_index] = _channel_data_array[_sample_index*4+3];
      }
      _timestamp_matrix.push(_timestamp_array);
      let _channel_int = parseInt(_channel_string);
      _value_matrix.push([_channel_int, _value_array]);
      _bytestring_matrix.push(_base64_string_array);
    }
    return [_timestamp_matrix, _value_matrix, _bytestring_matrix] ;
  }

}

