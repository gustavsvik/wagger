"use strict";



class AppData
{
  constructor()
  {
    this.CANVAS = {};
    this.CANVAS_POS_X = 250 ;
    this.CANVAS_POS_Y = 10 ;
    this.STD_SCALE_HEIGHT = 480;
    this.WARNING_FONTSIZE = 36;
    this.STANDARD_FONTSIZE = 12;
    this.MAX_DISPLAY_DIGITS = 13;
    this.STANDARD_FOREGROUND_COLOR = [255,255,255,255];
    this.STANDARD_BACKGROUND_COLOR = [0,0,255,255];
    this.FRAME_RATE = 5 ;
    this.REQUEST_INTERVAL = 2 ;
    this.NTP_SYNC_INTERVAL = 60 ;
    this.TIME_ZONE = "UTC";
    this.BROWSER_URL = window.location.hostname;
    this.CLIENT_URL = "http://" + this.BROWSER_URL  + "/client/";
    this.FILES_DIR = "images/";
    this.FILES_URL = this.CLIENT_URL + this.FILES_DIR;
    this.WAIT_MESSAGE = "Retrieving data...";
    this.last_get = 5;
    this.last_request = 0; 
    this.last_time_sync = 0; 
    this.display_index = 0;
    this.display_timeout = 900 ;
    this.display_is_static = false;
    this.chan_index_string = "";
    this.img_chan_index_string = "";
    this.ctrl_chan_index_string = "";
    this.img_url = "";
    this.img = {};
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
}



class DisplayData
{
  constructor()
  {
    this.data = [];
  }
}



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
  let _tag_string = null ;
  let _index_string = null ;
  if (_fields.length > 0)
  {
    _tag_string = _fields[0];
    if (_fields.length > 1) _index_string = _fields[1];
  }
  return [_tag_string, _index_string];
}


function getChannelElement(element_ids)
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
