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

var api_url = "https://api.ababeen.com/api/images.php?count=20";

f_tags = ["dildo", "blowjob", "finger", "footjob", "ass"];
m_tags = ["masturbate", "lick+pussy", "lick+boobs", "lick+ass"];

a_tags = ["anal"];

couple_tags = ["fuck+pussy", "69"];

function start_game() {
  f_score = 0;
  m_score = 0;
  counter = 1;
  current_player = 1;

  f_name = capitalizeFirstLetter(document.getElementById('female_input').value);
  m_name = capitalizeFirstLetter(document.getElementById('male_input').value);

  if(f_name === "" || m_name === "") {
    alert("Please enter the player names");
  } else {
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

  if(current_player == 0) {

  }
  var url = api_url + '&q=r/NSFW_GIF+blowjob+teen+couple+gif';

  $.ajax({
    url: url,
    success: function(data) {
    data = $.parseJSON(data);
      console.log(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log("Ajax error");
    }
  });
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

