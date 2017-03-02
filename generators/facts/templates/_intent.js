const fs = require('fs');

class <%= capitalizedIntentName %>Intent {
  constructor(app) {
    this.name = '<%= intentName %>Intent';
    this.slots = {};
    this.utterances = require('./<%= intentName %>-intent.json');
    this.loadFacts();
  }

  loadFacts() {
    this.facts = fs.readFileSync('./intents/<%= intentName %>-intent.txt', 'utf8').split('\n');
  }

  randomFact() {
    return this.facts[Math.floor(Math.random()*this.facts.length)];
  }

  execute(req, res) {
    res.say(this.randomFact());
    res.shouldEndSession(<%= shouldEndSession %>);
  }
}

module.exports = <%= capitalizedIntentName %>Intent;
