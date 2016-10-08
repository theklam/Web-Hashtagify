function placeImage(imgurl) {
  var imgLink = document.getElementById("imgurl").value;
  document.getElementById("alpaca").src=imgLink;
}

function getCredentials(callbackFunction) {
  var data = {
    'grant_type': 'client_credentials',
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET
  };
  var url = 'https://api.clarifai.com/v1/token';

  return axios.post(url, data, {
    'transformRequest': [
      function() {
        return transformDataToParams(data);
      }
    ]
  }).then(function(r) {
    localStorage.setItem('accessToken', r.data.access_token);
    localStorage.setItem('tokenTimestamp', Math.floor(Date.now() / 1000));
    callbackFunction();
  }, function(err) {
    console.log(err);
  });
}

function transformDataToParams(data) {
  var str = [];
  for (var p in data) {
    if (data.hasOwnProperty(p) && data[p]) {
      if (typeof data[p] === 'string'){
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p]));
      }
      if (typeof data[p] === 'object'){
        for (var i in data[p]) {
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p][i]));
        }
      }
    }
  }
  return str.join('&');
}

function postImage(imgurl) {
  var accessToken = localStorage.getItem('accessToken');
  var data = {
    'url': imgurl
  };
  var url = 'https://api.clarifai.com/v1/tag';
  return axios.post(url, data, {
    'headers': {
      'Authorization': 'Bearer ' + accessToken
    }
  }).then(function(r) {
    parseResponse(r.data);
  }, function(err) {
    console.log('Sorry, something is wrong: ' + err);
  });
}

function parseResponse(resp) {
  var tags = [];
  if (resp.status_code === 'OK') {
    var results = resp.results;
    tags = results[0].result.tag.classes;
  } else {
    console.log('Sorry, something is wrong.');
  }
  var stringOfRelatedWords = tags.toString().replace(/,/g, ', ');
  document.getElementById('tags').innerHTML = stringOfRelatedWords;
  //document.getElementById('tags').innerHTML += "<br />Your picture is very, very, very " +
  //document.getElementById('tags').innerHTML.substring(0, document.getElementById('tags').innerHTML.indexOf(",")) + "!"

  // Reading in list of adjectives into an array
  // var arrayOfRelatedWords = stringOfRelatedWords.split(",");
  // var fs = require('fs');
  // var array = fs.readFileSync('adjectives-list.txt').toString().split("\n");
  // for(i in array) {
    // console.log(array[i]);
  // }
  //console.log(arrayOfRelatedWords);
  var arr = txtFileToArray("adjectives-list.txt");
  console.log(arr);
  return stringOfRelatedWords;
}

// given txt file return array
function txtFileToArray(txtFile) {
  $(document).ready(function() {
    //fetch text file
    $.get(txtFile, function(data) {
        //split on new lines
        var lines = data.split('\n');
        //create select
        var dropdown = $('<select>');
        //iterate over lines of file and create a option element
        for(var i=0;i<lines.length;i++) {
            //create option
            var el = $('<option value="'+i+'">'+lines[i]+'</option>');
            //append option to select
            $(dropdown).append(el);
        }
        //append select to page
        $('body').append(dropdown);
    });
});
}

function run(imgurl) {
  if (Math.floor(Date.now() / 1000) - localStorage.getItem('tokenTimeStamp') > 86400 || localStorage.getItem('accessToken') === null) {
    getCredentials(function() {
  postImage(imgurl);
});
  } else {
    postImage(imgurl);
  }
}
