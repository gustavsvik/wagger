"use strict";


let App = new AppData();

let Display = new DisplayData();



function setup() 
{
  frameRate(App.FRAME_RATE);

  App.ntp.t1 = parseInt((new Date().valueOf()) * 1000) ;
  httpGet(App.CLIENT_URL + "server_time.php", "json", {}, handle_server_time); 
    
  let _screen_layout_file = document.getElementById("screenLayoutFile").value;
  let _screen_layout_params = {"screen_layout_file": _screen_layout_file};
  httpGet(App.CLIENT_URL + "get_screen_data.php", "json", _screen_layout_params, handle_display_data);
  App.img_url = App.FILES_URL + "0.png";
  App.img = loadImage(App.img_url, handle_image_loaded);
  //App.test_img = loadImage("http://labremote.net/client/images/test.jpg", handle_image_loaded);
  App.img_width = 1280/(720/App.STD_SCALE_HEIGHT);
  App.img_height = 720/(720/App.STD_SCALE_HEIGHT);

  App.CANVAS = createCanvas(1500, 800);
  App.CANVAS.parent("myContainer");
  App.CANVAS.position(App.CANVAS_POS_X, App.CANVAS_POS_Y);
    
  App.all_font_families = addFonts(['carlito.woff'], "/fonts/") + ", " + App.STANDARD_FONT_FAMILIES ;
}


function draw() 
{
  	
  App.frames_active++;

  if (App.frames_active < App.display_timeout * App.FRAME_RATE && typeof App.DISPLAY_SELECT.style !== 'undefined')
  {
    App.DISPLAY_SELECT.style.visibility = "visible"; 

    if (App.display_kiosk_interval > 0)
    {
      if (App.frames_active % (App.display_kiosk_interval * App.FRAME_RATE) === 0)
      {
        App.display_index++ ;
        if (App.display_index >= (Display.data).length) App.display_index = 0 ;
        App.DISPLAY_SELECT.value = (App.display_index).toString() ;
        let _event = new Event('change') ;
        App.DISPLAY_SELECT.dispatchEvent(_event) ;
      }
    }

    //App.img = loadImage(App.img_url, handle_image_loaded);
    //App.test_img = loadImage("http://labremote.net/client/images/test.jpg", handle_image_loaded);

    let _screen = null;
    if (typeof Display.data[App.display_index] !== 'undefined') _screen = Display.data[App.display_index].screens[0];
    
    if (_screen !== null)
    {
      let _hovered_tag = "";
      let _hovered_index = "";
      if ( App.hovered_clicked_label !== null ) [_hovered_tag, _hovered_index] = getTagChannelIndex(App.hovered_clicked_label);

      let _time = _screen.time;
      if (_time !== null) // All displays except the title page
      {
        let _time_label = getChannelElement( [ "timelabel", null ] );
        _time_label.innerHTML = _time.str_val + _time.padding;
        if ( _hovered_tag === "timebkg" ) _time_label.innerHTML = _time.str_val + _time.info + ( - App.ntp.adjustment / 1000000 ).toString().substring(0,7) + " s";
      }      
      for (let _i = 0; _i < _screen.channels.length; _i++)
      {
        let _channel = _screen.channels[_i];
        let _index_str = (_channel.index).toString();
        let _label = getChannelElement( [ "label", _index_str ] );
        _label.innerHTML = _channel.str_val + _channel.padding;
        if ( _hovered_index === _index_str ) _label.innerHTML = (_channel.val).toString().substring(0, App.MAX_DISPLAY_DIGITS) + " " + _channel.unit + _channel.info; // _channel.str_val + _channel.info; .substring(0,12)
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

  if ( (frameCount - App.last_time_sync >= App.NTP_SYNC_INTERVAL * App.FRAME_RATE) && App.frames_active < App.display_timeout * App.FRAME_RATE && App.display_is_static === false )
  {
    App.ntp.t1 = parseInt((new Date().valueOf()) * 1000) ;
    httpGet(App.CLIENT_URL + "server_time.php", "json", {}, handle_server_time); 
    App.last_time_sync = frameCount;
  }
      
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


  App.ntp.timestamp = parseInt((new Date().valueOf()) / 1000) + App.ntp.adjustment / 1000000;


  if (typeof App.DISPLAY_SELECT.style !== 'undefined' && !App.display_timed_out)
  {
    if (App.frames_active >= App.display_timeout * App.FRAME_RATE)
    {
      App.display_timed_out = true;
      background(255);
      removeAllElements(App.CONTAINER);
      App.img = loadImage(App.FILES_URL + "000.jpg", handle_image_loaded);
      //App.test_img = loadImage("http://labremote.net/client/images/test.jpg", handle_image_loaded);
      App.img_width = 1280/(720/App.STD_SCALE_HEIGHT);
      App.img_height = 720/(720/App.STD_SCALE_HEIGHT);
      App.DISPLAY_INFO_TEXT = document.createElement("DIV");
      App.CONTAINER.appendChild(App.DISPLAY_INFO_TEXT);
      App.DISPLAY_INFO_TEXT.innerHTML = "Timeout due to inactivity - please reload page to continue data transfer!";
      setAttributes( App.DISPLAY_INFO_TEXT.style, 
      { 
        width: (parseInt(App.img_width)).toString() + "px", 
        height: (parseInt(App.WARNING_FONTSIZE)).toString() + "px", 
        position: "absolute", 
        left: (parseInt(App.CANVAS_POS_X + App.canvas_shift_x + Math.max(App.img_width/2 - App.WARNING_FONTSIZE*7.0, 0))).toString() + "px", 
        top: (parseInt(App.CANVAS_POS_Y + App.canvas_shift_y + App.img_height/2 - App.WARNING_FONTSIZE/2)).toString() + "px", 
        fontSize: (parseInt((16) * App.display_img_scale)).toString() + "px", 
        fontFamily: App.all_font_families, 
        color: getRGBALiteral(App.STANDARD_FOREGROUND_COLOR),
        textAlign: "left", 
        visibility: "visible" 
      } ) ;

      reset_display_variables();
    }
    else if (App.display_is_static === false) // display is not static
    {
      App.DISPLAY_INFO_TEXT.innerHTML = "";
      App.DISPLAY_INFO_TEXT.style.visibility = "hidden"; 

      let _view_lag = App.ntp.timestamp - App.data_timestamp;
      if ( _view_lag > App.time_bins * App.time_bin_size || !navigator.onLine)
      {
        if (App.frames_active % 2 === 0) App.DISPLAY_INFO_TEXT.style.color = getRGBALiteral([255,0,0,127]); else App.DISPLAY_INFO_TEXT.style.color = getRGBALiteral([255,255,255,127]) ;

        if (!isValidNumber(_view_lag) || _view_lag > 10*365*24*60*60) 
        {
        }
        else
        {
          let _lag_text = getTimeLagText(_view_lag);
          let _status_text = "requesting new...";
          if (!navigator.onLine) _status_text = "no internet connection!";
          App.DISPLAY_INFO_TEXT.innerHTML = "Out of date (" + _lag_text + ")" + ", " + _status_text;
          App.DISPLAY_INFO_TEXT.style.visibility = "visible"; 
        }
      }
    }
  }

}


function handle_image_loaded()
{ 
  let _current_img = {};
  _current_img[0] = App.img;
  //_current_img[1] = App.test_img;

  let _display = Display.data[App.display_index];
  if (typeof _display !== 'undefined') 
  {
    let _screen = _display.screens[0];
    let _no_of_imgs = (_screen.imgs).length;
    if (_no_of_imgs > 0)
    {
      for (let _i = 0; _i < _no_of_imgs; _i++)
      {
        let _width = _current_img[_i].width ; 
        let _height =  _current_img[_i].height ; 
        let _img = _screen.imgs[_i];
        if (_img.dim === "source")
        {
          if (App.display_kiosk_height > 0) _img.disp.h = App.display_kiosk_height ;
          let _img_disp_scale = _height / _img.disp.h ;
          App.display_img_scale = _img.disp.h / App.STD_SCALE_HEIGHT ;
          //if (App.display_kiosk_height > 0) _img_disp_scale = _height / App.display_kiosk_height ;
          App.img_height = _height / _img_disp_scale; 
          App.img_width = _width / _img_disp_scale;
        }
        if (_img.disp.pos === "center")
        {
          App.canvas_shift_x = Math.max( parseInt( ( App.display_viewport.w - App.img_width ) / 2 ), 0 ) ;
          App.canvas_shift_y = Math.max( parseInt( ( App.display_viewport.h - App.img_height ) / 2 ), 0 ) ;
        }
      }
    }
    let _no_of_img_channels = (_screen.img_channels).length;
    if (_no_of_img_channels > 0)
    {
      for (let _i = 0; _i < _no_of_img_channels; _i++)
      {
        let _width = _current_img[_i].width ; 
        let _height =  _current_img[_i].height ; 
        let _img_channel = _screen.img_channels[_i];
        if (_img_channel.dim === "source")
        {
          if (App.display_kiosk_height > 0) _img_channel.disp.h = App.display_kiosk_height ;
          let _img_disp_scale = _height / _img_channel.disp.h ;
          App.display_img_scale = _img_channel.disp.h / App.STD_SCALE_HEIGHT ;
          //if (App.display_kiosk_height > 0) _img_disp_scale = _height / App.display_kiosk_height ;
          App.img_height = _height / _img_disp_scale; 
          App.img_width = _width / _img_disp_scale;
        }
        if (_img_channel.disp.pos === "center")
        {
          App.canvas_shift_x = Math.max( parseInt( ( App.display_viewport.w - App.img_width ) / 2 ), 0 ) ;
          App.canvas_shift_y = Math.max( parseInt( ( App.display_viewport.h - App.img_height ) / 2 ), 0 ) ;
        }
      }
    }

    setAttributes( App.DISPLAY_INFO_TEXT.style, 
    { 
      fontSize: (parseInt(App.WARNING_FONTSIZE * App.display_img_scale)).toString() + "px",
      left: (parseInt(App.CANVAS_POS_X + App.canvas_shift_x + Math.max(App.img_width/2 - App.WARNING_FONTSIZE*7.0, 0))).toString() + "px", 
      top: (parseInt(App.CANVAS_POS_Y + App.canvas_shift_y + App.img_height/2 - App.WARNING_FONTSIZE/2)).toString() + "px", 
    } ) ;

    let _time = _screen.time;
    if (_time !== null) // Any display but the title page
    {
      let _time_disp = _time.disp;
      let _timebkg = getChannelElement(["timebkg", null]);
      if (_timebkg !== null)
      { 
        setAttributes( _timebkg.style, 
        { 
          fontSize: (parseInt(_time_disp.size * App.display_img_scale)).toString() + "px",
          left: (_time_disp.pos.x * App.display_img_scale + App.CANVAS_POS_X + App.canvas_shift_x - _time_disp.size/2 + 1).toString() + "px",
          top: (_time_disp.pos.y * App.display_img_scale + App.CANVAS_POS_Y + App.canvas_shift_y - _time_disp.size + 1).toString() + "px"
        } ) ;
      }
    }

    let _no_of_channels = (_screen.channels).length;
    if (_no_of_channels > 0)
    {
      for (let _i = 0; _i < _no_of_channels; _i++)
      {
        let _channel = _screen.channels[_i];
        let _disp = _channel.disp;
        let _chanbkg = getChannelElement(["chanbkg", _channel.index]);
        if (_chanbkg !== null)
        { 
          setAttributes( _chanbkg.style, 
          { 
            fontSize: (parseInt(_disp.size * App.display_img_scale)).toString() + "px",
            left: (parseInt(_disp.pos.x * App.display_img_scale + App.CANVAS_POS_X + App.canvas_shift_x - _disp.size/2 + 1)).toString() + "px",
            top: (parseInt(_disp.pos.y * App.display_img_scale + App.CANVAS_POS_Y + App.canvas_shift_y - _disp.size + 1)).toString() + "px"
          } ) ;
        }
      }
    }

    let _no_of_ctrl_channels = (_screen.ctrl_channels).length;
    if (_no_of_ctrl_channels > 0)
    {
      for (let _i = 0; _i < _no_of_ctrl_channels; _i++)
      {
        let _ctrl_channel = _screen.ctrl_channels[_i];
        let _ctrl_disp = _ctrl_channel.disp;
        let _ctrlbkg = getChannelElement(["ctrlbkg", _ctrl_channel.index]);
        if (_ctrlbkg !== null)
        { 
          setAttributes( _ctrlbkg.style, 
          { 
            fontSize: (parseInt(_ctrl_disp.size * App.display_img_scale)).toString() + "px",
            left: (parseInt(_ctrl_disp.pos.x * App.display_img_scale + App.CANVAS_POS_X + App.canvas_shift_x - _ctrl_disp.size/2 + 7)).toString() + "px",
            top: (parseInt(_ctrl_disp.pos.y * App.display_img_scale + App.CANVAS_POS_Y + App.canvas_shift_y - _ctrl_disp.size + 14)).toString() + "px"
          } ) ;
        }
      }
    }
    
  }
  for (let _i = 0; _i <= 0; _i++)
  {
    image(_current_img[_i], App.canvas_shift_x, App.canvas_shift_y, App.img_width*(1-0.5*_i), App.img_height*(1-0.5*_i) );
  }
}


function handle_server_time(data)
{
  App.ntp.t2 = parseInt( data.receivetime / 1 );
  App.ntp.t3 = parseInt( data.transmittime / 1 );
  App.ntp.t4 = parseInt( (new Date().valueOf()) * 1000 ) ;
  App.ntp.adjustment = parseInt( ( ( App.ntp.t2 - App.ntp.t1 ) + ( App.ntp.t3 - App.ntp.t4 ) ) / 2 ) ; //- App.view_timestamp ;
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
  let _server_timestamp = App.ntp.timestamp ; 
  if ( isValidGT(_server_timestamp, 0) )
  {
    App.server_timestamp = _server_timestamp;
    let _latest_time = new Date( _server_timestamp * 1000 );
    let _latest_time_string = "";
    if ( isValidDate(_latest_time) )
    {
      _latest_time_string = _latest_time.toISOString();
      App.ntp.time_string = (_latest_time_string.substring(0,10)).concat( " ", _latest_time_string.substring(11,19), " ", App.TIME_ZONE );
      App.server_time_string = App.ntp.time_string ;
    }
    else App.server_time_string = App.WAIT_MESSAGE;

    let _screen = Display.data[App.display_index].screens[0];
    let _time = _screen.time;
    if (_time !== null)
    {
      _time.str_val = App.server_time_string;
      _time.val = App.server_timestamp;
    }
    
    let _latest_data_timestamp = nthMaxOfArray(timestamp_matrix[0], 0);
    if ( isValidGT(_latest_data_timestamp, 0) )
    {
      App.data_timestamp = _latest_data_timestamp;
      let _latest_time = new Date( _latest_data_timestamp * 1000 );
      let _latest_time_string = "";
      if ( isValidDate(_latest_time) )
      {
        _latest_time_string = _latest_time.toISOString();
        App.data_time_string = (_latest_time_string.substring(0,10)).concat( " ", _latest_time_string.substring(11,19), " ", App.TIME_ZONE );
      }
      else App.data_time_string = App.WAIT_MESSAGE;
    
      for (let _img_channel_index = 0; _img_channel_index < _screen.img_channels.length; _img_channel_index++)
      {
        let _img_channel = _screen.img_channels[_img_channel_index];
        let _img_url = App.FILES_URL + _img_channel.index.toString() + "_" + _latest_data_timestamp.toString() + "." + _img_channel.ext;
        App.img_url = _img_url;
        App.img = loadImage(_img_url, handle_image_loaded);
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
}


function reset_display_variables()
{
  App.server_time_string = App.WAIT_MESSAGE;
  App.data_timestamp = App.ntp.timestamp; // Prevent false lag indication prior to data acquisition from channels on newly selected display

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
  
  if (typeof data.disp_timeout !== 'undefined') App.display_timeout = data.disp_timeout; 

  if (typeof data.disp_viewport_size !== 'undefined') App.display_viewport = data.disp_viewport_size; 
  if (typeof data.disp_kiosk_interval !== 'undefined') App.display_kiosk_interval = data.disp_kiosk_interval; 
  if (typeof data.disp_kiosk_adjust !== 'undefined') App.display_kiosk_adjust = data.disp_kiosk_adjust; 
  if (typeof data.disp_kiosk_override_height !== 'undefined') App.display_kiosk_height = data.disp_kiosk_override_height; 

  document.title = "LabRemote"; // New title :)
  App.CONTAINER = document.getElementById("myContainer");

  App.DISPLAY_SELECT = document.createElement("SELECT");
  App.DISPLAY_SELECT.id = "screen_select";
  App.CONTAINER.appendChild(App.DISPLAY_SELECT);
  for (let _current_display = 0; _current_display < (Display.data).length; _current_display++) 
  {
    App.DISPLAY_SELECT.options[App.DISPLAY_SELECT.options.length] = new Option(Display.data[_current_display].title, _current_display);
  }
  App.DISPLAY_SELECT.addEventListener("change", display_select_listener);
  setAttributes( App.DISPLAY_SELECT.style, 
  {
    position: "absolute",
    left: "10px",
    top: "10px",
    visibility: "hidden"
  } ) ;

  display_select_listener();
}


function label_listener()
{
  let _element = this;
  if (typeof _element !== 'undefined')
  {
    App.hovered_clicked_label = _element ;
    _element.style.visibility = "visible";
    let [_tag, _index] = getTagChannelIndex(_element);

    if (_tag === "timebkg")
    {
      let _time_label = getChannelElement (["timelabel", null]);
      if (_time_label !== null)
      {
        _time_label.style.visibility = "visible";
        let _time = (Display.data[App.display_index]).screens[0].time;
        let _str_val = _time.str_val + _time.info;
        _time_label.innerHTML = _str_val + ( - App.ntp.adjustment / 1000000 ).toString().substring(0,7) + " s";
      }
    }
  
    let _setval = getChannelElement (["setval", _index]);
    if (_setval !== null)
    {
      _setval.style.visibility = "visible";
      let _ctrl_channels = (Display.data[App.display_index]).screens[0].ctrl_channels;
      let _ctrl_index = findWithAttr(_ctrl_channels, "index", parseInt(_index) );
      let _ctrl_channel = _ctrl_channels[_ctrl_index];
      let _value_unit_string = "";
      if ( _ctrl_channel.str_val !== "" ) _value_unit_string = _ctrl_channel.str_val;
      else _value_unit_string = (_ctrl_channel.val * _ctrl_channel.scale).toString().substring(0,_ctrl_channel.disp.len) + " " + _ctrl_channel.unit;
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
      //if ( _channel.str_val !== "" ) _value_unit_string = _channel.str_val;
      //else 
      _value_unit_string = (_channel.val).toString().substring(0, App.MAX_DISPLAY_DIGITS) + " " + _channel.unit;  // .substring(0,12)
      let _str_val = _value_unit_string + _channel.info;
      _label.innerHTML = _str_val;
    }
  }
}


function outside_label_listener()
{
  let _element = this;
  if (typeof _element !== 'undefined')
  {
    App.hovered_clicked_label = null ;
    _element.style.visibility = "hidden";
    let [_tag, _index] = getTagChannelIndex(_element);
  
    if (_tag === "timebkg")
    {
      let _time_label = getChannelElement (["timelabel", null]);
      if (_time_label !== null)
      {
        let _time = (Display.data[App.display_index]).screens[0].time;
        let _str_val = _time.str_val ;
        _time_label.innerHTML = _str_val + htmlSpaces(0) + "<br>" + htmlSpaces(10) ; 
      }
    }

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
      _setval.innerHTML = _value_unit_string + htmlSpaces(0) + "<br>" + htmlSpaces(10) ; 
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
      _label.innerHTML = _value_unit_string + htmlSpaces(0) + "<br>" + htmlSpaces(10) ; 
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
    App.pressed_send = _send;
  }
}


function slider_listener()
{
  let _slider = this;
  if (typeof _slider !== 'undefined')
  {
    let [_tag, _index_string] = getTagChannelIndex(_slider);
    let _setval = getChannelElement (["setval", _index_string]);
    let _send = getChannelElement (["send", _index_string]);
    let _slider_index = parseInt(_index_string);
    let _slider_value = parseFloat(_slider.value);
    _send.disabled = false;
    _send.style.opacity = "1.0"  ;

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
}


function display_select_listener()
{
  background(255);
  if (App.display_kiosk_interval === 0) 
  {
    App.frames_active = 0;
  }
  else
  {
    //outside_label_listener();
    let _adjust = App.display_kiosk_adjust ;
    window.scrollTo(App.CANVAS_POS_X + _adjust.x, App.CANVAS_POS_Y + _adjust.y);
  }
  
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
      App.img = loadImage(App.img_url, handle_image_loaded);
      if (_img.disp.pos !== "center")
      {
        App.canvas_shift_x = _img.disp.pos.x;
        App.canvas_shift_y = _img.disp.pos.y;
      }
      if (_img.dim !== "source")
      {  
        let _width = _img.dim.w ; 
        let _height = _img.dim.h ;
        if (App.display_kiosk_height > 0) _img.disp.h = App.display_kiosk_height ;
        let _img_disp_scale = _height / _img.disp.h ;
        App.display_img_scale = _img.disp.h / App.STD_SCALE_HEIGHT ;
        //if (App.display_kiosk_height > 0) _img_disp_scale = _height / App.display_kiosk_height ;
        App.img_height = _height / _img_disp_scale; 
        App.img_width = _width / _img_disp_scale;
      }
    }
  }
  else
  {
    App.img_url = App.FILES_URL + "00.jpg";
    App.img = loadImage(App.img_url, handle_image_loaded);
    //App.test_img = loadImage("http://labremote.net/client/images/test.jpg", handle_image_loaded);
  }

  App.DISPLAY_INFO_TEXT = document.createElement("DIV");
  App.CONTAINER.appendChild(App.DISPLAY_INFO_TEXT);
  setAttributes( App.DISPLAY_INFO_TEXT.style, 
  {
    width: (parseInt(App.img_width)).toString() + "px",
    height: (parseInt(App.WARNING_FONTSIZE)).toString() + "px",
    position: "absolute",
    left: (parseInt(App.CANVAS_POS_X + App.canvas_shift_x + Math.max(App.img_width/2 - App.WARNING_FONTSIZE*7.0, 0))).toString() + "px",
    top: (parseInt(App.CANVAS_POS_Y + App.canvas_shift_y + App.img_height/2 - App.WARNING_FONTSIZE/2)).toString() + "px",
    fontSize: (parseInt(App.WARNING_FONTSIZE * App.display_img_scale)).toString() + "px",
    fontFamily: App.all_font_families,
    textAlign: "left",
    visibility: "hidden"
  } ) ;
  App.DISPLAY_INFO_TEXT.id = "infotext";


  let _time = _screen.time;
  if (_time !== null) // Any display but the title page
  {
    App.time_bins = _time.bins;
    App.time_bin_size = _time.bin_size;

    let _time_disp = _time.disp;
    let _time_color = _time_disp.col;
    let _time_bgcol = _time_disp.bgcol;

    let _timebkg = document.createElement("DIV");
    App.CONTAINER.appendChild(_timebkg);
    let _time_active_label = document.createElement("BUTTON");
    _timebkg.appendChild(_time_active_label);
    
    _time_active_label.innerHTML = "";
    let _time_active_label_text = document.createTextNode("");
    _time_active_label.appendChild(_time_active_label_text);
    
    _timebkg.title = ""; 
    setAttributes( _timebkg.style, 
    {
      width: (_time_disp.size * 14.1).toString() + "px",
      height: (_time_disp.size * 4.1 + 4).toString() + "px",
      position: "absolute",
      left: (_time_disp.pos.x * App.display_img_scale + App.CANVAS_POS_X + App.canvas_shift_x - _time_disp.size/2 + 1).toString() + "px",
      top: (_time_disp.pos.y * App.display_img_scale + App.CANVAS_POS_Y + App.canvas_shift_y - _time_disp.size + 1).toString() + "px",
      visibility: "hidden",
      fontSize: (parseInt(_time_disp.size * App.display_img_scale)).toString() + "px",
      fontFamily: App.all_font_families,
      color: getRGBALiteral([_time_color.r,_time_color.g,_time_color.b,_time_color.a]),
      backgroundColor: getRGBALiteral([_time_bgcol.r,_time_bgcol.g,_time_bgcol.b,_time_bgcol.a])
    } ) ;

    _time_active_label.title = ""; 
    setAttributes( _time_active_label.style, 
    {
      position: "absolute",
      left: (_time_disp.size * 0.33).toString() + "px",
      top: (_time_disp.size * 0.34).toString() + "px",
      visibility: "visible",
      fontSize: (parseInt(_time_disp.size * App.display_img_scale)).toString() + "px",
      fontFamily: App.all_font_families,
      color: getRGBALiteral([_time_color.r,_time_color.g,_time_color.b,_time_color.a]),
      backgroundColor: "transparent",
      border: "transparent",
      outline: "none",
      textAlign: "left"
    } ) ;

    _timebkg.id = "timebkg" ;
    _time_active_label.id = "timelabel" ;
    _timebkg.addEventListener("mouseover", label_listener);
    _timebkg.addEventListener("mouseleave", outside_label_listener);

    _time.info = htmlSpaces(0) + "<br>" + "Last server response (NTP)" + "<br>" + "Client time offset: " ;    
    _time.padding = htmlSpaces(5) + "<br>" + htmlSpaces(10);    
  }

  let _no_of_channels = (_screen.channels).length;
  App.chan_index_string = "";

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
    let _active_label_text = document.createTextNode("");
    _active_label.appendChild(_active_label_text);

    _chanbkg.title = ""; 
    setAttributes( _chanbkg.style, 
    {
      width: (_disp.size * 13.9).toString() + "px",
      height: (_disp.size * 4.1 + 4).toString() + "px",
      position: "absolute",
      left: (_disp.pos.x * App.display_img_scale + App.CANVAS_POS_X + App.canvas_shift_x - _disp.size/2 + 1).toString() + "px",
      top: (_disp.pos.y * App.display_img_scale + App.CANVAS_POS_Y + App.canvas_shift_y - _disp.size + 1).toString() + "px",
      visibility: "hidden",
      fontSize: (parseInt(_disp.size * App.display_img_scale)).toString() + "px",
      fontFamily: App.all_font_families,
      color: getRGBALiteral([_color.r,_color.g,_color.b,_color.a]),
      backgroundColor: getRGBALiteral([_bgcol.r,_bgcol.g,_bgcol.b,_bgcol.a])
    } ) ;

    _active_label.title = ""; 
    setAttributes( _active_label.style, 
    {
      position: "absolute",
      left: (_disp.size * 0.33).toString() + "px",
      top: (_disp.size * 0.34).toString() + "px",
      visibility: "visible",
      fontSize: (parseInt(_disp.size * App.display_img_scale)).toString() + "px",
      fontFamily: App.all_font_families,
      color: getRGBALiteral([_color.r,_color.g,_color.b,_color.a]),
      backgroundColor: "transparent",
      border: "transparent",
      outline: "none",
      textAlign: "left"
    } ) ;

    _chanbkg.id = "chanbkg_" + _chan_index_string;
    _active_label.id = "label_" + _chan_index_string;
    _chanbkg.addEventListener("mouseover", label_listener);
    _chanbkg.addEventListener("mouseleave", outside_label_listener);
    
    _channel.info = htmlSpaces(0) + "<br>" + (_channel.label).toString() + "<br>" + "Measurement channel " + _chan_index_string ;    
    _channel.padding = htmlSpaces(5) + "<br>" + htmlSpaces(10);
  }
  
  let _no_of_img_channels = (_screen.img_channels).length;

  App.img_chan_index_string = "";
  for (let _i = 0; _i < _no_of_img_channels; _i++)
  {
    let _img_channel = _screen.img_channels[_i];
    let _img_chan_index_string = (_img_channel.index).toString();
    App.img_chan_index_string += _img_chan_index_string + ";";
    if (_img_channel.disp.pos !== "center")
    {
      App.canvas_shift_x = _img_channel.disp.pos.x;
      App.canvas_shift_y = _img_channel.disp.pos.y;
    }
    if (_img_channel.dim !== "source")
    {  
      let _width = _img_channel.dim.w ; 
      let _height = _img_channel.dim.h ;
      if (App.display_kiosk_height > 0) _img_channel.disp.h = App.display_kiosk_height ;
      let _img_disp_scale = _height / _img_channel.disp.h ;
      App.display_img_scale = _img_channel.disp.h / App.STD_SCALE_HEIGHT ;
      //if (App.display_kiosk_height > 0) _img_disp_scale = _height / App.display_kiosk_height ;
      App.img_height = _height / _img_disp_scale; 
      App.img_width = _width / _img_disp_scale;
    }
  }
    
  let _no_of_ctrl_channels = (_screen.ctrl_channels).length;
  App.ctrl_chan_index_string = "";
  for (let _i = 0; _i < _no_of_ctrl_channels; _i++)
  {
    let _ctrl_channel = _screen.ctrl_channels[_i];
        
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
    setAttributes( _ctrlbkg.style, 
    {
      width: (_ctrl_disp.size * 10.8).toString() + "px",
      height: (_ctrl_disp.size * 8.2).toString() + "px",
      position: "absolute",
      left: (_ctrl_disp.pos.x * App.display_img_scale + App.CANVAS_POS_X + App.canvas_shift_x - _ctrl_disp.size/2 + 7).toString() + "px",
      top: (_ctrl_disp.pos.y * App.display_img_scale + App.CANVAS_POS_Y + App.canvas_shift_y - _ctrl_disp.size + 14).toString() + "px", 
      visibility: "hidden",
      fontSize: (parseInt(_ctrl_disp.size * App.display_img_scale)).toString() + "px",
      fontFamily: App.all_font_families,
      color: getRGBALiteral([_ctrl_color.r,_ctrl_color.g,_ctrl_color.b,_ctrl_color.a]) , 
      backgroundColor: getRGBALiteral([_ctrl_bgcol.r,_ctrl_bgcol.g,_ctrl_bgcol.b,_ctrl_bgcol.a])
    } ) ;

    _slider.title = "";
    setAttributes( _slider.style, 
    {
      width: (_ctrl_disp.size * 9.0).toString() + "px",
      height: (_ctrl_disp.size * 1.8).toString() + "px",
      position: "absolute",
      left: (_ctrl_disp.size * 0.7).toString() + "px",
      top: (_ctrl_disp.size * 0.6).toString() + "px",
      visibility: "hidden",
      fontSize: (parseInt(_ctrl_disp.size * App.display_img_scale)).toString() + "px",
      fontFamily: App.all_font_families
    } ) ;

    _setval.title = ""; 
    setAttributes( _setval.style, 
    {
      position: "absolute",
      left: (_ctrl_disp.size * 0.38).toString() + "px",
      top: (_ctrl_disp.size * 3.0).toString() + "px",
      visibility: "visible",
      fontSize: (parseInt(_ctrl_disp.size * App.display_img_scale)).toString() + "px",
      fontFamily: App.all_font_families,
      color: getRGBALiteral([_ctrl_color.r,_ctrl_color.g,_ctrl_color.b,_ctrl_color.a]) , 
      backgroundColor: "transparent",    
      border: "transparent",
      outline: "none",
      textAlign: "left"
    } ) ;

    _send.title = "";
    _send.disabled = true;
    setAttributes( _send.style, 
    {
      width: (_ctrl_disp.size * 2.7).toString() + "px",
      height: (_ctrl_disp.size * 1.6).toString() + "px",
      position: "absolute",
      left: (_ctrl_disp.size * 7.3).toString() + "px",
      top: (_ctrl_disp.size * 3.1).toString() + "px",
      visibility: "hidden",
      fontSize: (parseInt(_ctrl_disp.size * App.display_img_scale)).toString() + "px",
      fontFamily: App.all_font_families,
      borderRadius: "10%",
      opacity: "0.5",
      textAlign: "center"
    } ) ;
    
    setAttributes( _slider, 
    {
      type: "range",
      min: _ctrl_channel.min_val,
      max: _ctrl_channel.max_val,
      step: _ctrl_channel.val_step,
      value: _ctrl_channel.val
    } ) ;
    _slider.addEventListener("input", slider_listener);

    let _value_unit_string = "";
    if ( _ctrl_channel.min_str_val !== "" && _ctrl_channel.max_str_val !== "" && _ctrl_channel.str_val !== "" )
    {
      setAttributes( _slider, 
      {
        min: 0,
        max: 1,
        step: 1,
        value: 0
      } ) ;
      _value_unit_string = _ctrl_channel.min_str_val;
    }
    else _value_unit_string = (_ctrl_channel.val * _ctrl_channel.scale).toString().substring(0,_ctrl_channel.disp.len) + " " + _ctrl_channel.unit;
    
    setAttributes( _ctrl_channel, 
    {
      str_val: _value_unit_string,
      info: htmlSpaces(0) + "<br>" + htmlSpaces(10) + "<br>" + (_ctrl_channel.label).toString() + "<br>" + "Control channel " + _ctrl_chan_index_string, 
      padding: htmlSpaces(0) + "<br>" + htmlSpaces(10) + "<br>" + htmlSpaces(10)
    } ) ;      

    _setval.innerHTML = _value_unit_string + _ctrl_channel.padding; //+ "<br>" + htmlSpaces(10);
    _send.addEventListener("click", send_listener);
    _send.innerHTML = "Go"; //"<div style="text-align:center;">Go</div>";
  }

  reset_display_variables();
}
