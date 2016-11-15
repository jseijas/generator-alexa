class <%= capitalizedIntentName %>Intent {
  constructor(app) {
    this.name = '<%= intentName %>Intent';
    this.slots = {};
    this.utterances = require('./<%= intentName %>-intent.json');
  }

  execute(req, res) {
    response.say('<%= responseText %>');
    response.shouldEndSession(<%= shouldEndSession %>);    
  }
}

module.exports = <%= capitalizedIntentName %>Intent;