//Dependencies

var express = require("express");
var mongojs = require("mongojs");
// var bodyParser = require("body-parser");
// var mongoose = require("mongoose");
// Requiring our Note and Article models
// var Note = require("./models/Note.js");
// var Article = require("./models/Article.js");
//requiring cheerio and request
var cheerio = require("cheerio");
var request = require("request");

//initialize express
var app = express();
app.use(express.static("public"));

//db config
var dbName = "news-scraper";
var collections = ["articles"];

//website scrapped
var websiteURL = "https://www.thestreet.com";

//link mongo to db
var db = mongojs(dbName, collections);

db.on("error", function (error) {
  console.log("Error", error);
});

app.get("/scrape", function (req, res) {
// Make a request call to grab the HTML body from the site of your choice
  request(websiteURL, function(error, response, html) {
  
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);
  
    // An empty array to save the data that we'll scrape
    // var results = [];
  
    // Select each element in the HTML body from which you want information.
    // NOTE: Cheerio selectors function similarly to jQuery's selectors,
    // but be sure to visit the package's npm page to see how it works
    $("div.news-list__block").each(function(i, element) {
  
      var title = $(element).find("h3.news-list__headline ").text();
      var link = $(element).find("a").attr("href");
  
      // Save these results in an object that we'll push into the results array we defined earlier
      db.articles.insert({
        title: title,
        link: "https://www.thestreet.com" + link

      }, function (result){
        res.json(result);
      });
    });
  
    // Log the results once you've looped through each of the elements found with cheerio
    // console.log(results);
  });
});

//listening on port 3000
app.listen(3000, function () {
  console.log("App is running on port 3000 successfully!");
});

