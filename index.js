var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var cors = require('cors');

var app = express();
app.use(cors());

app.use(bodyParser.json());
app.set('port', (process.env.PORT || 4000));
app.use(bodyParser.urlencoded({extended: true}));


app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});
/*
app.get('/weather', function(req, response){
  request({url: 'http://api.wunderground.com/api/ff6d8d1f8d1c171e/conditions/q/TH/Ubon_Ratchathani.json', json:true}, function(err, res, json){
    if (err) {
      throw err;
    }
    var obj = json['current_observation'];
    var obj1 = obj["display_location"];

    response.send(obj1["state_name"]);
  })
});
*/

function getWeather(){
  request({url: 'http://api.wunderground.com/api/ff6d8d1f8d1c171e/conditions/q/TH/Ubon_Ratchathani.json', json:true}, function(err, res, json){
    if (err) {
      throw err;
    }
//    var obj = json['current_observation'];
//    var obj1 = obj["display_location"];
//    return obj1["state_name"];
      return json;
  });
}

/* Old
app.post('/webhook', (req, res) => {
  var text = req.body.events[0].message.text
  var sender = req.body.events[0].source.userId
  var replyToken = req.body.events[0].replyToken
  //console.log(text, sender, replyToken);
  //console.log(typeof sender, typeof text);
  // console.log(req.body.events[0])

  if (text === 'สวัสดี' || text === 'Hello' || text === 'hello') {
    sendText(sender, text);
  }
  sendText(sender, text);
  res.sendStatus(200);
});
*/
//new
app.post('/webhook', (req, res) => {
    async.waterfall([
            function(callback) {
                request({url: 'http://api.wunderground.com/api/e1cb835416fecd99/conditions/q/TH/Ubon_Ratchathani.json', json:true}, function(err, res, json){
					if (err) {
						throw err;
					}
					callback(json);
				})
            },
        ],
        function(่jsonData) {
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {YV4YHUNnJhTURSd9BzLGokn7ALa8+pKl/KooSoAEW7CL4yNF9TwjC3Jw5TuivsoQ3VwhB87kTwCamwcHFHj0Qv6XGMZKbJYXziekYqmHFnBj9AvZpxya3rRNupun8JIFv5EzUZUPlfZcywrvH9jhgQdB04t89/1O/w1cDnyilFU=}'
            };
            var data = {
                'replyToken': req.body['events'][0]['replyToken'],
                "messages": [{
                    "type": "text",
                    "text": jsonData
                }]
            };
            var options = {
                url: 'https://api.line.me/v2/bot/message/reply',
                proxy: process.env.FIXIE_URL,
                headers: headers,
                json: true,
                body: data
            };

            request.post(options, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                } else {
                    console.log('error: ' + JSON.stringify(response));
                }
            });
        }
    );
});

function sendText (sender, text) {
  var tmp = function(){
              request({url: 'http://api.wunderground.com/api/ff6d8d1f8d1c171e/conditions/q/TH/Ubon_Ratchathani.json', json:true}, function(err, res, json){
              if (err) {throw err;}
              return json;
            });
          }
  //var tmp = yield getWeather();
  console.log(tmp);
  var data = {
    to: sender,
    messages: [
      {
        type: 'text',
        text: JSON.stringify(tmp)
      }
    ]
  };
  request({
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer {YV4YHUNnJhTURSd9BzLGokn7ALa8+pKl/KooSoAEW7CL4yNF9TwjC3Jw5TuivsoQ3VwhB87kTwCamwcHFHj0Qv6XGMZKbJYXziekYqmHFnBj9AvZpxya3rRNupun8JIFv5EzUZUPlfZcywrvH9jhgQdB04t89/1O/w1cDnyilFU=}'
    },
    url: 'https://api.line.me/v2/bot/message/push',
    method: 'POST',
    body: data,
    json: true
  }, function (err, res, body) {
    if (err) console.log('error');
    if (res) console.log('success');
    if (body) console.log(body);
  });
}

/*
wunderground.conditions().request('84111', function(err, response){
    console.log(response);
});
*/

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
