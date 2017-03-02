var alexa = require('alexa-app');
var winston = require('winston');
var glob = require('glob');

if (!process.env.ISLAMBDA) {
  var express = require('express');
  var bodyParser = require('body-parser');
}

class AlexaApp {
  constructor(options) {
    this.name = options.name;
    this.port = options.port || process.env.PORT || 3978;
    this.initializeApp();
    if (!process.env.ISLAMBDA) {
      this.initializeServer();
    }
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
    this.app.express(this.server, '/echo/');
  }

  initializeApp() {
    this.app = new alexa.app(this.name);
    this.app.launch(function(req, res) {
        res.say('<%= welcomeAnswer %>');
        res.shouldEndSession(<%= shouldEndSession %>);
    });
  }

  loadIntents() {
    var intentPath = './intents';
    glob("**.js", {cwd: './intents'}, function (er, files) {
      for (var i = 0; i < files.length; i++) {
        var currentIntent = new (require(intentPath+'/'+files[i]))();
        this.app.intent(currentIntent.name, {
          slots: currentIntent.slots,
          utterances: currentIntent.utterances
        },currentIntent.execute.bind(currentIntent));
      }
    }.bind(this));
  }
}

var alexaApp = new AlexaApp({ name: '<%= alexaName %>' });

if (process.env.ISLAMBDA) {
  exports.handler = alexaApp.app.lambda();
}
