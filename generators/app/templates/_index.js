var express = require('express');
var alexa = require('alexa-app');
var bodyParser = require('body-parser');
var winston = require('winston');
var glob = require('glob');

class AlexaApp {
  constructor(options) {
    this.name = options.name;
    this.port = options.port || process.env.PORT || 3978;
    this.initializeServer();
    this.initializeApp();
    this.loadIntents();
  }

  initializeServer() {
    this.server = express();
    this.server.use(bodyParser.urlencoded({extended: true}));
    this.server.use(bodyParser.json());
    this.server.set('view engine', 'ejs');
    this.server.listen(this.port);
    winston.log('info','Listening on port '+this.port);
    winston.log('info','You can access your intent information at http://localhost:'+this.port+'/echo/'+this.name);
  }

  initializeApp() {
    this.app = new alexa.app(this.name);
    this.app.launch(function(req, res) {
        res.say('<%= welcomeAnswer %>');
        response.shouldEndSession(<%= shouldEndSession %>);
    });
    this.app.express(this.server, '/echo/');
  }

  loadIntents() {
    var intentPath = './intents';
    glob("**.js", {cwd: './intents'}, function (er, files) {
      for (var i = 0; i < files.length; i++) {
        var currentIntent = new (require(intentPath+'/'+files[i]))();
        this.app.intent(currentIntent.name, {
          slots: currentIntent.slots,
          utterances: currentIntent.utterances
        },currentIntent.execute);
      }
    }.bind(this));    
  }
}

var alexaApp = new AlexaApp({ name: '<%= alexaName %>', port: <%= defPort %> });