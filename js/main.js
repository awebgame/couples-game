var f_name = "";
var m_name = "";

var f_score = 0;
var m_score = 0;

var counter = 1;
var current_player = 1;

var max = 5;

var t_option = 0;
var a_option = 0;
var b_option = 0;

var guid = "";
var token = "";

var api_url = "https://oauth.reddit.com/r/NSFW_GIF/search.json?restrict_sr=on&include_over_18=on&sort=relevance&t=all&limit=50";

f_tags = ["dildo", "blowjob", "finger", "footjob", "ass", "fuck+pussy", "69", "cowgirl", "boobs", "suck+cock", "spread", "tit+fuck"];
m_tags = ["lick+pussy", "lick+ass", "spank+ass", "fuck+pussy", "69", "spank"];

a_tags = ["anal"];

function guidGenerator() {
  var S4 = function() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4());
}

function start_game() {
  f_score = 0;
  m_score = 0;
  counter = 1;
  current_player = 1;
  guid = "";

  f_name = capitalizeFirstLetter(document.getElementById('female_input').value);
  m_name = capitalizeFirstLetter(document.getElementById('male_input').value);

  if(f_name === "" || m_name === "") {
    alert("Please enter the player names");
  } else {

    guid = guidGenerator();

    $.ajax({
      type: "POST",
      url: "https://www.reddit.com/api/v1/access_token",
      dataType: 'json',
      async: false,
      headers: {
        "Authorization": "Basic " + btoa("9pOsP_Q4bmSSIA:i3pQtUJhQnVz6zvz7-4jCesikvQ")
      },
      data: {grant_type: 'https://oauth.reddit.com/grants/installed_client', device_id: guid},
      success: function(data){
        token = data['access_token'];
      }
    });

    t_option = document.getElementById('t_option').checked;
    a_option = document.getElementById('a_option').checked;
    b_option = document.getElementById('b_option').checked;

    if(a_option) {
      couple_tags.push(a_tags);
    }


    document.getElementById('game_start').style.display = 'none';

    document.getElementById('f_score_name').innerHTML = f_name;
    document.getElementById('m_score_name').innerHTML = m_name;
    document.getElementById('game_container').style.display = 'block';
    load_next();
  }
}

function score_color() {
  if(f_score > m_score) {
    document.getElementById('f_score').classList.remove('text-error');
    document.getElementById('f_score').classList.add('text-success');
    document.getElementById('m_score').classList.remove('text-success');
    document.getElementById('m_score').classList.add('text-error');
  } else if(m_score < f_score) {
    document.getElementById('m_score').classList.remove('text-error');
    document.getElementById('m_score').classList.add('text-success');
    document.getElementById('f_score').classList.remove('text-success');
    document.getElementById('f_score').classList.add('text-error');
  } else {
    document.getElementById('f_score').classList.remove('text-error');
    document.getElementById('m_score').classList.remove('text-error');
    document.getElementById('f_score').classList.add('text-success');
    document.getElementById('m_score').classList.add('text-success');
  }
}

function load_next() { 
  if(f_score == max || m_score == max) {
    end_game();
  }

  current_player = !current_player;
  
  if(current_player == 0) {
    document.getElementById('player_name').innerHTML = f_name;
   } else {
    document.getElementById('player_name').innerHTML = m_name;
   } 

   load_gif();
}

function update_score(player) {
  if(current_player == 0) {
    f_score++;
    document.getElementById('f_score_value').innerHTML = f_score;
  } else {
    m_score++;
    document.getElementById('m_score_value').innerHTML = m_score;
  }  

  load_next();
  score_color();
}

function load_gif() {
  current_tag = "";  

  if(current_player == 0) {
    f_random = Math.floor((Math.random() * f_tags.length));
    current_tag = f_tags[f_random]; 
    url = api_url + "&q=" + current_tag;
  } else {

    m_random = Math.floor((Math.random() * m_tags.length));
    current_tag = m_tags[m_random];
    url = api_url + "&q=" + current_tag;
  }

  $.ajax({
    type: "GET",
    url: url,
    dataType: 'json',
    async: false,
    headers: {
      "Authorization": "Bearer " + token
    },
    success: function(data){
      console.log(data);
      n_random = Math.floor((Math.random() * data["data"]["children"].length));
      console.log("Random: " + n_random);
      applyGif(data["data"]["children"][n_random]["data"]);
      //document.getElementById('current_gif').innerHTML = '<img src="' + data["data"]["children"][n_random]["data"].url + '" />';
    }
  });
}

function applyGif(gif) {
  var elem = document.getElementById('current_gif');
  url = "";
  if(gif.domain == "gfycat.com") {
    if(gif["media_embed"].length == 0) {
      loadGif();
    } else {
      decoded = $('<div/>').html(gif["media_embed"].content).text();
      elem.innerHTML = decoded;
    }
  }
  else if(gif.domain == "i.imgur.com") {
    url = gif.url.substr(0, gif.url.lastIndexOf(".")) + ".gif";
    elem.innerHTML = '<img src="' + url + '" />';
  } 
  else if(gif.domain == "imgur.com") {
    if(gif["media_embed"].length == 0) {
      loadGif();
    } else {
      decoded = $('<div/>').html(gif["media_embed"].content).text();
      elem.innerHTML = decoded;
    }
  } else {
    url = gif.url;
    elem.innerHTML = '<img src="' + url + '" />';
  }
}

function end_game() {
  document.getElementById('game_container').style.display = 'none';
  document.getElementById('game_winner').style.display = 'block';

  if(f_score == max) {
    document.getElementById('player_winner').innerHTML = f_name + ' wins!';
  } else {
    document.getElementById('player_winner').innerHTML = m_name + ' wins!';
  }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
