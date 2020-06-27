"use strict";


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
