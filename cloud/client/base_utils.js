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

    function reviver( key, value )
    {
      if ( value === '***NaN***' )
      {
        return NaN;
      }
      if ( value === '***Infinity***' )
      {
        return Infinity;
      }
      if ( value === '***-Infinity***' )
      {
        return -Infinity;
      }
      return value;
    }

    const tmp_string = json_string.replace( /(NaN|-?Infinity)/g, '***$1***' );
    let json = null;
    try
    {
      json = JSON5.parse(json_string);
      //json = JSON.parse(tmp_string, reviver);
    }
    catch(e)
    {
      console.log(e);
    }
    return json;

  }


  static indexByAttrs(arr, attrs, vals)
  {
    for (let _i = 0; _i < arr.length; _i += 1)
    {
      let _all_attrs_equal = true ;
      for(let _j = 0; _j < attrs.length; _j += 1)
      {
        if (arr[_i][attrs[_j]] !== vals[_j])
        {
          _all_attrs_equal = false;
        }
      }
      if (_all_attrs_equal) return _i ;
    }
    return [-1];
  }

}



class Transform
{

  static fromUnarmoredString(stringToArmor)
  {
    const regexPipe = new RegExp(',', 'g');
    const regexTilde = new RegExp(';', 'g');
    const partArmoredString = stringToArmor.replace(regexTilde, '~');
    const armoredString = partArmoredString.replace(regexPipe, '|');
    return armoredString ;
  }


  static fromArmoredString(stringToUnarmor)
  {
    const regexComma = /\|/g;
    const regexSemicolon = /\~/g;
    const partUnarmoredString = stringToUnarmor.replace(regexSemicolon, ';');
    const unarmoredString = partUnarmoredString.replace(regexComma, ',');
    return unarmoredString ;
  }


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

  static svgToImgSrc(svg = null)
  {
    let DEFAULT_SVG = document.createElementNS("http://www.w3.org/2000/svg", "CIRCLE") ;
    DEFAULT_SVG.setAttributeNS(null, 'cx', 10);
    DEFAULT_SVG.setAttributeNS(null, 'cy', 10);
    DEFAULT_SVG.setAttributeNS(null, 'r', 50);
    DEFAULT_SVG.setAttributeNS(null, 'style', 'fill: none; stroke: blue; stroke-width: 1px;');
    if (svg === null) svg = DEFAULT_SVG ;
    let xmlSource = new XMLSerializer().serializeToString(svg);
    if (!xmlSource.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      xmlSource = xmlSource.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!xmlSource.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
      xmlSource = xmlSource.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    xmlSource = `<?xml version="1.0" standalone="no"?>\r\n${xmlSource}`;
    const svg64 = encodeURIComponent(xmlSource);
    const b64Start = 'data:image/svg+xml;charset=utf-8,';
    const src = b64Start + svg64 ; //"data:image/svg+xml;base64," + btoa(decodeURIComponent(encodeURIComponent(xml)));
    return src;
  }

}


class Help
{

  static set_properties(elem, prop_object)
  {
    for (let _prop in prop_object) elem[_prop] = prop_object[_prop];
  }

/*
  static safe_get(obj, key, def = null)
  {
    let val = def;
    if (obj !== null)
    {
      if (key in obj) val = obj[key];
    }
    return val;
  }
*/
/*
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
*/

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
    let float_value = parseFloat(value) ;
    if (float_value === 0.0) float_value += Number.EPSILON ;
    const decades = Math.floor( Math.log10( Math.abs(float_value) ) ) ;
    let decimal_places = 0;
    let prefixLength = 2;
    if (float_value < 0.0) prefixLength = 3
    decimal_places = display_length - Math.abs(decades) - 2 ;
    if (decades < 0) decimal_places += 1 ;
    if (decimal_places < 0) decimal_places = 0 ;
    const rounded_value_string = float_value.toFixed(decimal_places);
    return rounded_value_string;
  }

}
