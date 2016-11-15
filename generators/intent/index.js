'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var fs = require('fs');
var glob = require('glob');

module.exports = yeoman.Base.extend({

  /**
   * Ask general questions to generate the intent.
   */
  prompting: function () {
    this.log('\r\n');
    this.log('Generator of alexa intents');
    this.log('\r\n');
    var defAppName = path.basename(process.cwd());

    var prompts = [{
      type: 'input',
      name: 'intentName',
      message: 'What\'s the name of the intent?'
    }, {
      type: 'input',
      name: 'responseText',
      message: 'What\'s the default response?'
    }, {
      type: 'confirm',
      name: 'shouldEndSession',
      message: 'Should end session?',
      default: true 
    }];

    function capitalize(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    }

    function uncapitalize(s) {
      return s.charAt(0).toLowerCase() + s.slice(1);
    }

    return this.prompt(prompts).then(function (props) {
      this.props = props;
      this.props.intentName = uncapitalize(this.props.intentName);
      this.props.capitalizedIntentName = capitalize(this.props.intentName); 
      this.props.utterances = [];
    }.bind(this));
  },

  /**
   * Keep asking utterances until the user ends.
   */
  askUtterances: function(done) {
    var prompts = [{
      type: 'input',
      name: 'utterance',
      message: 'Enter an utterance for the intent (enter to finish)',
    }];
    if (!done) {
      done = this.async();
    }

    return this.prompt(prompts).then(function(answer) {
      if (answer.utterance && answer.utterance !== '') {
        this.props.utterances.push(answer.utterance);
        this.askUtterances(done);
      } else {
        done();
      }
    }.bind(this));
  },

  /**
   * Write the files for generating an intent.
   */
  writing: function () {
    this.props.utterancesStr = '[';
    for (var i = 0; i < this.props.utterances.length; i++) {
      if (i > 0) {
        this.props.utterancesStr += ', ';
      }
      this.props.utterancesStr += '"'+this.props.utterances[i]+'"';
    }
    this.props.utterancesStr += ']';
    var root = path.join(this.destinationRoot(), 'intents');
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root);
    }
    this.destinationRoot(root);
    var source = '_intent.js';
    var target = this.props.intentName+'-intent.js';
    this.template(source, target, this.props);
    source = '_utterances.json'    
    var target = this.props.intentName+'-intent.json';
    this.template(source, target, this.props);
  }
});


