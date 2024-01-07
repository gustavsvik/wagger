"use strict";


let A = new App();

let D = new Disp();



function setup()
{
  frameRate(A.FRAME_RATE);

  A.ntp.t1 = parseInt((new Date().valueOf()) * 1000) ;
  httpGet(A.CLIENT_URL + "server_time.php", "json", {}, handle_server_time);

  document.title = "LabRemote"; // New title :)
  A.CONTAINER = document.getElementById("myContainer");

  A.DISPLAY_SELECT = document.createElement("SELECT");
  A.DISPLAY_SELECT.id = "screen_select";
  A.CONTAINER.appendChild(A.DISPLAY_SELECT);
  A.DISPLAY_SELECT.addEventListener("change", display_select_listener);
  A.DISPLAY_SELECT.options[0] = new Option("Loading displays...", 0);

  Disp.setProperties( A.DISPLAY_SELECT.style,
  {
    position: "absolute",
    left: "10px",
    top: "10px",
    visibility: "visible"
  } ) ;

  let _screen_layout_file = document.getElementById("screenLayoutFile").value;
  let _screen_layout_params = {"screen_layout_file": _screen_layout_file};
  httpGet(A.CLIENT_URL + "get_screen_data.php", "json", _screen_layout_params, handle_display_data);
  A.img_url = A.FILES_URL + "0.png";
  A.display_image_loading = true;
  A.img = loadImage(A.img_url, handle_image_loaded);
  //A.test_img = loadImage("http://labremote.net/client/images/test.jpg", handle_image_loaded);
  A.img_width = 1280/(720/A.STD_SCALE_HEIGHT);
  A.img_height = 720/(720/A.STD_SCALE_HEIGHT);

  A.CANVAS = createCanvas(1500, 800);
  A.CANVAS.parent("myContainer");
  A.CANVAS.position(A.CANVAS_POS_X, A.CANVAS_POS_Y);
  //A.CANVAS.canvas.style.overflow = "hidden";
  //A.CONTAINER.requestFullscreen();
}


function draw()
{

  A.frames_active++;

  if (A.frames_active < A.display_timeout * A.FRAME_RATE && typeof A.DISPLAY_SELECT.style !== 'undefined')
  {
    //A.DISPLAY_SELECT.style.visibility = "visible";

    if (A.display_kiosk_interval > 0)
    {
      if (A.frames_active % (A.display_kiosk_interval * A.FRAME_RATE) === 0)
      {
        A.display_index++ ;
        if (A.display_index >= (D.data).length) A.display_index = 0 ;
        A.DISPLAY_SELECT.value = (A.display_index).toString() ;
        let _event = new Event('change') ;
        A.DISPLAY_SELECT.dispatchEvent(_event) ;
      }
    }

    //A.img = loadImage(A.img_url, handle_image_loaded);
    //A.test_img = loadImage("http://labremote.net/client/images/test.jpg", handle_image_loaded);

    D.setDisplayTextProperties(A.display_index, A.hovered_clicked_label, A.ntp.adjustment, A.MAX_DISPLAY_DIGITS, A.text_element_alpha, 255) ;

    if (A.frames_active - A.saved_frames > 5) A.saved_frames = A.frames_active;

  }

  A.text_element_alpha = 255;

  if ( (frameCount - A.last_time_sync >= A.NTP_SYNC_INTERVAL * A.FRAME_RATE) && A.frames_active < A.display_timeout * A.FRAME_RATE && A.display_is_static === false )
  {
    A.ntp.t1 = parseInt((new Date().valueOf()) * 1000) ;
    httpGet(A.CLIENT_URL + "server_time.php", "json", {}, handle_server_time);
    A.last_time_sync = frameCount;
  }

  if ( (frameCount - A.last_request >= A.REQUEST_INTERVAL * A.FRAME_RATE) && A.frames_active < A.display_timeout * A.FRAME_RATE && A.display_is_static === false)
  {
    if (A.chan_index_string !== "")
    {
      let _request_params = {"channels": A.chan_index_string, "start_time": A.start_time, "end_time": A.end_time, "duration": A.time_bins, "unit": A.time_bin_size, "delete_horizon": 3600};
      httpPost(A.CLIENT_URL + "send_request.php", "json", _request_params, handle_request_data);
    }
    if (A.img_chan_index_string !== "")
    {
      let _image_request_params = {"channels": A.img_chan_index_string, "start_time": A.start_time, "end_time": A.end_time, "duration": A.time_bins, "unit": A.time_bin_size, "delete_horizon": 3600};
      httpPost(A.CLIENT_URL + "send_request.php", "json", _image_request_params, handle_request_data);
    }
    A.last_request = frameCount;
  }

  if ( (frameCount - A.last_get >= A.REQUEST_INTERVAL * A.FRAME_RATE) && A.frames_active < A.display_timeout * A.FRAME_RATE && A.display_is_static === false)
  {
    if (A.ctrl_chan_index_string !== "")
    {
      let _ctrl_get_params = {"channels": A.ctrl_chan_index_string, "start_time": A.start_time, "end_time": A.end_time, "duration": -9999, "unit": A.time_bin_size, "lowest_status": 1};
      httpPost(A.CLIENT_URL + "get_uploaded.php", "json", _ctrl_get_params, handle_get_data);
    }
    if (A.chan_index_string !== "")
    {
      let _get_params = {"channels": A.chan_index_string, "start_time": A.start_time, "end_time": A.end_time, "duration": A.time_bins, "unit": A.time_bin_size, "lowest_status": 0};
      httpPost(A.CLIENT_URL + "get_uploaded.php", "json", _get_params, handle_get_data);
    }
    if (A.img_chan_index_string !== "")
    {
      let _image_get_params = {"channels": A.img_chan_index_string, "start_time": A.start_time, "end_time": A.end_time, "duration": A.time_bins, "unit": A.time_bin_size, "lowest_status": 0};
      httpPost(A.CLIENT_URL + "get_uploaded.php", "json", _image_get_params, handle_get_data);
    }
    A.last_get = frameCount;
  }
/*
  if ( (frameCount - A.last_get >= A.REQUEST_INTERVAL * A.FRAME_RATE) && A.frames_active < A.display_timeout * A.FRAME_RATE)
  {
    if (A.ctrl_chan_index_string !== "")
    {
      let _retrieve_params = {"channels": A.ctrl_chan_index_string, "start_time": A.start_time, "end_time": A.end_time, "duration": A.time_bins, "unit": A.time_bin_size, "subsample_file": ".txt"};
      httpPost(A.CLIENT_URL + "get_ctrl_state.php", "json", _retrieve_params, handle_get_ctrl);
      //A.last_get_ctrl = frameCount;
    }
  }
*/
  if ( A.pressed_send !== null && A.moved_slider !== null && A.display_is_static === false)
  {
    let _fields = (A.moved_slider.id).split("_");
    let _send_index_string = _fields[1] + ";";
    let _ctrl_request_params = {"channels": _send_index_string, "start_time": A.start_time, "end_time": A.end_time, "value": A.moved_slider.value, "duration": 0, "unit": 1, "delete_horizon": 10};
    A.moved_slider = null;
    A.pressed_send = null;
    httpPost(A.CLIENT_URL + "send_request.php", "json", _ctrl_request_params, handle_control_request_data);
    //radioVal = newRadioVal;
  }


  A.ntp.timestamp = parseInt((new Date().valueOf()) / 1000) + A.ntp.adjustment / 1000000;


  if (!A.display_timed_out) // typeof A.DISPLAY_SELECT.style !== 'undefined' &&
  {
    if (A.frames_active >= A.display_timeout * A.FRAME_RATE)
    {
      A.display_timed_out = true;
      background(255);
      Disp.removeAllElements(A.CONTAINER, ["BUTTON", "DIV", "INPUT", "OUTPUT"]);
      A.display_image_loading = true;
      A.img = loadImage(A.FILES_URL + "000.jpg", handle_image_loaded);
      //A.test_img = loadImage("http://labremote.net/client/images/test.jpg", handle_image_loaded);
      A.DISPLAY_TIMEOUT_TEXT = document.createElement("DIV");
      A.CONTAINER.appendChild(A.DISPLAY_TIMEOUT_TEXT);
      A.DISPLAY_TIMEOUT_TEXT.innerHTML = "Timeout due to inactivity - please reload page to continue data transfer!";
      Disp.setProperties( A.DISPLAY_TIMEOUT_TEXT.style,
      {
        width: (parseInt(A.img_width)).toString() + "px",
        height: (parseInt(A.TIMEOUT_FONTSIZE)).toString() + "px",
        position: "absolute",
        //left: (parseInt(A.CANVAS_POS_X + A.canvas_shift_x + Math.max(A.img_width/2 - A.TIMEOUT_FONTSIZE*23.2 + 135, 0))).toString() + "px",
        //top: (parseInt(A.CANVAS_POS_Y + A.canvas_shift_y + A.img_height/2 - A.TIMEOUT_FONTSIZE/2)).toString() + "px",
        //fontSize: (parseInt(A.TIMEOUT_FONTSIZE)).toString() + "px",
        fontFamily: A.all_font_families,
        color: Disp.rGBALiteralFromArray(A.STANDARD_FOREGROUND_COLOR),
        textAlign: "left",
        visibility: "visible"
      } ) ;

      reset_display_variables();
    }
    else
    {
      let _lag_text = "";
      let _status_text = "";

      if (A.display_image_loading && A.display_is_static) _status_text = Disp.htmlSpaces(14) + "Loading image..." ;

      let _view_lag = A.ntp.timestamp - A.data_timestamp;
      if ( _view_lag > A.time_bins * A.time_bin_size || !navigator.onLine )
      {
        if (!App.isValidNumber(_view_lag) || _view_lag > 10*365*24*60*60 )
        {
        }
        else if (!A.display_is_static) // display is not static
        {
          _lag_text = "Out of date (" + Disp.getTimeLagText(_view_lag) + "), ";
          _status_text = "requested new...";
          if (A.display_image_loading) _status_text = "loading image..." ;
        }
      }

      if (!navigator.onLine) _status_text = "no internet connection!";
      if (typeof A.DISPLAY_INFO_TEXT.style !== 'undefined')
      {
        if (A.frames_active % 2 === 0) A.DISPLAY_INFO_TEXT.style.color = Disp.rGBALiteralFromArray([255,0,0,127]); else A.DISPLAY_INFO_TEXT.style.color = Disp.rGBALiteralFromArray([255,255,255,127]) ;
        A.DISPLAY_INFO_TEXT.innerHTML =  _lag_text + _status_text;
        A.DISPLAY_INFO_TEXT.style.visibility = "visible";
      }
    }
  }

}


function handle_image_loaded()
{
  //console.log(A.data_timestamp);
  A.display_image_loading = false;

  if (A.display_browser_viewport)
  {
    let _current_viewport = window.visualViewport;
    A.display_viewport = {};
    A.display_viewport.w = _current_viewport.width;
    A.display_viewport.h = _current_viewport.height;
  }

  let _current_imgs = {};
  _current_imgs[0] = A.img;
  //_current_imgs[1] = A.test_img;

  let _display = D.data[A.display_index];
  if (typeof _display !== 'undefined')
  {
    let _screen = _display.screens[0];
    A.setCanvasAutoScaleCenter(_screen.imgs, _current_imgs);
    A.setCanvasAutoScaleCenter(_screen.img_channels, _current_imgs);

    A.show_lag_warning_text = false;

    A.placeAndSizeCanvasText(A.DISPLAY_INFO_TEXT, A.WARNING_FONTSIZE, 8.0, 0)
    Disp.setProperties( A.DISPLAY_INFO_TEXT.style,
    {
      visibility: "hidden"
    } ) ;

    if (A.display_timed_out) A.placeAndSizeCanvasText(A.DISPLAY_TIMEOUT_TEXT, A.TIMEOUT_FONTSIZE, 26.0, 130)

    A.placeAndSizeCanvasElements([_screen.time], "timebkg", 1, 1) ;
    A.placeAndSizeCanvasElements(_screen.channels, "chanbkg", 1, 1) ;
    A.placeAndSizeCanvasElements(_screen.ctrl_channels, "ctrlbkg", 7, 14) ;
  }

  for (let _i = 0; _i <= 0; _i++)
  {
    //_current_imgs[_i].canvas.style.overflow = "hidden";
    image(_current_imgs[_i], A.canvas_shift_x, A.canvas_shift_y, A.img_width*(1-0.5*_i), A.img_height*(1-0.5*_i) );
  }
}


function handle_server_time(data)
{
  A.ntp.t2 = parseInt( data.receivetime / 1 );
  A.ntp.t3 = parseInt( data.transmittime / 1 );
  A.ntp.t4 = parseInt( (new Date().valueOf()) * 1000 ) ;
  A.ntp.adjustment = parseInt( ( ( A.ntp.t2 - A.ntp.t1 ) + ( A.ntp.t3 - A.ntp.t4 ) ) / 2 ) ; //- A.view_timestamp ;
}


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
  /* TODO: Call App.decodeTransferString here. */
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
    let _byte_string_array = [];
    for (let _sample_index = 0; _sample_index < _field_data_array_length ; _sample_index++)
    {
      _timestamp_array[_sample_index] = parseInt( _channel_data_array[_sample_index*4+0] );
      _value_array[_sample_index] = parseFloat(_channel_data_array[_sample_index*4+1]);
      _byte_string_array[_sample_index] = Transform.fromArmoredString(_channel_data_array[_sample_index*4+3]);
    }
    _timestamp_matrix.push(_timestamp_array);
    const _channelInt = parseInt(_channel_string);
    _value_matrix.push([_channelInt, _value_array, _byte_string_array]);
  }
  populate_display_variables(_timestamp_matrix, _value_matrix);

  A.text_element_alpha = 127;
}


function populate_display_variables(timestamp_matrix, value_matrix)
{
  let _server_timestamp = A.ntp.timestamp ;
  if ( App.isValidGT(_server_timestamp, 0) )
  {
    A.server_timestamp = _server_timestamp;
    let _latest_time = new Date( _server_timestamp * 1000 );
    let _latest_time_string = "";
    if ( App.isValidDate(_latest_time) )
    {
      _latest_time_string = _latest_time.toISOString();
      A.ntp.time_string = (_latest_time_string.substring(0,10)).concat( " ", _latest_time_string.substring(11,19), " ", A.TIME_ZONE );
      A.server_time_string = A.ntp.time_string ;
    }
    else A.server_time_string = A.WAIT_MESSAGE;

    let _screen = D.data[A.display_index].screens[0];
    let _time = _screen.time;
    if (_time !== null)
    {
      _time.str_val = A.server_time_string;
      _time.val = A.server_timestamp;
    }

    let _latest_data_timestamp = -Infinity;
    let _timestamp_index = -1;
    while ( _latest_data_timestamp < 0 )
    {
      _timestamp_index++;
      _latest_data_timestamp = App.nthMaxOfArray(timestamp_matrix[_timestamp_index], 0);
}

    if ( App.isValidGT(_latest_data_timestamp, 0) )
    {
      A.data_timestamp = _latest_data_timestamp;
      let _latest_time = new Date( _latest_data_timestamp * 1000 );
      let _latest_time_string = "";
      if ( App.isValidDate(_latest_time) )
      {
        _latest_time_string = _latest_time.toISOString();
        A.data_time_string = (_latest_time_string.substring(0,10)).concat( " ", _latest_time_string.substring(11,19), " ", A.TIME_ZONE );
      }
      else A.data_time_string = A.WAIT_MESSAGE;

      for (let _img_channel_index = 0; _img_channel_index < _screen.img_channels.length; _img_channel_index++)
      {
        let _img_channel = _screen.img_channels[_img_channel_index];
        let _img_url = A.FILES_URL + _img_channel.index.toString() + "_" + _latest_data_timestamp.toString() + "." + _img_channel.ext;
        A.img_url = _img_url;
        A.display_image_loading = true;
        A.img = loadImage(_img_url, handle_image_loaded);
      }
      for (let _channel_index = 0; _channel_index < _screen.channels.length; _channel_index++)
      {
        let _channel = _screen.channels[_channel_index];
        let _found_values_index = GetSafe.indexByAttrs(value_matrix, [0], [_channel.index]);
        if (_found_values_index > -1)
        {
          const _channel_values = (value_matrix[_found_values_index])[1];
          const _latestIndex = _channel_values.length - 1 ;
          let _latest_value = _channel_values[_latestIndex];
          const _channelKey = GetSafe.byKey(_channel, "key", "");
          if (_channelKey !== null && _channelKey !== "")
          {
            const _channel_byte_strings = (value_matrix[_found_values_index])[2];
            const _byte_string_json = GetSafe.json( _channel_byte_strings[_latestIndex] );
            _latest_value = parseFloat( GetSafe.byKey(_byte_string_json[0][3], _channelKey) ) ;
          }
          _channel.val = _latest_value * _channel.scale;
          if ( App.isValidNumber(_channel.val) ) _channel.str_val = Help.rounded_string(_channel.val, _channel.disp.len) + " " + _channel.unit;
          //_channel.str_val = (_channel.val).toString().substring(0,_channel.disp.len)
          else _channel.str_val = A.WAIT_MESSAGE;
        }
      }
      for (let _ctrl_index = 0; _ctrl_index < _screen.ctrl_channels.length; _ctrl_index++)
      {
        let _ctrl = _screen.ctrl_channels[_ctrl_index];
        let _found_values_index = GetSafe.indexByAttrs(value_matrix, [0], [_ctrl.index]);
        if (_found_values_index > -1)
        {
          let _ctrl_values = (value_matrix[_found_values_index])[1];
          let _latest_value = _ctrl_values[_ctrl_values.length - 1];
          _ctrl.val = _latest_value * _ctrl.scale;
          if ( App.isValidNumber(_ctrl.val) ) _ctrl.str_val = Help.rounded_string(_ctrl.val, _ctrl.disp.len) + " " + _ctrl.unit;
          //_ctrl.str_val = (_ctrl.val).toString().substring(0,_ctrl.disp.len)
          else _ctrl.str_val = A.WAIT_MESSAGE;
        }
      }
    }
  }
}


function reset_display_variables()
{
  A.server_time_string = A.WAIT_MESSAGE;
  A.data_timestamp = A.ntp.timestamp; // Prevent false lag indication prior to data acquisition from channels on newly selected display

  let _screen = D.data[A.display_index].screens[0];
  let _time = _screen.time;
  if (_time !== null)
  {
    A.display_is_static = false;
    for (let _channel_index = 0; _channel_index < _screen.channels.length; _channel_index++)
    {
      _screen.channels[_channel_index].str_val = A.WAIT_MESSAGE;
    }
  }
  else
  {
    A.display_is_static = true;
  }
}

function mousePressed()
{
  //if (isOverOn == true || isOverOff == true)
  //{
    //let _control_request_params = {"channels": A.ctrl_chan_index_string, "start_time": A.start_time, "end_time": A.end_time, "duration": A.time_bins, "unit": A.time_bin_size, "setvalue": setvalue};
    //httpPost(A.CLIENT_URL + "request_control.php", "json", _control_request_params, handle_control_request_data);
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
  D.data = data.displays;

  if (typeof data.disp_timeout !== 'undefined') A.display_timeout = data.disp_timeout;
  if (typeof data.disp_viewport_size !== 'undefined')
  {
    if (data.disp_viewport_size === "browser") A.display_browser_viewport = true;
    else A.display_viewport = data.disp_viewport_size;
  }
  if (typeof data.disp_override_font !== 'undefined') A.display_override_font = data.disp_override_font;

  if (typeof data.disp_kiosk_interval !== 'undefined') A.display_kiosk_interval = data.disp_kiosk_interval;
  if (A.display_kiosk_interval) A.CONTAINER.parentNode.style.overflow = "hidden";

  if (typeof data.disp_kiosk_adjust !== 'undefined') A.display_kiosk_adjust = data.disp_kiosk_adjust;
  if (typeof data.disp_kiosk_override_height !== 'undefined') A.display_kiosk_height = data.disp_kiosk_override_height;

  A.all_font_families = Disp.addFonts([A.display_override_font.filename], A.display_override_font.path) + ", " + A.STANDARD_FONT_FAMILIES ;

  A.DISPLAY_SELECT.options.length = 0 ;

  for (let _current_display = 0; _current_display < (D.data).length; _current_display++)
  {
    A.DISPLAY_SELECT.options[A.DISPLAY_SELECT.options.length] = new Option(D.data[_current_display].title, _current_display);
  }

  display_select_listener();
}


function label_listener()
{
  let _element = this;

  if (typeof _element !== 'undefined')
  {
    display_label(_element);
    /*
    A.hovered_clicked_label = _element ;
    _element.style.visibility = "visible";
    let [_tag, _index] = Disp.getTagChannelIndex(_element);

    if (_tag === "timebkg")
    {
      let _time_label = Disp.getChannelElement (["timelabel", null]);
      if (_time_label !== null)
      {
        _time_label.style.visibility = "visible";
        let _time = (D.data[A.display_index]).screens[0].time;
        let _str_val = _time.str_val + _time.info;
        _time_label.innerHTML = _str_val + ( - A.ntp.adjustment / 1000000 ).toString().substring(0,7) + " s";
      }
    }

    let _setval = Disp.getChannelElement (["setval", _index]);
    if (_setval !== null)
    {
      _setval.style.visibility = "visible";
      let _ctrl_channels = (D.data[A.display_index]).screens[0].ctrl_channels;
      let _ctrl_index = GetSafe.indexByAttrs(_ctrl_channels, ["index"], [parseInt(_index)] );
      let _ctrl_channel = _ctrl_channels[_ctrl_index];
      let _value_unit_string = "";
      if ( _ctrl_channel.str_val !== "" ) _value_unit_string = _ctrl_channel.str_val;
      else _value_unit_string = (_ctrl_channel.val * _ctrl_channel.scale).toString().substring(0,_ctrl_channel.disp.len) + " " + _ctrl_channel.unit;
      let _str_val = _value_unit_string + _ctrl_channel.info;
      _setval.innerHTML = _str_val;
      let _slider = Disp.getChannelElement (["slider", _index]);
      if (_slider !== null)
      {
        _slider.style.visibility = "visible";
        if (_ctrl_channel.type === "datetime")
        {
        }
        else
        {
          _slider.value = _ctrl_channel.val;
        }
      }
      let _send = Disp.getChannelElement (["send", _index]);
      if (_send !== null) _send.style.visibility = "visible";
    }

    let _label = Disp.getChannelElement (["label", _index]);
    if (_label !== null)
    {
      _label.style.visibility = "visible";
      let _channels = (D.data[A.display_index]).screens[0].channels;
      let _chan_index = GetSafe.indexByAttrs(_channels, ["index"], [parseInt(_index)] );
      let _channel = _channels[_chan_index];
      let _value_unit_string = "";
      //if ( _channel.str_val !== "" ) _value_unit_string = _channel.str_val;
      //else
      _value_unit_string = (_channel.val).toString().substring(0, A.MAX_DISPLAY_DIGITS) + " " + _channel.unit;  // .substring(0,12)
      let _str_val = _value_unit_string + _channel.info;
      _label.innerHTML = _str_val;
    }
    */
  }
}

function display_label(_element)

{
    A.hovered_clicked_label = _element ;

    _element.style.visibility = "visible";
    let [_tag, _index, _key] = Disp.getTagChannelIndex(_element);

    if (_tag === "timebkg")
    {
      let _time_label = Disp.getChannelElement (["timelabel", null]);
      if (_time_label !== null)
      {
        _time_label.style.visibility = "visible";
        let _time = (D.data[A.display_index]).screens[0].time;
        let _str_val = _time.str_val + _time.info;
        _time_label.innerHTML = _str_val + ( - A.ntp.adjustment / 1000000 ).toString().substring(0,7) + " s";
      }
    }

    let _setval = Disp.getChannelElement (["setval", _index, _key]);
    if (_setval !== null)
    {
      let _ctrl_channels = (D.data[A.display_index]).screens[0].ctrl_channels;
      let _ctrl_index = GetSafe.indexByAttrs(_ctrl_channels, ["index"], [parseInt(_index)] );
      let _ctrl_channel = _ctrl_channels[_ctrl_index];
      let _value_unit_string = "";
      if ( _ctrl_channel.str_val !== "" ) _value_unit_string = _ctrl_channel.str_val;
      else _value_unit_string = Help.rounded_string(_ctrl_channel.val * _ctrl_channel.scale, _ctrl_channel.disp.len) + " " + _ctrl_channel.unit;
      // _value_unit_string = (_ctrl_channel.val * _ctrl_channel.scale).toString().substring(0,_ctrl_channel.disp.len)
      let _str_val = _value_unit_string + _ctrl_channel.info;
      _setval.innerHTML = _str_val;
      _setval.style.visibility = "visible";
      let _slider = Disp.getChannelElement (["slider", _index]);
      if (_slider !== null)
      {
        _slider.style.visibility = "visible";
        if (_ctrl_channel.type === "datetime")
        {
        }
        else
        {
          _slider.value = _ctrl_channel.val;
        }
      }
      let _send = Disp.getChannelElement (["send", _index, _key]);
      if (_send !== null) _send.style.visibility = "visible";
    }

    let _label = Disp.getChannelElement (["label", _index, _key]);
    if (_label !== null)
    {
      _label.style.visibility = "visible";
      let _channels = (D.data[A.display_index]).screens[0].channels;
      let _chan_index = null
      if (_key !== null && _key !== "")
        _chan_index = GetSafe.indexByAttrs(_channels, ["index", "key"], [parseInt(_index), _key] );
      else
        _chan_index = GetSafe.indexByAttrs(_channels, ["index"], [parseInt(_index)] );
      let _channel = _channels[_chan_index];
      let _value_unit_string = "";
      if ( App.isValidNumber(_channel.val) ) _value_unit_string = Help.rounded_string(_channel.val, _channel.disp.len) + " " + _channel.unit; //_channel.str_val = Help.rounded_string(_channel.val, _channel.disp.len) + " " + _channel.unit;
      else _channel.str_val = A.WAIT_MESSAGE;
      let _str_val = _value_unit_string + _channel.info;
      _label.innerHTML = _str_val;
    }
}

function outside_label_listener()
{
  let _element = this;

  if (typeof _element !== 'undefined')
  {
    A.hovered_clicked_label = null ;

    let [_tag, _index, _key] = Disp.getTagChannelIndex(_element);

    if (_tag === "timebkg")
    {
      let _time_label = Disp.getChannelElement (["timelabel", null]);
      if (_time_label !== null)
      {
        let _time = (D.data[A.display_index]).screens[0].time;
        let _str_val = _time.str_val ;
        _time_label.innerHTML = _str_val + Disp.htmlSpaces(0) + "<br>" + Disp.htmlSpaces(10) ;
      }
      _element.style.visibility = "hidden";
    }

    if (_tag === "chanbkg")
    {
      let _label = Disp.getChannelElement (["label", _index, _key]);
      let _channels = (D.data[A.display_index]).screens[0].channels;
      let _chan_index = null
      if (_key !== null && _key !== "")
        _chan_index = GetSafe.indexByAttrs(_channels, ["index", "key"], [parseInt(_index), _key] );
      else
        _chan_index = GetSafe.indexByAttrs(_channels, ["index"], [parseInt(_index)] );
      let _channel = _channels[_chan_index];
      let _value_unit_string = "";
      _value_unit_string = Help.rounded_string(_channel.val, _channel.disp.len) + " " + _channel.unit;  // .substring(0,12)
      let _str_val = _value_unit_string + ""; //_channel.info;
      _label.innerHTML = _str_val; //if (typeof _key !== "string")
      _element.style.visibility = "hidden";
    }

    let _ctrl_channels = (D.data[A.display_index]).screens[0].ctrl_channels;
    let _ctrl_index = GetSafe.indexByAttrs(_ctrl_channels, ["index"], [parseInt(_index)] );
    let _ctrl_channel = _ctrl_channels[_ctrl_index];

    if ( typeof _ctrl_channel !== 'undefined' && !(_ctrl_channel.show == true && _ctrl_channel.lock == true) )
    {
      let _setval = Disp.getChannelElement (["setval", _index]);
      if (_setval !== null)
      {
        _element.style.visibility = "hidden";
        let _send = Disp.getChannelElement (["send", _index]);
        if (_send !== null) _send.style.visibility = "hidden";
        let _slider = Disp.getChannelElement (["slider", _index]);
        if (_slider !== null) _slider.style.visibility = "hidden";
      }
      let _value_unit_string = "";
      if ( _ctrl_channel.str_val !== "" ) _value_unit_string = _ctrl_channel.str_val;
      else _value_unit_string = Help.rounded_string(_ctrl_channel.val * _ctrl_channel.scale, _ctrl_channel.disp.len) + " " + _ctrl_channel.unit;
      // (_ctrl_channel.val  *_ctrl_channel.scale).toString().substring(0,_ctrl_channel.disp.len)
      _setval.innerHTML = _value_unit_string + Disp.htmlSpaces(0) + "<br>" + Disp.htmlSpaces(10) ;

      let _label = Disp.getChannelElement (["label", _index]);
      if (_label !== null)
      {
        let _channels = (D.data[A.display_index]).screens[0].channels;
        let _chan_index = GetSafe.indexByAttrs(_channels, ["index"], [parseInt(_index)] );
        let _channel = _channels[_chan_index];
        let _value_unit_string = "";
        if ( _channel.str_val !== "" ) _value_unit_string = _channel.str_val;
        else _value_unit_string = Help.rounded_string(_channel.val, _channel.disp.len) + " " + _channel.unit;
        // (_channel.val  *_channel.scale).toString().substring(0,_channel.disp.len)
        _label.innerHTML = _value_unit_string + Disp.htmlSpaces(0) + "<br>" + Disp.htmlSpaces(10) ;
      }
    }
  }
}


function send_listener()
{
  let _send = this;
  if (typeof _send !== 'undefined')
  {
    _send.disabled = true;
    _send.style.opacity = "0.5";
    A.pressed_send = _send;
  }
}


function slider_listener()
{
  let _slider = this;
  if (typeof _slider !== 'undefined')
  {
    let [_tag, _index_string] = Disp.getTagChannelIndex(_slider);
    let _setval = Disp.getChannelElement (["setval", _index_string]);
    let _send = Disp.getChannelElement (["send", _index_string]);
    let _slider_index = parseInt(_index_string);
    let _slider_value = parseFloat(_slider.value);
    _send.disabled = false;
    _send.style.opacity = "1.0"  ;

    let _ctrl_channel = [];
    let _ctrl_channels = (D.data[A.display_index]).screens[0].ctrl_channels;
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
    else _value_unit_string = Help.rounded_string(_slider_value  *_ctrl_channel.scale, _ctrl_channel.disp.len) + " " + _ctrl_channel.unit;

    _ctrl_channel.str_val = _value_unit_string;
    _ctrl_channel.val = _slider_value;

    _value_unit_string += _ctrl_channel.info;

    _setval.innerHTML = _value_unit_string;

    A.moved_slider = _slider;
  }
}


function display_select_listener()
{

  if (!A.display_timed_out)
  {

    background(255);
    A.saved_frames = 0;
    if (A.display_kiosk_interval === 0)
    {
      A.frames_active = 0;
    }
    else
    {
      let _adjust = A.display_kiosk_adjust ;
      //window.scrollTo(A.CANVAS_POS_X, A.CANVAS_POS_Y);
      window.scrollTo(A.CANVAS_POS_X + _adjust.x, A.CANVAS_POS_Y + _adjust.y);
    }

    A.channel_strings_array = [];

    Disp.removeAllElements(A.CONTAINER, ["BUTTON", "DIV", "INPUT", "OUTPUT"]);

    A.display_index = parseInt(A.DISPLAY_SELECT.options[A.DISPLAY_SELECT.selectedIndex].value);

    let _display = D.data[A.display_index];
    let _screen = _display.screens[0];

    let no_of_imgs = (_screen.imgs).length;
    if (no_of_imgs > 0)
    {
      for (let i = 0; i < no_of_imgs; i++)
      {
        let _img = _screen.imgs[i];
        if (i === 0) A.img_url = A.FILES_URL + (_img.file).toString();
        A.display_image_loading = true;
        A.img = loadImage(A.img_url, handle_image_loaded);
        if (_img.disp.pos !== "center")
        {
          A.canvas_shift_x = _img.disp.pos.x;
          A.canvas_shift_y = _img.disp.pos.y;
        }
        if (_img.dim !== "source")
        {
          let _width = _img.dim.w ;
          let _height = _img.dim.h ;
          if (A.display_kiosk_height > 0) _img.disp.h = A.display_kiosk_height ;
          let _img_disp_scale = _height / _img.disp.h ;
          A.display_img_scale = _img.disp.h / A.STD_SCALE_HEIGHT ;
          //if (A.display_kiosk_height > 0) _img_disp_scale = _height / A.display_kiosk_height ;
          A.img_height = _height / _img_disp_scale;
          A.img_width = _width / _img_disp_scale;
        }
      }
    }
    else
    {
      A.img_url = A.FILES_URL + "00.jpg";
      A.display_image_loading = true;
      A.img = loadImage(A.img_url, handle_image_loaded);
      //A.test_img = loadImage("http://labremote.net/client/images/test.jpg", handle_image_loaded);
    }

    A.DISPLAY_INFO_TEXT = document.createElement("DIV");
    A.CONTAINER.appendChild(A.DISPLAY_INFO_TEXT);
    Disp.setProperties( A.DISPLAY_INFO_TEXT.style,
    {
      width: (parseInt(A.img_width)).toString() + "px",
      height: (parseInt(A.WARNING_FONTSIZE)).toString() + "px",
      position: "absolute",
      left: (parseInt(A.CANVAS_POS_X + A.canvas_shift_x + Math.max(A.img_width/2 - A.WARNING_FONTSIZE*7.0, 0))).toString() + "px",
      top: (parseInt(A.CANVAS_POS_Y + A.canvas_shift_y + A.img_height/2 - A.WARNING_FONTSIZE/2)).toString() + "px",
      fontSize: (parseInt(A.WARNING_FONTSIZE * A.display_img_scale/A.display_img_scale)).toString() + "px",
      fontFamily: A.all_font_families,
      textAlign: "left",
      visibility: "hidden"
    } ) ;
    A.DISPLAY_INFO_TEXT.id = "infotext";


    let _time = _screen.time;
    if (_time !== null) // Any display but the title page
    {
      A.time_bins = _time.bins;
      A.time_bin_size = _time.bin_size;

      let _time_disp = _time.disp;
      let _time_color = _time_disp.col;
      let _time_bgcol = _time_disp.bgcol;

      let _timebkg = document.createElement("DIV");
      A.CONTAINER.appendChild(_timebkg);
      let _time_active_label = document.createElement("BUTTON");
      _timebkg.appendChild(_time_active_label);

      _time_active_label.innerHTML = "";
      let _time_active_label_text = document.createTextNode("");
      _time_active_label.appendChild(_time_active_label_text);

      _timebkg.title = "";

      const _left_time = _time_disp.pos.x * A.display_img_scale + A.CANVAS_POS_X + A.canvas_shift_x - _time_disp.size/2 + 1 ;
      const _top_time = _time_disp.pos.y * A.display_img_scale + A.CANVAS_POS_Y + A.canvas_shift_y - _time_disp.size + 1 ;
      Disp.setProperties( _timebkg.style,
      {
        width: (_time_disp.size * 14.3).toString() + "px",
        height: (_time_disp.size * 4.1 + 4).toString() + "px",
        position: "absolute",
        left: _left_time.toString() + "px",
        top: _top_time.toString() + "px",
        visibility: "hidden",
        fontSize: (parseInt(_time_disp.size * A.display_img_scale/A.display_img_scale)).toString() + "px",
        fontFamily: A.all_font_families,
        color: Disp.rGBALiteralFromArray([_time_color.r,_time_color.g,_time_color.b,_time_color.a]),
        backgroundColor: Disp.rGBALiteralFromArray([_time_bgcol.r,_time_bgcol.g,_time_bgcol.b,_time_bgcol.a])
      } ) ;

      _time_active_label.title = "";
      const _left_time_active_label = _time_disp.size * 0.33 ;
      const _top_time_active_label = _time_disp.size * 0.34 ;
      Disp.setProperties( _time_active_label.style,
      {
        position: "absolute",
        left: _left_time_active_label.toString() + "px",
        top: _top_time_active_label.toString() + "px",
        visibility: "visible",
        fontSize: (parseInt(_time_disp.size * A.display_img_scale/A.display_img_scale)).toString() + "px",
        fontFamily: A.all_font_families,
        color: Disp.rGBALiteralFromArray([_time_color.r,_time_color.g,_time_color.b,_time_color.a]),
        backgroundColor: "transparent",
        border: "transparent",
        outline: "none",
        textAlign: "left"
      } ) ;

      _timebkg.id = "timebkg" ;
      _time_active_label.id = "timelabel" ;
      _timebkg.addEventListener("mouseover", label_listener);
      _timebkg.addEventListener("mouseleave", outside_label_listener);

      _time.info = Disp.htmlSpaces(0) + "<br>" + "Last server response (NTP)" + "<br>" + "Client time offset: " ;
      _time.padding = Disp.htmlSpaces(5) + "<br>" + Disp.htmlSpaces(10);
    }

    let _no_of_channels = (_screen.channels).length;
    A.chan_index_string = "";

    let _unique_channel_index_strings = [];

    for (let _i = 0; _i < _no_of_channels; _i++)
    {
      let _channel = _screen.channels[_i];
      let _disp = _channel.disp;
      let _bgcol = _disp.bgcol;
      let _color = _disp.col;

      let _chan_index_string = (_channel.index).toString();

      if ( ! _unique_channel_index_strings.includes(_chan_index_string) )
      {
        A.chan_index_string += _chan_index_string + ";";
        _unique_channel_index_strings.push(_chan_index_string);
      }
      const _chanElemKey = (GetSafe.byKey(_channel, "key", "")).toString();

      let _chanbkg = document.createElement("DIV");
      A.CONTAINER.appendChild(_chanbkg);

      let _active_label = document.createElement("BUTTON");
      _chanbkg.appendChild(_active_label);

      _active_label.innerHTML = "";
      let _active_label_text = document.createTextNode("");
      _active_label.appendChild(_active_label_text);

      _chanbkg.title = "";
      //height: (_disp.size * 4.1 + 4).toString() + "px",
      const _left_chanbkg = _disp.pos.x * A.display_img_scale + A.CANVAS_POS_X + A.canvas_shift_x - _disp.size/2 + 1 ;
      const _top_chanbkg = _disp.pos.y * A.display_img_scale + A.CANVAS_POS_Y + A.canvas_shift_y - _disp.size + 1 ;
      Disp.setProperties( _chanbkg.style,
      {
        width: (_disp.size * 13.9).toString() + "px",
        height: (_disp.size * 2.8 + 3).toString() + "px",
        position: "absolute",
        left: _left_chanbkg.toString() + "px",
        top: _top_chanbkg.toString() + "px",
        visibility: "hidden",
        fontSize: (parseInt(_disp.size * A.display_img_scale)).toString() + "px",
        fontFamily: A.all_font_families,
        color: Disp.rGBALiteralFromArray([_color.r,_color.g,_color.b,_color.a]),
        backgroundColor: Disp.rGBALiteralFromArray([_bgcol.r,_bgcol.g,_bgcol.b,_bgcol.a])
      } ) ;

      _active_label.title = "";
      const _left_active_label = _disp.size * 0.33 ;
      const _top_active_label = _disp.size * 0.34 ;
      Disp.setProperties( _active_label.style,
      {
        position: "absolute",
        left: _left_active_label.toString() + "px",
        top: _top_active_label.toString() + "px",
        visibility: "visible",
        fontSize: (parseInt(_disp.size * A.display_img_scale/A.display_img_scale)).toString() + "px",
        fontFamily: A.all_font_families,
        color: Disp.rGBALiteralFromArray([_color.r,_color.g,_color.b,_color.a]),
        backgroundColor: "transparent",
        border: "transparent",
        outline: "none",
        textAlign: "left"
      } ) ;

      _chanbkg.id = "chanbkg_" + _chan_index_string ;
      if (_chanElemKey !== null) _chanbkg.id += "_" + _chanElemKey ;
      _active_label.id = "label_" + _chan_index_string;
      if (_chanElemKey !== null && _chanElemKey !== "") _active_label.id += "_" + _chanElemKey ;
      _chanbkg.addEventListener("mouseover", label_listener);
      _chanbkg.addEventListener("mouseleave", outside_label_listener);

      _channel.info = Disp.htmlSpaces(0) + "<br>" + (_channel.label).toString() ; //+ "<br>" + "Measurement channel " + _chan_index_string ;
      _channel.padding = Disp.htmlSpaces(5) ; //+ "<br>" + Disp.htmlSpaces(10);
    }

    let _no_of_img_channels = (_screen.img_channels).length;

    A.img_chan_index_string = "";
    for (let _i = 0; _i < _no_of_img_channels; _i++)
    {
      let _img_channel = _screen.img_channels[_i];
      let _img_chan_index_string = (_img_channel.index).toString();
      A.img_chan_index_string += _img_chan_index_string + ";";
      if (_img_channel.disp.pos !== "center")
      {
        A.canvas_shift_x = _img_channel.disp.pos.x;
        A.canvas_shift_y = _img_channel.disp.pos.y;
      }
      if (_img_channel.dim !== "source")
      {
        let _width = _img_channel.dim.w ;
        let _height = _img_channel.dim.h ;
        if (A.display_kiosk_height > 0) _img_channel.disp.h = A.display_kiosk_height ;
        let _img_disp_scale = _height / _img_channel.disp.h ;
        A.display_img_scale = _img_channel.disp.h / A.STD_SCALE_HEIGHT ;
        //if (A.display_kiosk_height > 0) _img_disp_scale = _height / A.display_kiosk_height ;
        A.img_height = _height / _img_disp_scale;
        A.img_width = _width / _img_disp_scale;
      }
    }

    let _no_of_ctrl_channels = (_screen.ctrl_channels).length;
    A.ctrl_chan_index_string = "";
    for (let _i = 0; _i < _no_of_ctrl_channels; _i++)
    {
      let _ctrl_channel = _screen.ctrl_channels[_i];

      let _ctrl_chan_index_string = (_ctrl_channel.index).toString();
      A.ctrl_chan_index_string += _ctrl_chan_index_string + ";";


      let _ctrlbkg = document.createElement("DIV");

      A.CONTAINER.appendChild(_ctrlbkg);

      let _slider = document.createElement("INPUT");
      let _setval = document.createElement("BUTTON");
      let _send = document.createElement("BUTTON");

      _ctrlbkg.appendChild(_slider);
      _ctrlbkg.appendChild(_setval);
      _ctrlbkg.appendChild(_send);

      let _textForButton = document.createTextNode("");
      _setval.appendChild(_textForButton);

      _ctrlbkg.id = "ctrlbkg_" + _ctrl_chan_index_string;
      _slider.id = "slider_" + _ctrl_chan_index_string;
      _setval.id = "setval_" + _ctrl_chan_index_string;
      _send.id = "send_" + _ctrl_chan_index_string;

      _ctrlbkg.addEventListener("mouseover", label_listener);
      _ctrlbkg.addEventListener("mouseleave", outside_label_listener);


      let _ctrl_disp = _ctrl_channel.disp;
      let _ctrl_color = _ctrl_disp.col;
      let _ctrl_bgcol = _ctrl_disp.bgcol;

      _ctrlbkg.title = "";
      Disp.setProperties( _ctrlbkg.style,
      {
        width: (_ctrl_disp.size * 10.8).toString() + "px",
        height: (_ctrl_disp.size * 8.2).toString() + "px",
        position: "absolute",
        left: (_ctrl_disp.pos.x * A.display_img_scale + A.CANVAS_POS_X + A.canvas_shift_x - _ctrl_disp.size/2 + 7).toString() + "px",
        top: (_ctrl_disp.pos.y * A.display_img_scale + A.CANVAS_POS_Y + A.canvas_shift_y - _ctrl_disp.size + 14).toString() + "px",
        visibility: ( (_ctrl_channel.show == true && _ctrl_channel.lock == true) ? "visible" : "hidden" ),
        fontSize: (parseInt(_ctrl_disp.size * A.display_img_scale/A.display_img_scale)).toString() + "px",
        fontFamily: A.all_font_families,
        color: Disp.rGBALiteralFromArray([_ctrl_color.r,_ctrl_color.g,_ctrl_color.b,_ctrl_color.a]) ,
        backgroundColor: Disp.rGBALiteralFromArray([_ctrl_bgcol.r,_ctrl_bgcol.g,_ctrl_bgcol.b,_ctrl_bgcol.a])
      } ) ;

      _slider.title = "";
      Disp.setProperties( _slider.style,
      {
        width: (_ctrl_disp.size * 9.0).toString() + "px",
        height: (_ctrl_disp.size * 1.8).toString() + "px",
        position: "absolute",
        left: (_ctrl_disp.size * 0.7).toString() + "px",
        top: (_ctrl_disp.size * 0.6).toString() + "px",
        visibility: ( (_ctrl_channel.show == true && _ctrl_channel.lock == true) ? "visible" : "hidden" ),
        fontSize: (parseInt(_ctrl_disp.size * A.display_img_scale/A.display_img_scale)).toString() + "px",
        fontFamily: A.all_font_families
      } ) ;

      _setval.title = "";
      Disp.setProperties( _setval.style,
      {
        position: "absolute",
        left: (_ctrl_disp.size * 0.38).toString() + "px",
        top: (_ctrl_disp.size * 3.0).toString() + "px",
        visibility: "visible",
        fontSize: (parseInt(_ctrl_disp.size * A.display_img_scale/A.display_img_scale)).toString() + "px",
        fontFamily: A.all_font_families,
        color: Disp.rGBALiteralFromArray([_ctrl_color.r,_ctrl_color.g,_ctrl_color.b,_ctrl_color.a]) ,
        backgroundColor: "transparent",
        border: "transparent",
        outline: "none",
        textAlign: "left"
      } ) ;

      _send.title = "";
      _send.disabled = true;
      Disp.setProperties( _send.style,
      {
        width: (_ctrl_disp.size * 2.7).toString() + "px",
        height: (_ctrl_disp.size * 1.6).toString() + "px",
        position: "absolute",
        left: (_ctrl_disp.size * 7.3).toString() + "px",
        top: (_ctrl_disp.size * 3.1).toString() + "px",
        visibility: ( (_ctrl_channel.show == true && _ctrl_channel.lock == true) ? "visible" : "hidden" ),
        fontSize: (parseInt(_ctrl_disp.size * A.display_img_scale/A.display_img_scale)).toString() + "px",
        fontFamily: A.all_font_families,
        borderRadius: "10%",
        opacity: "0.5",
        textAlign: "center"
      } ) ;

      //_label.style.visibility = "visible";
      //let _value_unit_string = "";
      //_value_unit_string = (_ctrl_channel.val).toString().substring(0, A.MAX_DISPLAY_DIGITS) + " " + _ctrl_channel.unit;  // .substring(0,12)
      //let _str_val = _value_unit_string + _ctrl_channel.info;
      //_label.innerHTML = _str_val;

      if (_ctrl_channel.type === "datetime")
      {
        let _date = new Date();
        let _value = _date.getFullYear().toString() + '-' + (_date.getMonth() + 1).toString().padStart(2, 0) + '-' + _date.getDate().toString().padStart(2, 0);

        Disp.setProperties( _slider,
        {
          type: "datetime-local",
        } ) ;
      }
      else
      {
        Disp.setProperties( _slider,
        {
          type: "range",
          min: _ctrl_channel.min_val,
          max: _ctrl_channel.max_val,
          step: _ctrl_channel.val_step,
          value: _ctrl_channel.val
        } ) ;
      }
      _slider.addEventListener("input", slider_listener);

      let _value_unit_string = "";
      if ( _ctrl_channel.min_str_val !== "" && _ctrl_channel.max_str_val !== "" && _ctrl_channel.str_val !== "" )
      {
        Disp.setProperties( _slider,
        {
          min: 0,
          max: 1,
          step: 1,
          value: 0
        } ) ;
        _value_unit_string = _ctrl_channel.min_str_val;
      }
      else _value_unit_string = Help.rounded_string(_ctrl_channel.val * _ctrl_channel.scale, _ctrl_channel.disp.len) + " " + _ctrl_channel.unit;
      // (_ctrl_channel.val * _ctrl_channel.scale).toString().substring(0,_ctrl_channel.disp.len)
      Disp.setProperties( _ctrl_channel,
      {
        str_val: _value_unit_string,
        info: Disp.htmlSpaces(0) + "<br>" + Disp.htmlSpaces(10) + "<br>" + (_ctrl_channel.label).toString() + "<br>" + "Control channel " + _ctrl_chan_index_string,
        padding: Disp.htmlSpaces(0) + "<br>" + Disp.htmlSpaces(10) + "<br>" + Disp.htmlSpaces(10)
      } ) ;

      _setval.innerHTML = _value_unit_string + _ctrl_channel.padding; //+ "<br>" + Disp.htmlSpaces(10);
      _send.addEventListener("click", send_listener);
      _send.innerHTML = "Go"; //"<div style="text-align:center;">Go</div>";

      if (_ctrl_channel.show == true && _ctrl_channel.lock == true) display_label(_ctrlbkg);

    }

    //if (A.display_index === 20)
    //{
    //  let vid = createVideo( ['http://labremote.net/client/images/labremote_mockup.mp4'] );
    //  vid.loop();
    //}

    reset_display_variables();

  }
}
