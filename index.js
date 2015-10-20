var request   = require('request');
var _         = require('underscore');
var cheerio   = require('cheerio');
var urlencode = require('urlencode');
var jschardet = require("jschardet");
request.cookie('ICIBA_HUAYI_COOKIE=1');

var Iciba = function(query) {
  this.base = 'http://fy.iciba.com/api.php';
  this.input = query
  this.query  = {q: query};
  this.chinese = false;

};

Iciba.prototype.setLanguage = function() {
  if (this.chinese) {
    this.query.type = 'zh-en';
    delete this.query.auto;
  } else {
    this.query.auto = true;
    delete this.query.type;
  }
}

Iciba.prototype.post = function(cb) {
  var self = this;
  this.setLanguage();

  request.post({url: this.base, form: this.query}, function(err,resp, body) {
    if (body === self.input) {
      self.chinese = true;
      self.post(cb);
    } else { 
      var translation = JSON.parse(body);
      $ = cheerio.load(translation.ret);
      translation = $('.translate_result').text();
      cb(translation);
    }
  });
};

module.exports = Iciba;
