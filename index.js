function placeImage(imgurl) {
    var imgLink = document.getElementById("imgurl").value;
    document.getElementById("alpaca").src = imgLink;
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
            if (typeof data[p] === 'string') {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p]));
            }
            if (typeof data[p] === 'object') {
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
    //document.getElementById('tags').innerHTML = stringOfRelatedWords;
    var listOfWordsFromClarifai = stringOfRelatedWords.split(", ");
    var listOfAdjectives = [
      "Aardvark","Albatross","Alligator","Alpaca","Ant",
"Anteater","Antelope","Ape","Armadillo","Ass",
"Baboon","Badger","Barracuda","Bat","Bear",
"Beaver","Bee","Bison","Boar","Buffalo",
"Galago","Butterfly","Camel","Caribou","Cat",
"Caterpillar","Cattle","Chamois","Cheetah","Chicken",
"Chimpanzee","Chinchilla","Chough","Clam","Cobra",
"Cockroach","Cod","Cormorant","Coyote","Crab",
"Crane","Crocodile","Crow","Curlew","Deer",
"Dinosaur","Dog","Dogfish","Dolphin","Donkey",
"Dotterel","Dove","Dragonfly","Duck","Dugong",
"Dunlin","Eagle","Echidna","Eel","Eland",
"Elephant","Elephant seal","Elk","Emu","Falcon",
"Ferret","Finch","Fish","Flamingo","Fly",
"Fox","Frog","Gaur","Gazelle","Gerbil",
"Giant Panda","Giraffe","Gnat","Gnu","Goat",
"Goose","Goldfinch","Goldfish","Gorilla","Goshawk",
"Grasshopper","Grouse","Guanaco","Guinea fowl","Guinea pig",
"Gull","Hamster","Hare","Hawk","Hedgehog",
"Heron","Herring","Hippopotamus","Hornet","Horse",
"Human","Hummingbird","Hyena","Jackal","Jaguar",
"Jay","Jay, Blue","Jellyfish","Kangaroo","Koala",
"Komodo dragon","Kouprey","Kudu","Lapwing","Lark",
"Lemur","Leopard","Lion","Llama","Lobster",
"Locust","Loris","Louse","Lyrebird","Magpie",
"Mallard","Manatee","Marten","Meerkat","Mink",
"Mole","Monkey","Moose","Mouse","Mosquito",
"Mule","Narwhal","Newt","Nightingale","Octopus",
"Okapi","Opossum","Oryx","Ostrich","Otter",
"Owl","Ox","Oyster","Panther","Parrot",
"Partridge","Peafowl","Pelican","Penguin","Pheasant",
"Pig","Pigeon","Pony","Porcupine","Porpoise",
"Prairie Dog","Quail","Quelea","Rabbit","Raccoon",
"Rail","Ram","Rat","Raven","Red deer",
"Red panda","Reindeer","Rhinoceros","Rook","Ruff",
"Salamander","Salmon","Sand Dollar","Sandpiper","Sardine",
"Scorpion","Sea lion","Sea Urchin","Seahorse","Seal",
"Shark","Sheep","Shrew","Shrimp","Skunk",
"Snail","Snake","Spider","Squid","Squirrel",
"Starling","Stingray","Stinkbug","Stork","Swallow",
"Swan","Tapir","Tarsier","Termite","Tiger",
"Toad","Trout","Turkey","Turtle","Vicuña",
"Viper","Vulture","Wallaby","Walrus","Wasp",
"Water buffalo","Weasel","Whale","Wolf","Wolverine",
"Wombat","Woodcock","Woodpecker","Worm","Wren",
"Yak","Zebra"
    ];
    console.log("list of adjectives: " + listOfAdjectives);
    console.log("list of words from clarifai: " + listOfWordsFromClarifai);
    //console.log("first adjective, if one exists is: " + findFirstAdjective(listOfWordsFromClarifai, listOfAdjectives));
    //console.log("first adjective, if one exists is: " + findFirstAdjective(listOfWordsFromClarifai, listOfAdjectives));
    console.log(listOfWordsFromClarifai);
    console.log("first adjective, if one exists is: " + findFirstAdjective(listOfWordsFromClarifai, listOfAdjectives));
    document.getElementById('tags').innerHTML = "You're a " +
    findFirstAdjective(listOfWordsFromClarifai, listOfAdjectives) + "! Am I right? :)";
    //document.getElementById('tags').innerHTML.substring(0, document.getElementById('tags').innerHTML.indexOf(",")) + "!"
    return stringOfRelatedWords;
}

//find the first adjective that occurs in the words from clarifai
function findFirstAdjective(listOfWordsFromClarifai, listOfAdjectives) {
  var adjFoundInList = false;
  for(var i = 0; i < listOfWordsFromClarifai.length; i++) {
    //console.log("word #" + (i+1) + " from clarifai: " + listOfWordsFromClarifai[i]);
    for(var j = 0; j < listOfAdjectives.length; j++) {
      //console.log("word #" + (j+1) + " from adjectives: " + listOfAdjectives[j])
      if(listOfWordsFromClarifai[i] === listOfAdjectives[j].toLowerCase()) {
        console.log("found word!");
        adjFoundInList = true;
        return listOfWordsFromClarifai[i];
      }
    }
  }
  if(adjFoundInList === false) {
    return "cutesyerr";
  }
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
            for (var i = 0; i < lines.length; i++) {
                //create option
                var el = $('<option value="' + i + '">' + lines[i] + '</option>');
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
