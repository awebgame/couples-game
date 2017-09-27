var apiKey = "6pxjCQsVyNXqE3GTbgzFglwsNayg85fwu6vvPA5kZ872jsMwmS";

var tumblrEndpoint = "https://api.tumblr.com/v2/blog/best-hot-gifs.tumblr.com/";

var hardcoreEndpoint = "https://api.tumblr.com/v2/blog/hardcoreteenpornsex.tumblr.com/";

var gifApi;

var infoApi;

var gifs;

var f_score;
var m_score;
var f_name;
var m_name;

var rounds;

var f_accept;
var m_accept;
var f_skip;
var m_skip;
var count;

var current_play;

function initGame() {
  f_score = 0;
  m_score = 0;
  f_name = "";
  m_name = "";
  rounds = 0;
  count = 0;
  current_play = 0;

  if(document.getElementById('female_input').value != '' && document.getElementById('male_input').value != '' && (document.getElementById('rounds_input').value > 4 && document.getElementById('rounds_input').value < 21)) {
    var totalPosts = 0;
    var offset = 0;

    f_name = capitalizeFirstLetter(document.getElementById('female_input').value);
    m_name = capitalizeFirstLetter(document.getElementById('male_input').value);

    rounds = document.getElementById('rounds_input').value;

    document.getElementById('f_player_name').innerText = f_name;
    document.getElementById('m_player_name').innerText = m_name;

    if(document.getElementById('hardcore_mode').checked) {
      gifApi = hardcoreEndpoint + "posts/photo?api_key=" + apiKey;
      infoApi = hardcoreEndpoint + "info" + "?api_key=" + apiKey; 
    } else {
      gifApi = tumblrEndpoint + "posts/photo?api_key=" + apiKey;
      infoApi = tumblrEndpoint + "info" + "?api_key=" + apiKey;
    }

    $.ajax({
      url: infoApi,
      dataType: 'json',
      success: function(res) {
        totalPosts = res["response"]["blog"].posts - rounds;

        offset = Math.floor((Math.random() * totalPosts));

        $.ajax({
          url: gifApi + "&limit=" + rounds + "&offset=" + offset,
          dataType: 'json',
          success: function(res) {
            gifs = res["response"]["posts"];

            document.getElementById('game_start').style.display = 'none';

            document.getElementById('game_container').style.display = 'block';
            loadGif();
          }
        });
      }
    });  
  } else {
    alert("Please enter the details");
  }
}

function loadGif() {
  f_accept = 0;
  m_accept = 0;
  f_skip = 0;
  m_skip = 0;

  if(count < rounds) {
    document.getElementById('round_info').innerHTML = 'Round ' + (count+1);
    document.getElementById('current_gif').innerHTML = '<img class="gif_img" src="' + gifs[count]["photos"][0]["original_size"].url + '" />';
    count++;
  } else {
    endGame();
  }
} 

function accept(player) {
  if(current_play == 0) {
    if(player == 0) {
      f_accept = 1;
    } else {
      m_accept = 1;
    }
    checkStatus();
  }
}

function skip(player) {
  if(current_play == 0) {
    if(player == 0) {
      f_skip = 1;
    } else {
      m_skip = 1;
    }  
    checkStatus();
  }
}

function checkStatus() {
  if(f_skip && !m_accept) {
    m_score = m_score + 1;
    loadGif();
  } 
  else if(m_skip && !f_accept) {
    f_score = f_score + 1;
    loadGif();
  }
  else if(f_skip && m_accept) {
    m_score = m_score + 1;
    loadGif();
  } 
  else if(m_skip && f_accept) {
    f_score = f_score + 1;  
    loadGif();
  }
  else if(m_skip && f_skip) {
    loadGif();
  }
  else if(f_accept && m_accept) {
    m_score = m_score + 1;
    f_score = f_score + 1;
    document.getElementById('current_button').style.display = 'block';
    current_play = 1;
  }
  
  document.getElementById('f_player_score').innerText = f_score;
  document.getElementById('m_player_score').innerText = m_score;
}

function endGame() {
  document.getElementById('game_container').style.display = 'none';
  document.getElementById('game_winner').style.display = 'block';

  if(f_score < m_score) {
    document.getElementById('player_winner').innerHTML = m_name + ' wins!';
  }
  else if(f_score > m_score) {
    document.getElementById('player_winner').innerHTML = f_name + ' wins!';
  }
  else {
    document.getElementById('player_winner').innerHTML = 'Draw! Good job!';
  }  
}

function doneGif() {
  document.getElementById('current_button').style.display = 'none';
  current_play = 0;
  loadGif();
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function newGame() {
  document.getElementById('game_winner').style.display = 'none';

  document.getElementById('female_input').value = f_name;
  document.getElementById('male_input').value = m_name;

  document.getElementById('f_player_score').innerText = "0";
  document.getElementById('m_player_score').innerText = "0";

  document.getElementById('game_start').style.display = 'block';
}

