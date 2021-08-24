let div = document.createElement("DIV");
document.body.appendChild(div);

refresh_data();
setInterval(refresh_data, 2000);

async function refresh_data() 
{
  const response = await fetch('https://labremote.net/client/contributed.php');
  let data = null;
  try
  {
    data = await response.json();
  }
  catch(e)
  {
  }
  console.log("data: ", data);

  file_data = data["file_data"];
  thumb_names = data["thumb_names"];
  channels = data["channels"];
  timestamps = data["timestamps"];

  html_string = '<h2>MarIEx user contributed images</h2>';
  for (let _thumb_counter = 0; _thumb_counter < file_data.length; _thumb_counter++)
  {
    html_string += '<a style="padding:5px;" href="' + 'https://labremote.net/client/images/' + file_data[_thumb_counter]["image_name"] + '">';
    html_string += '<img style="border:5px outset silver;" alt="' + file_data[_thumb_counter]["image_name"] + '" src="' + 'https://labremote.net/client/images/' + file_data[_thumb_counter]["thumb_name"] + '">';
    html_string += '</a>';
  }
  console.log("html_string: ", html_string);

  div.innerHTML = html_string;
}
