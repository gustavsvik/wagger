"use strict";

let App = {};

App.CANVAS = [];
App.CANVAS_POS_X = 250 ;
App.CANVAS_POS_Y = 10 ;
App.STD_SCALE_HEIGHT = 480;
App.WARNING_FONTSIZE = 36;
App.STANDARD_FONTSIZE = 12;
App.STANDARD_FOREGROUND_COLOR = [255,255,255,255];
App.STANDARD_BACKGROUND_COLOR = [0,0,255,255];
App.FRAME_RATE = 5 ;
App.REQUEST_INTERVAL = 2 ;
App.TIME_ZONE = "UTC";
App.BROWSER_URL = window.location.hostname;
App.CLIENT_URL = "http://" + App.BROWSER_URL  + "/client/";
App.FILES_DIR = "images/";
App.FILES_URL = App.CLIENT_URL + App.FILES_DIR;
App.WAIT_MESSAGE = "Retrieving data...";
App.last_get = 5;
App.last_request = 0; 
App.display_index = 0;
App.display_timeout = 900 ;
App.display_is_static = false;
App.chan_index_string = "";
App.img_chan_index_string = "";
App.ctrl_chan_index_string = "";
App.img_url = "";
App.img = {};
App.img_height = App.STD_SCALE_HEIGHT;
App.img_width = 4/3 * App.img_height; 
App.start_time = -9999;
App.end_time = -9999;
App.time_bins = 10; 
App.time_bin_size = 1;
App.data_time_string = App.WAIT_MESSAGE; 
App.data_timestamp = 0 ;
App.frames_active = 0 ;
App.view_timestamp = 0 ;
App.time_adjustment = 0 ;
App.t0 = 0 ;
App.t1 = 0 ;
App.t2 = 0 ;
App.t3 = 0 ;
App.font_size = App.STANDARD_FONTSIZE;
App.fg_color = App.STANDARD_FOREGROUND_COLOR ;
App.bg_color = App.STANDARD_BACKGROUND_COLOR ;
App.canvas_shift_x = 0 ;
App.canvas_shift_y = 0 ;
App.moved_slider = null ;
App.pressed_send = null ;
App.hovered_clicked_label = null ;

let Display = {};
Display.data = [];


function arrayElementsIn(arr)
{
  if (!Array.isArray(arr) || !arr.length) return false;
  return true;
}

function isValidGT(num_or_str_1, num_or_str_2)
{
  if ( isValidNumber(num_or_str_1) && isValidNumber(num_or_str_2) ) return parseFloat(num_or_str_1) > parseFloat(num_or_str_2);
  return false;
}

function isValidNumber(num_or_str)
{
  let _num = parseFloat(num_or_str);
  return !isNaN(num_or_str) && !isNaN(_num) && isFinite(_num);
}

function isValidDate(d)
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

function maxOfArray(a)
{
  return Math.max(...a.map(e => Array.isArray(e) ? maxOfArray(e) : e));
}

function nthMaxOfArray(a, down_from_max)
{
  let _a_max = maxOfArray(a);
  if (a.length - down_from_max < 1) down_from_max += a.length - down_from_max - 1;
  if ( down_from_max < 0 ) down_from_max = 0;
  for (let _i = 0; _i < down_from_max; _i += 1) 
  {
    let _index = a.indexOf(_a_max);
    if (_index > -1) a.splice(_index, 1);
    _a_max = maxOfArray(a);
  }
  return _a_max;
}

function findWithAttr(arr, attr, val) 
{
  for(let _i = 0; _i < arr.length; _i += 1) if (arr[_i][attr] === val) { return _i; }
  return -1;
}

function getTagChannelIndex(htmlElement)
{
  let _id = htmlElement.id;
  let  _fields = _id.split("_");
  let _tag_string = _fields[0];
  let _index_string = _fields[1];
  return [_tag_string, _index_string];
}

function getChannelElement(element_ids)
{
  let _tag_string = element_ids[0];
  let _index_string = element_ids[1];
  let channel_element = document.getElementById(_tag_string + "_" + _index_string);
  return channel_element;
}

function removeAllElements(container)
{  
  let _all_buttons = container.getElementsByTagName("BUTTON");
  for (let _i = 0, _len = _all_buttons.length; _i != _len; ++_i) _all_buttons[0].parentNode.removeChild(_all_buttons[0]);
  
  let _divs = container.getElementsByTagName("DIV");
  for (let _i = 0, _len = _divs.length; _i != _len; ++_i) _divs[0].parentNode.removeChild(_divs[0]);
 
  let _sliders = container.getElementsByTagName("INPUT");
  for (let _i = 0, _len = _sliders.length; _i != _len; ++_i) _sliders[0].parentNode.removeChild(_sliders[0]);

  let _sends = container.getElementsByTagName("OUTPUT");
  for (let _i = 0, _len = _sends.length; _i != _len; ++_i) _sends[0].parentNode.removeChild(_sends[0]);
}

function htmlSpaces(num)
{
  let _spaces_string = "";
  for (let _i = 0; _i < num; _i++)
  {
    _spaces_string += "&nbsp;"
  }
  return _spaces_string;
}

function getTimeLagText(view_lag)
{
  let _lag_text = "";
  if ( view_lag > 365*24*60*60 ) _lag_text = parseInt(view_lag/(365*24*60*60)).toString() + " y";
  else if ( view_lag > 24*60*60 ) _lag_text = parseInt(view_lag/(24*60*60)).toString() + " d";
  else if ( view_lag > 60*60 ) _lag_text = parseInt(view_lag/(60*60)).toString() + " h";
  else if ( view_lag > 60 ) _lag_text = parseInt(view_lag/60).toString() + " m";
  else _lag_text = parseInt(view_lag/1).toString() + " s";
  return _lag_text;
}



function setup() 
{
  frameRate(App.FRAME_RATE);

  let _screen_layout_file = document.getElementById("screenLayoutFile").value;
  let _screen_layout_params = {"screen_layout_file": _screen_layout_file};
  httpGet(App.CLIENT_URL + "get_screen_data.php", "json", _screen_layout_params, handle_display_data);
  App.img_url = App.FILES_URL + "0.png";
  App.img = loadImage(App.img_url);
  App.img_width = 1280/(720/App.STD_SCALE_HEIGHT);
  App.img_height = 720/(720/App.STD_SCALE_HEIGHT);

  App.CANVAS = createCanvas(1500, 800);
  App.CANVAS.parent("myContainer");
  App.CANVAS.position(App.CANVAS_POS_X, App.CANVAS_POS_Y);
}


function draw() 
{
  if (App.img_chan_index_string === "") clear();
  image(App.img, App.canvas_shift_x, App.canvas_shift_y, App.img_width, App.img_height);
  
  textSize(App.STANDARD_FONTSIZE);
	
  App.frames_active++;

  App.view_timestamp = parseInt((new Date().valueOf()) / 1000) + App.time_adjustment;

  if (App.frames_active < App.display_timeout * App.FRAME_RATE)
  {
    if (App.DISPLAY_SELECT != null) App.DISPLAY_SELECT.style.visibility = "visible"; 
    fill(color(App.fg_color));
    textSize(App.font_size);
    App.img = loadImage(App.img_url);

    let _screen = null;
    if (Display.data[App.display_index] != null) _screen = Display.data[App.display_index].screens[0];
    
    if (_screen != null)
    {
      let _time = _screen.time;
      if (_time !== null) // All displays except the title page
      {
        let _time_disp = _time.disp;
        textSize(_time_disp.size);
        fill(color(_time_disp.col.r, _time_disp.col.g, _time_disp.col.b, _time_disp.col.a));
        text(_time.str_val, _time_disp.pos.x, _time_disp.pos.y);
      }
    
      let _hovered_tag = "";
      let _hovered_index = "";
      if ( App.hovered_clicked_label !== null ) [_hovered_tag, _hovered_index] = getTagChannelIndex(App.hovered_clicked_label);
    
      for (let _i = 0; _i < _screen.channels.length; _i++)
      {
        let _channel = _screen.channels[_i];
        let _index_str = (_channel.index).toString();
        let _label = getChannelElement( [ "label", _index_str ] );
        _label.innerHTML = _channel.str_val + _channel.padding;
        if ( _hovered_index === _index_str ) _label.innerHTML = _channel.str_val + _channel.info;
      }
      for (let _img_channel_index = 0; _img_channel_index < _screen.img_channels.length; _img_channel_index++)
      {
      }
      for (let _i = 0; _i < _screen.ctrl_channels.length; _i++)
      {
        let _ctrl = _screen.ctrl_channels[_i];
        let _index_str = (_ctrl.index).toString();
        let _setval = getChannelElement( [ "setval", _index_str ] );
        _setval.innerHTML = _ctrl.str_val + _ctrl.padding;
        if ( _hovered_index === _index_str ) 
        {
          _setval.innerHTML = _ctrl.str_val + _ctrl.info;
          let _slider = getChannelElement (["slider", _index_str]);
          _slider.value = _ctrl.val;
        }
      }
    }
  }
  
  fill(color(App.fg_color));
  textSize(App.font_size);

  
  //if ( (frameCount - App.last_request >= App.REQUEST_INTERVAL * App.FRAME_RATE) && App.frames_active < App.display_timeout * App.FRAME_RATE && App.display_is_static === false)
  //{
  //  httpGet(App.CLIENT_URL + "get_server_time.php", "json", {}, handle_server_time); 
  //}
      
  if ( (frameCount - App.last_request >= App.REQUEST_INTERVAL * App.FRAME_RATE) && App.frames_active < App.display_timeout * App.FRAME_RATE && App.display_is_static === false)
  {
    if (App.chan_index_string !== "")
    {
      let _request_params = {"channels": App.chan_index_string, "start_time": App.start_time, "end_time": App.end_time, "duration": App.time_bins, "unit": App.time_bin_size, "delete_horizon": 3600};
      httpPost(App.CLIENT_URL + "send_request.php", "json", _request_params, handle_request_data);
    }
    if (App.img_chan_index_string !== "")
    {
      let _image_request_params = {"channels": App.img_chan_index_string, "start_time": App.start_time, "end_time": App.end_time, "duration": App.time_bins, "unit": App.time_bin_size, "delete_horizon": 3600};
      httpPost(App.CLIENT_URL + "send_request.php", "json", _image_request_params, handle_request_data);
    }
    App.last_request = frameCount;
  }

  if ( (frameCount - App.last_get >= App.REQUEST_INTERVAL * App.FRAME_RATE) && App.frames_active < App.display_timeout * App.FRAME_RATE && App.display_is_static === false)
  {
    App.t0 = parseInt((new Date().valueOf()) * 1000) ;
    if (App.ctrl_chan_index_string !== "")
    {
      let _ctrl_get_params = {"channels": App.ctrl_chan_index_string, "start_time": App.start_time, "end_time": App.end_time, "duration": -9999, "unit": App.time_bin_size, "lowest_status": 1};
      httpPost(App.CLIENT_URL + "get_uploaded.php", "json", _ctrl_get_params, handle_get_data);
    }
    if (App.chan_index_string !== "")
    {
      let _get_params = {"channels": App.chan_index_string, "start_time": App.start_time, "end_time": App.end_time, "duration": App.time_bins, "unit": App.time_bin_size, "lowest_status": 0};
      httpPost(App.CLIENT_URL + "get_uploaded.php", "json", _get_params, handle_get_data);
    }
    if (App.img_chan_index_string !== "")
    {
      let _image_get_params = {"channels": App.img_chan_index_string, "start_time": App.start_time, "end_time": App.end_time, "duration": App.time_bins, "unit": App.time_bin_size, "lowest_status": 0};
      httpPost(App.CLIENT_URL + "get_uploaded.php", "json", _image_get_params, handle_get_data);
    }
    App.last_get = frameCount;
  }  
/*
  if ( (frameCount - App.last_get >= App.REQUEST_INTERVAL * App.FRAME_RATE) && App.frames_active < App.display_timeout * App.FRAME_RATE)
  {
    if (App.ctrl_chan_index_string !== "")
    {
      let _retrieve_params = {"channels": App.ctrl_chan_index_string, "start_time": App.start_time, "end_time": App.end_time, "duration": App.time_bins, "unit": App.time_bin_size, "subsample_file": ".txt"};
      httpPost(App.CLIENT_URL + "get_ctrl_state.php", "json", _retrieve_params, handle_get_ctrl);
      //App.last_get_ctrl = frameCount;
    }
  }  
*/
  if ( App.pressed_send !== null && App.moved_slider !== null && App.display_is_static === false)
  {
    let _fields = (App.moved_slider.id).split("_");
    let _send_index_string = _fields[1] + ";";
    let _ctrl_request_params = {"channels": _send_index_string, "start_time": App.start_time, "end_time": App.end_time, "value": App.moved_slider.value, "duration": 0, "unit": 1, "delete_horizon": 10};
    App.moved_slider = null;
    App.pressed_send = null;
    httpPost(App.CLIENT_URL + "send_request.php", "json", _ctrl_request_params, handle_control_request_data);
    //radioVal = newRadioVal;
  }

  if (App.frames_active >= App.display_timeout * App.FRAME_RATE)
  {
    removeAllElements(App.CONTAINER);
    App.img = loadImage(App.FILES_URL + "000.jpg");
    App.img_width = 1280/(720/App.STD_SCALE_HEIGHT);
    App.img_height = 720/(720/App.STD_SCALE_HEIGHT);
    text("Timeout due to inactivity - please reload page to continue data transfer!", 220, 250);
    reset_display_variables();
  }
  else if (App.display_is_static === false) // display is not static
  {
    let _view_lag = App.view_timestamp - App.data_timestamp;
    if ( _view_lag > App.time_bins * App.time_bin_size || !navigator.onLine)
    {
      if (App.frames_active % 2 === 0) fill(255,0,0,127); else fill(255,255,255,127);
      textSize(App.WARNING_FONTSIZE);
      if (!isValidNumber(_view_lag) || _view_lag > 10*365*24*60*60) 
      {
        text("", Math.max(App.img_width/2 - App.WARNING_FONTSIZE*7.8, 0), App.img_height/2 + App.WARNING_FONTSIZE/2);
      }
      else
      {
        let _lag_text = getTimeLagText(_view_lag);
        let _status_text = "requesting new...";
        if (!navigator.onLine) _status_text = "no internet connection!";
        text("Out of date (" + _lag_text + ")" + ", " + _status_text, Math.max(App.img_width/2 - App.WARNING_FONTSIZE*7.8, 0), App.img_height/2 + App.WARNING_FONTSIZE/2);
      }
      fill(App.fg_color);
	  textSize(App.font_size);
    }
  }
  
}

//function handle_server_time(data)
//{
//  App.view_timestamp = parseInt(data);
//}

function handle_control_request_data(data)
{
}

function handle_request_data(data)
{
}

function handle_image_request_data(data)
{
}

/**
 * Dissect semicolon/comma separated ASCII based timestamp/float/base64 mixed type custom transfer format.
 */
function handle_get_data(data)
{ 
  App.t3 = parseInt( (new Date().valueOf()) * 1000 ) ;
  App.t1 = parseInt( data.receivetime / 1 );
  App.t2 = parseInt( data.transmittime / 1 );
  App.time_adjustment = parseInt( ( ( App.t1 - App.t0 ) + ( App.t2 - App.t3 ) ) / 2 / 1000000 ) ; //- App.view_timestamp ;
  let _latest_time_array = [];
  let _json_string = data.returnstring;
  let _json_array = _json_string.split(";");
  let _no_of_channels = (_json_array.length - 1) / 2;
  let _channel_string = "";
  let _channel_data = "";
  let _channel_data_array = _channel_data.split(",");
  let _timestamp_matrix = [];
  let _value_matrix = [];
  for (let _channel_index = 0; _channel_index < _no_of_channels; _channel_index++) 
  {
    _channel_string = _json_array[_channel_index*2];
    _channel_data = _json_array[_channel_index*2 + 1];
    _channel_data_array = _channel_data.split(",");
    let _field_data_array_length = (_channel_data_array.length - 1)/4 - 0 ;
    
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
  }
  populate_display_variables(_timestamp_matrix, _value_matrix);
}


function populate_display_variables(timestamp_matrix, value_matrix)
{
  let _latest_timestamp = nthMaxOfArray(timestamp_matrix[0], 0);
  if ( isValidGT(_latest_timestamp, 0) )
  {
    App.data_timestamp = _latest_timestamp;
    let _latest_time = new Date( _latest_timestamp * 1000 );
    let _latest_time_string = "";
    if ( isValidDate(_latest_time) )
    {
      _latest_time_string = _latest_time.toISOString();
      App.data_time_string = (_latest_time_string.substring(0,10)).concat( " ", _latest_time_string.substring(11,19), " ", App.TIME_ZONE );
    }
    else App.data_time_string = App.WAIT_MESSAGE;

    let _screen = Display.data[App.display_index].screens[0];
    let _time = _screen.time;
    if (_time !== null)
    {
      _time.str_val = App.data_time_string;
      _time.val = App.data_timestamp;
    }
    for (let _img_channel_index = 0; _img_channel_index < _screen.img_channels.length; _img_channel_index++)
    {
      let _img_channel = _screen.img_channels[_img_channel_index];
      let _img_url = App.FILES_URL + _img_channel.index.toString() + "_" + _time.val.toString() + "." + _img_channel.ext;
      App.img_url = _img_url;
      App.img = loadImage(_img_url);
      let _img_disp_scale = _img_channel.dim.h / _img_channel.disp.h ;
      let _img_height = _img_channel.dim.h / _img_disp_scale; 
      let _img_width = _img_channel.dim.w / _img_disp_scale;
      image(App.img, _img_channel.disp.pos.x, _img_channel.disp.pos.y, _img_width, _img_height);
      //(App.test_img).setAttribute("src", _img_url);
      
    }
    for (let _channel_index = 0; _channel_index < _screen.channels.length; _channel_index++)
    {
      let _channel = _screen.channels[_channel_index];
      let _found_values_index = findWithAttr(value_matrix, 0, _channel.index);
      if (_found_values_index > -1) 
      {
        let _channel_values = (value_matrix[_found_values_index])[1];
        let _latest_value = _channel_values[_channel_values.length - 1];
        _channel.val = _latest_value * _channel.scale;
        if ( isValidNumber(_channel.val) ) _channel.str_val = (_channel.val).toString().substring(0,_channel.disp.len) + " " + _channel.unit;
        else _channel.str_val = App.WAIT_MESSAGE;
      }
    }
    for (let _ctrl_index = 0; _ctrl_index < _screen.ctrl_channels.length; _ctrl_index++)
    {
      let _ctrl = _screen.ctrl_channels[_ctrl_index];
      let _found_values_index = findWithAttr(value_matrix, 0, _ctrl.index);
      if (_found_values_index > -1) 
      {
        let _ctrl_values = (value_matrix[_found_values_index])[1];
        let _latest_value = _ctrl_values[_ctrl_values.length - 1];
        _ctrl.val = _latest_value * _ctrl.scale;
        if ( isValidNumber(_ctrl.val) ) _ctrl.str_val = (_ctrl.val).toString().substring(0,_ctrl.disp.len) + " " + _ctrl.unit;
        else _ctrl.str_val = App.WAIT_MESSAGE;
      }
    }
  }
}


function reset_display_variables()
{
  App.data_time_string = App.WAIT_MESSAGE;

  let _screen = Display.data[App.display_index].screens[0];
  let _time = _screen.time;
  if (_time !== null)
  {
    App.display_is_static = false;
    for (let _channel_index = 0; _channel_index < _screen.channels.length; _channel_index++)
    {
      _screen.channels[_channel_index].str_val = App.WAIT_MESSAGE;
    }
  }
  else
  {
    App.display_is_static = true;
  }
}

function mousePressed()
{
  //if (isOverOn == true || isOverOff == true)
  //{
    //let _control_request_params = {"channels": App.ctrl_chan_index_string, "start_time": App.start_time, "end_time": App.end_time, "duration": App.time_bins, "unit": App.time_bin_size, "setvalue": setvalue};
    //httpPost(App.CLIENT_URL + "request_control.php", "json", _control_request_params, handle_control_request_data);
  //}
}

function circle_button(x, y, d)
{
  let _distance = dist(mouseX, mouseY, x, y); 
  if(_distance < d)
  {
    //isOverCircle = true;
  } 
  else 
  {
    //isOverCircle = false;
  }
  // draw a circle
  ellipseMode(CENTER);
  stroke(0, 0);
  strokeWeight(d/4);
  /*
  if (isOverCircle == true)
  {
    fill(100, 100);
    cursor(HAND);
  } 
  else 
  {
    fill(200, 100); 
    cursor(ARROW); 
  }
  */
  stroke(0, 0);
  ellipse(x, y, d, d);
}

/**
 * Retrieve screen content and design info after call of PHP script referencing JSON file on cloud server.
 */
function handle_display_data(data)
{
  Display.data = data.displays; 
  
  App.display_timeout = data.disp_timeout; 

  document.title = "LabRemote"; // New title :)
  App.CONTAINER = document.getElementById("myContainer");
  let _select = document.createElement("SELECT");
  App.DISPLAY_SELECT = _select;
  _select.id = "screen_select";
  App.CONTAINER.appendChild(_select);
  for (let _current_display = 0; _current_display < (Display.data).length; _current_display++) 
  {
    App.DISPLAY_SELECT.options[App.DISPLAY_SELECT.options.length] = new Option(Display.data[_current_display].title, _current_display);
  }
  App.DISPLAY_SELECT.addEventListener("change", display_select_listener);
  App.DISPLAY_SELECT.style.position = "absolute";
  App.DISPLAY_SELECT.style.left = "10px";
  App.DISPLAY_SELECT.style.top = "10px";
  App.DISPLAY_SELECT.style.visibility = "hidden"; 
  
  display_select_listener();
}


function label_listener()
{
  let _element = this;
  App.hovered_clicked_label = _element ;
  _element.style.visibility = "visible";
  let [_tag, _index] = getTagChannelIndex(_element);


  let _setval = getChannelElement (["setval", _index]);
  if (_setval !== null)
  {
    _setval.style.visibility = "visible";
    let _ctrl_channels = (Display.data[App.display_index]).screens[0].ctrl_channels;
    let _ctrl_index = findWithAttr(_ctrl_channels, "index", parseInt(_index) );
    let _ctrl_channel = _ctrl_channels[_ctrl_index];
    let _value_unit_string = "";
    if ( _ctrl_channel.str_val !== "" ) _value_unit_string = _ctrl_channel.str_val;
    else _value_unit_string = (_ctrl_channel.val  *_ctrl_channel.scale).toString().substring(0,_ctrl_channel.disp.len) + " " + _ctrl_channel.unit;
    let _str_val = _value_unit_string + _ctrl_channel.info;         
    _setval.innerHTML = _str_val;
    let _slider = getChannelElement (["slider", _index]);
    if (_slider !== null) 
    {
      _slider.style.visibility = "visible";
      _slider.value = _ctrl_channel.val;
    }
    let _send = getChannelElement (["send", _index]);
    if (_send !== null) _send.style.visibility = "visible";
  }

  let _label = getChannelElement (["label", _index]);
  if (_label !== null)
  {
    _label.style.visibility = "visible"; 
    let _channels = (Display.data[App.display_index]).screens[0].channels;
    let _chan_index = findWithAttr(_channels, "index", parseInt(_index) );
    let _channel = _channels[_chan_index];
    let _value_unit_string = "";
    if ( _channel.str_val !== "" ) _value_unit_string = _channel.str_val;
    else _value_unit_string = (_channel.val  *_channel.scale).toString().substring(0,_channel.disp.len) + " " + _channel.unit;
    let _str_val = _value_unit_string + _channel.info;
    _label.innerHTML = _str_val;
  }
}


function outside_label_listener()
{
  let _element = this;
  App.hovered_clicked_label = null ;
  _element.style.visibility = "hidden";
  let [_tag, _index] = getTagChannelIndex(_element);
  let _send = getChannelElement (["send", _index]);
  if (_send !== null) _send.style.visibility = "hidden";
  let _slider = getChannelElement (["slider", _index]);
  if (_slider !== null) _slider.style.visibility = "hidden";
  let _setval = getChannelElement (["setval", _index]);
  if (_setval !== null)
  {
    let _ctrl_channels = (Display.data[App.display_index]).screens[0].ctrl_channels;
    let _ctrl_index = findWithAttr(_ctrl_channels, "index", parseInt(_index) );
    let _ctrl_channel = _ctrl_channels[_ctrl_index];
    let _value_unit_string = "";
    if ( _ctrl_channel.str_val !== "" ) _value_unit_string = _ctrl_channel.str_val;
    else _value_unit_string = (_ctrl_channel.val  *_ctrl_channel.scale).toString().substring(0,_ctrl_channel.disp.len) + " " + _ctrl_channel.unit;
    _setval.innerHTML = _value_unit_string + htmlSpaces(0) + "<br>" + htmlSpaces(10) ; //+ "<br>" + htmlSpaces(10);
  }
  let _label = getChannelElement (["label", _index]);
  if (_label !== null)
  {

    let _channels = (Display.data[App.display_index]).screens[0].channels;
    let _chan_index = findWithAttr(_channels, "index", parseInt(_index) );
    let _channel = _channels[_chan_index];
    let _value_unit_string = "";
    if ( _channel.str_val !== "" ) _value_unit_string = _channel.str_val;
    else _value_unit_string = (_channel.val  *_channel.scale).toString().substring(0,_channel.disp.len) + " " + _channel.unit;
    _label.innerHTML = _value_unit_string + htmlSpaces(0) + "<br>" + htmlSpaces(10) ; //+ "<br>" + htmlSpaces(10);
  }
}


function send_listener()
{
  let _send = this;
  _send.disabled = true;
  _send.style.opacity = "0.5";
  App.pressed_send = _send;
}


function slider_listener()
{
  let _slider = this;
  let [_tag, _index_string] = getTagChannelIndex(_slider);
  let _setval = getChannelElement (["setval", _index_string]);
  let _send = getChannelElement (["send", _index_string]);
  let _slider_index = parseInt(_index_string);
  let _slider_value = parseFloat(_slider.value);
  _send.disabled = false;
  _send.style.opacity = "1.0";

  let _ctrl_channel = [];
  let _ctrl_channels = (Display.data[App.display_index]).screens[0].ctrl_channels;
  for (let _ctrl_channel_counter = 0; _ctrl_channel_counter < _ctrl_channels.length; _ctrl_channel_counter++) 
  {
    if ( _ctrl_channels[_ctrl_channel_counter].index === _slider_index ) _ctrl_channel = _ctrl_channels[_ctrl_channel_counter];
  }
  let _value_unit_string = "";
  if ( _ctrl_channel.min_str_val !== "" && _ctrl_channel.max_str_val !== "" && _ctrl_channel.str_val !== "" )
  {
    _value_unit_string = _ctrl_channel.min_str_val;
    if (_slider_value > 0.5) _value_unit_string = _ctrl_channel.max_str_val;
  }
  else _value_unit_string = (_slider_value  *_ctrl_channel.scale).toString().substring(0,_ctrl_channel.disp.len) + " " + _ctrl_channel.unit;

  _ctrl_channel.str_val = _value_unit_string;
  _ctrl_channel.val = _slider_value;
  
  _value_unit_string += _ctrl_channel.info;

  _setval.innerHTML = _value_unit_string;

  App.moved_slider = _slider;
}


function display_select_listener()
{ 
  background(255);
  App.frames_active = 0;
  clear();
  
  App.channel_strings_array = [];

  removeAllElements(App.CONTAINER);

  App.display_index = parseInt(App.DISPLAY_SELECT.options[App.DISPLAY_SELECT.selectedIndex].value);

  let _display = Display.data[App.display_index];
  let _screen = _display.screens[0];

  let no_of_imgs = (_screen.imgs).length;
  if (no_of_imgs > 0)
  {
    for (let i = 0; i < no_of_imgs; i++)
    {
      let _img = _screen.imgs[i];
      if (i === 0) App.img_url = App.FILES_URL + (_img.file).toString();
      let img_disp_scale = _img.dim.h / _img.disp.h ;
      App.img_height = _img.dim.h / img_disp_scale; 
      App.img_width = _img.dim.w / img_disp_scale;
      App.canvas_shift_x = _img.disp.pos.x;
      App.canvas_shift_y = _img.disp.pos.y;
    }
    App.img = loadImage(App.img_url);
  }
  else
  {
    App.img_url = App.FILES_URL + "00.jpg";
    App.img = loadImage(App.img_url);
  }

  let _time = _screen.time;
  if (_time !== null) // Any display but the title page
  {
    App.time_bins = _time.bins;
    App.time_bin_size = _time.bin_size;

    let _time_disp = _time.disp;
    let _time_color = _time_disp.col;

    let _time_label = document.createElement("DIV");
    App.CONTAINER.appendChild(_time_label);
    _time_label.innerHTML = "";
    _time_label.style.position = "absolute";
    _time_label.style.left = (_time_disp.pos.x).toString() + "px";
    _time_label.style.top = (_time_disp.pos.y).toString() + "px";
    _time_label.title = ""; 
    _time_label.style.color = "rgba(" + (_time_color.r).toString() + "," + (_time_color.g).toString() + "," + (_time_color.b).toString() + "," + (_time_color.a/255).toString() + ")";
    _time_label.style.backgroundColor = "transparent";
    _time_label.style.border = "transparent";
    _time_label.style.outline = "none";
    _time_label.style.textAlign = "left";
    _time_label.id = "time";
  }

  let _no_of_channels = (_screen.channels).length;
  App.chan_index_string = "";
  if (_no_of_channels > 0)
  {      
    let _div = document.createElement("DIV");
    App.CONTAINER.appendChild(_div);
    _div.innerHTML = "Ch &ensp; Value";
    _div.style.position = "absolute";
    _div.style.left = "15px";
    _div.style.top = "40px";
    _div.style.visibility = "hidden";
  }
  for (let _i = 0; _i < _no_of_channels; _i++)
  {  
    let _channel = _screen.channels[_i];
    let _disp = _channel.disp;
    let _bgcol = _disp.bgcol;
    let _color = _disp.col;

    let _chan_index_string = (_channel.index).toString();
    App.chan_index_string += _chan_index_string + ";";

    let _chanbkg = document.createElement("DIV");
    App.CONTAINER.appendChild(_chanbkg);

    let _active_label = document.createElement("BUTTON");
    _chanbkg.appendChild(_active_label);
    
    _active_label.innerHTML = "";
    let _textForButton = document.createTextNode("");
    _active_label.appendChild(_textForButton);

    _chanbkg.style.width = (_disp.size * 13.9).toString() + "px";
    _chanbkg.style.height = (_disp.size * 4.1 + 4).toString() + "px";
    _chanbkg.style.position = "absolute";
    _chanbkg.style.left = (_disp.pos.x + App.CANVAS_POS_X - _disp.size/2 + 1).toString() + "px";
    _chanbkg.style.top = (_disp.pos.y + App.CANVAS_POS_Y - _disp.size + 1).toString() + "px"; 
    _chanbkg.style.visibility = "hidden";
    _chanbkg.title = ""; 
    _chanbkg.style.fontSize = (_disp.size).toString() + "px";
    _chanbkg.style.color = "rgba(" + (_color.r).toString() + "," + (_color.g).toString() + "," + (_color.b).toString() + "," + (_color.a/255).toString() + ")";
    _chanbkg.style.backgroundColor = "rgba(" + (_bgcol.r).toString() + "," + (_bgcol.g).toString() + "," + (_bgcol.b).toString() + "," + (_bgcol.a/255).toString() + ")";

    _active_label.style.position = "absolute";
    _active_label.style.left = (_disp.size * 0.33).toString() + "px";
    _active_label.style.top = (_disp.size * 0.34).toString() + "px";
    _active_label.style.visibility = "visible";
    _active_label.title = ""; 
    _active_label.style.fontSize = (_disp.size).toString() + "px";
    _active_label.style.color = "rgba(" + (_color.r).toString() + "," + (_color.g).toString() + "," + (_color.b).toString() + "," + (_color.a/255).toString() + ")";
    _active_label.style.backgroundColor = "transparent";
    _active_label.style.border = "transparent";
    _active_label.style.outline = "none";
    _active_label.style.textAlign = "left";
    
    _chanbkg.id = "chanbkg_" + _chan_index_string;
    _active_label.id = "label_" + _chan_index_string;
    _chanbkg.addEventListener("mouseover", label_listener);
    _chanbkg.addEventListener("mouseleave", outside_label_listener);
    
    _channel.info = htmlSpaces(0) + "<br>" + "Measurement channel " + _chan_index_string + "<br>" + (_channel.label).toString() ;    
    _channel.padding = htmlSpaces(5) + "<br>" + htmlSpaces(10);
  }
  
  let _no_of_img_channels = (_screen.img_channels).length;
  App.img_chan_index_string = "";
  for (let _i = 0; _i < _no_of_img_channels; _i++)
  {
    let _img_channel = _screen.img_channels[_i];
    let _img_chan_index_string = (_img_channel.index).toString();
    App.img_chan_index_string += _img_chan_index_string + ";";
    let _img_disp_scale = _img_channel.dim.h / _img_channel.disp.h ;
    App.img_height = _img_channel.dim.h / _img_disp_scale; 
    App.img_width = _img_channel.dim.w / _img_disp_scale;
    App.canvas_shift_x = _img_channel.disp.pos.x;
    App.canvas_shift_y = _img_channel.disp.pos.y;
    //let _test_img = document.createElement("IMG");
    //_test_img.style.position = "absolute";
    //_test_img.height = "150px";
    //_test_img.width = "300px";
    //_test_img.style.left = "100px";
    //_test_img.style.top = "100px";
    //_test_img.id = "imgchan_" + _img_chan_index_string;
    //App.test_img = _test_img;
  }
  
  let _no_of_ctrl_channels = (_screen.ctrl_channels).length;
  App.ctrl_chan_index_string = "";
  for (let _i = 0; _i < _no_of_ctrl_channels; _i++)
  {
    let _ctrl_channel = _screen.ctrl_channels[_i];
    
    let _ctrl_disp = _ctrl_channel.disp;
    let _ctrl_color = _ctrl_disp.col;
    let _ctrl_bgcol = _ctrl_disp.bgcol;
    
    let _ctrl_chan_index_string = (_ctrl_channel.index).toString();
    App.ctrl_chan_index_string += _ctrl_chan_index_string + ";";

    let _ctrlbkg = document.createElement("DIV");

    App.CONTAINER.appendChild(_ctrlbkg);
    
    let _slider = document.createElement("INPUT");
    let _setval = document.createElement("BUTTON");
    let _send = document.createElement("BUTTON");

    _ctrlbkg.appendChild(_slider);
    _ctrlbkg.appendChild(_setval);
    _ctrlbkg.appendChild(_send);
    
    let _textForButton = document.createTextNode("");
    _setval.appendChild(_textForButton);

    _ctrlbkg.style.width = (_ctrl_disp.size * 10.8).toString() + "px";
    _ctrlbkg.style.height = (_ctrl_disp.size * 8.2).toString() + "px";
    _ctrlbkg.style.position = "absolute";
    _ctrlbkg.style.left = (_ctrl_disp.pos.x + App.CANVAS_POS_X - _ctrl_disp.size/2 + 7).toString() + "px";
    _ctrlbkg.style.top = (_ctrl_disp.pos.y + App.CANVAS_POS_Y - _ctrl_disp.size + 14).toString() + "px"; 
    _ctrlbkg.style.visibility = "hidden";
    _ctrlbkg.title = ""; 
    _ctrlbkg.style.fontSize = (_ctrl_disp.size).toString() + "px";
    _ctrlbkg.style.color = "rgba(" + (_ctrl_color.r).toString() + "," + (_ctrl_color.g).toString() + "," + (_ctrl_color.b).toString() + "," + (_ctrl_color.a/255).toString() + ")";
    _ctrlbkg.style.backgroundColor = "rgba(" + (_ctrl_bgcol.r).toString() + "," + (_ctrl_bgcol.g).toString() + "," + (_ctrl_bgcol.b).toString() + "," + (_ctrl_bgcol.a/255).toString() + ")";

    _slider.style.width = (_ctrl_disp.size * 9.0).toString() + "px";
    _slider.style.height = (_ctrl_disp.size * 1.8).toString() + "px";
    _slider.style.position = "absolute";
    _slider.style.left = (_ctrl_disp.size * 0.7).toString() + "px";
    _slider.style.top = (_ctrl_disp.size * 0.6).toString() + "px";
    _slider.style.visibility = "hidden";
    _slider.title = "";
    _slider.style.fontSize = (_ctrl_disp.size).toString() + "px";
    
    _setval.style.position = "absolute";
    _setval.style.left = (_ctrl_disp.size * 0.38).toString() + "px";
    _setval.style.top = (_ctrl_disp.size * 3.0).toString() + "px";
    _setval.style.visibility = "visible";
    _setval.title = ""; 
    _setval.style.fontSize = (_ctrl_disp.size).toString() + "px";
    _setval.style.color = "rgba(" + (_ctrl_color.r).toString() + "," + (_ctrl_color.g).toString() + "," + (_ctrl_color.b).toString() + "," + (_ctrl_color.a/255).toString() + ")";
    _setval.style.backgroundColor = "transparent";    
    _setval.style.border = "transparent";
    _setval.style.outline = "none";
    _setval.style.textAlign = "left";

    _send.style.width = (_ctrl_disp.size * 2.7).toString() + "px";
    _send.style.height = (_ctrl_disp.size * 1.6).toString() + "px";
    _send.style.position = "absolute";
    _send.style.left = (_ctrl_disp.size * 7.3).toString() + "px";
    _send.style.top = (_ctrl_disp.size * 3.1).toString() + "px";
    _send.style.visibility = "hidden";
    _send.title = ""; 
    _send.style.fontSize = (_ctrl_disp.size).toString() + "px";
    _send.disabled = true;
    _send.style.borderRadius = "10%";
    _send.style.opacity = "0.5";
    _send.style.textAlign = "center";

    _ctrlbkg.id = "ctrlbkg_" + _ctrl_chan_index_string;
    _slider.id = "slider_" + _ctrl_chan_index_string;
    _setval.id = "setval_" + _ctrl_chan_index_string;
    _send.id = "send_" + _ctrl_chan_index_string;

    _ctrlbkg.addEventListener("mouseover", label_listener);
    _ctrlbkg.addEventListener("mouseleave", outside_label_listener);
    
    _slider.type = "range";
    _slider.addEventListener("input", slider_listener);
    _slider.min = _ctrl_channel.min_val;
    _slider.max = _ctrl_channel.max_val;
    _slider.step = _ctrl_channel.val_step;
    _slider.value = _ctrl_channel.val;
    let _value_unit_string = "";
    if ( _ctrl_channel.min_str_val !== "" && _ctrl_channel.max_str_val !== "" && _ctrl_channel.str_val !== "" )
    {
      _slider.min = 0;
      _slider.max = 1;
      _slider.step = 1;
      _slider.value = 0;
      _value_unit_string = _ctrl_channel.min_str_val;
    }
    else _value_unit_string = (_ctrl_channel.val * _ctrl_channel.scale).toString().substring(0,_ctrl_channel.disp.len) + " " + _ctrl_channel.unit;
    
    _ctrl_channel.str_val = _value_unit_string;
    _ctrl_channel.info = htmlSpaces(0) + "<br>" + htmlSpaces(10) + "<br>" + "Control channel " + _ctrl_chan_index_string + "<br>" + (_ctrl_channel.label).toString() ;        
    _ctrl_channel.padding = htmlSpaces(0) + "<br>" + htmlSpaces(10) + "<br>" + htmlSpaces(10) ;        

    _setval.innerHTML = _value_unit_string + _ctrl_channel.padding; //+ "<br>" + htmlSpaces(10);
    _send.addEventListener("click", send_listener);
    _send.innerHTML = "Go"; //"<div style="text-align:center;">Go</div>";
  }

  reset_display_variables();
}
