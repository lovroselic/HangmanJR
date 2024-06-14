/*jshint browser: true */
/*jshint -W097 */
/*jshint -W117 */
/*jshint -W061 */
"use strict";
// coded by Lovro Selic , (C) C00lSch00l 2014, 2015,2020
//bugs enter reloads page?

var Source = "";
if (window.location.hostname === "chestbook.si") {
  Source = "https://chestbook.si/wp-content/uploads/Games/Assets/";
}

//var Source = "https://www.c00lsch00l.eu";


console.clear();
const VERSION = "2.04.0";
const UN_CHAR = "_";
const MAX_LIVES = 7;
console.log("Hangman JR v" + VERSION + " by Lovro Selic, (c) C00lSch00l 2014, 2015");

const THEMES = ["CLOTHES/ACCESSORIES", "FOOD", "NATURE/LANDSCAPE", "SCHOOL/ACCESSORIES", "ANIMALS", "VEHICLES", "HOME/HOBBY", "SURPRISE ME"];
let LAST_THEME = THEMES.length;
const clothes = ["TIGHTS", "STOCKINGS", "SLIPPERS", "SHORTS", "PYJAMAS", "MITTENS", "BOOTS", "AN UMBRELLA", "A SCARF", "A PARKA", "A BAG", "TROUSERS", "SOCKS", "A SKIRT", "SHOES", "A PULLOVER", "LEGGINGS", "A JACKET", "A DRESS", "A CAP"];
const food = ["AN APPLE", "A BANANA", "A CAKE", "A CARROT", "A CHERRY", "CHOCOLATE", "A COOKIE", "AN ICECREAM", "A LOLLIPOP", "MILK", "AN ORANGE", "PANCAKES", "A PIZZA", "A PUMPKIN", "SPAGHETTI", "TEA",
  "A TOMATO", "A LEMON", "A PLUM", "A PINEAPPLE", "A PEAR", "A MUFFIN", "A SANDWICH", "A STRAWBERRY", "BUTTER", "CANDY", "CHEESE", "COFFEE", "GRAPES", "JAM", "JUICE", "A MUSHROOM"];
const landscape = ["A BUSH", "A FLOWER", "A FOREST", "GRASS", "A HILL", "A LAKE", "LEAVES", "A MEADOW", "A MOUNTAIN", "A RIVER", "THE SUN", "A TREE"];
const school = ["A BOARD", "A BOOK", "A CHAIR", "A CLASSROOM", "A DESK", "GLUE", "A LIGHT", "A PEN", "A PENCIL", "A SCHOOL", "A BIN", "A COMPUTER", "A NOTEBOOK", "A RUBBER", "A DOOR", "A PAINTBRUSH",
  "PAPER", "A RULLER", "A SCHOOLBAG", "A WINDOW"];
const animals = ["A BEAR", "A BIRD", "A BUTTERFLY", "A CAT", "A CHICKEN", "A COW", "A DOG", "A DOLPHIN", "AN ELEPHANT", "A FISH", "A FOX", "A GIRAFFE", "A HAMSTER", "A HORSE", "A LION", "A MONKEY", "A MOUSE",
  "A PIG", "A RABBIT", "A SNAKE", "A TIGER", "A BEE", "A CAMEL", "A CROCODILE", "A DEER", "A DONKEY", "A DUCK", "A FLY", "A FROG", "A GORILLA", "A HEN", "A HIPPOPOTAMUS", "A KANGAROO", "A PANDA", "A PARROT",
  "A RAT", "A SHARK", "A SHEEP", "A SPIDER", "A SWAN", "A WOLF", "A ZEBRA", "AN ANT", "A JELLYFISH", "A CATERPILLAR"];
const vehicles = ["A VAN", "AN AEROPLANE", "A HELICOPTER", "A SHIP", "A MOTORBIKE", "A FIRE ENGINE", "A BICYCLE", "A TRAIN", "A CAR", "A BUS", "A BOAT"];
const home = ["A WARDROBE", "A TEAPOT", "A SLIDE", "ROLLERBLADES", "A PUZZLE", "A PILLOW", "SKATES", "A GLASS", "A GARDEN", "A DINING ROOM", "A CUPBOARD", "AN ARMCHAIR", "A SLEDGE", "A SANDBOX", "A RACKET", "A PLAYGROUND",
  "A MUG", "A HALL", "A CUP", "A CARPET", "A BOWL", "A BOARD GAME", "TOYS", "A TELEVISION", "A TEDDY BEAR", "A TABLE", "A SPOON", "SCALES", "A PLATE", "A LIVING ROOM", "A KNIFE", "A KITE", "A KITCHEN", "A FORK",
  "A DOLL", "THE DISHES", "A CLOCK", "BLOCKS", "A BEDROOM", "A BED", "A BATHROOM", "A BALLOON", "A BALL", "A TOILET"];
var collection = [clothes, food, landscape, school, animals, vehicles, home];
var article;
var theLetter, lives, newWord, guessWord;
var alphaBET = "abcdefghijklmnopqrstuvwxyz".toUpperCase();
//*******************************************************************************************************************

$(document).ready(function () {
  setUp();
  var lives = MAX_LIVES;
  $("#start").click(function () {
    startGame();
  });
  $("#guess").click(function () {
    checkLetter();
  });
});

function checkArticle() {
  var zmaga, zguba;
  var typedArticle = $("#theArticle").val().toUpperCase();
  if (article !== "none") {
    if (typedArticle === article) {
      zmaga = true;
    } else {
      zmaga = false;
    }
  } else if (
    typedArticle === "   " ||
    typedArticle === "  " ||
    typedArticle === " " ||
    typedArticle === ""
  ) {
    zmaga = true;
  } else {
    zmaga = false;
  }
  if (article === "none") {
    article = "";
  }
  $("#buildSentence").css("word-spacing", "4px");
  if (zmaga) {
    $("#story").html(
      "<img src='" + Source + "/Images/hangman_win.jpg' width='440'>"
    );
    $("#message").html(
      "Message: <span class='green'>Excellent! You also knew the correct article. Great job - you have won the game.</span>"
    );
    $("#theArticle").remove();
    $("#buildSentence").html(
      "<span class='green'>" + article + " " + newWord + "</span>"
    );
  } else {
    $("#story").html(
      "<img src='" + Source + "/Images/hangman0.jpg' width='440'>"
    );
    $("#theArticle").remove();
    $("#message").html(
      "Message: <span class='red'>You FAILED!<br> Solution was: </span>" +
      article +
      " " +
      newWord
    );
    $("#buildSentence").html(
      "<span class='wrong'>" +
      typedArticle +
      "</span><span class='green'>" +
      " " +
      newWord +
      "</span>"
    );
  }
  tidy();
  return;
}
function checkLetter() {
  theLetter = $("#getLetter")
    .val()
    .toString();
  theLetter = theLetter.toUpperCase();
  if (theLetter === "") {
    $("#message").html(
      "Message: <span class='red'>please, enter a letter.</span>"
    );
    return;
  }
  if (alphaBET.indexOf(theLetter) === -1) {
    $("#message").html(
      "Message: <span class='red'>this was not a letter</span>"
    );
    $("#getLetter").val("");
    return;
  }
  var whichLett = newWord.indexOf(theLetter);
  if (whichLett === -1) {
    $("#leftovers").append(theLetter + ", ");
    $("#message").html("Message: <span class='red'>incorrect letter</span>");
    lives--;
    $("#story").html(
      "<img src='" + Source + "/Images/hangman" + lives + ".jpg' width='440'>"
    );
    if (lives === 0) {
      if (article === "none") {
        article = "";
      }
      $("#message").html(
        "Message: <span class='red'>You FAILED!<br> Solution was: </span>" +
        article +
        " " +
        newWord
      );
      tidy();
    }
  } else {
    addChar(theLetter);
    let CS = colourLetter(theLetter);
    $("#buildSentence").html(CS);
    $("#message").html("Message: <span class='green'>correct letter</span>");
    var testEndOfGame = guessWord.indexOf(UN_CHAR);
    if (testEndOfGame === -1) {
      $("#message").html("Message: <span class='green'>Great work. You have guessed the word! Now fill in the correct definite (the) or indefinite (a/an) article to WIN the game.</span>");
      $("#leftovers").html("");
      $("#build").prepend("<input type='text' id='theArticle' size='1' maxlength='3' name='theArticle' style='width:80px'/>");
      $("#getLetter").prop("disabled", true);
      $("#guess").prop("disabled", true);
      $("#getLetter").off();
      $("#theArticle").keypress(function (event) {
        if (event.which === 13) {
          //event.preventDefault();
          checkArticle();
        }
      });
    }
    $("#theArticle").focus();
  }
  $("#getLetter").val("");
  setLives();
}
function tidy() {
  $("#guess").prop("disabled", true);
  $("#getLetter").prop("disabled", true);
  $("#start").prop("disabled", false);
  $("#theme").prop("disabled", false);
}
function unTidy() {
  $("#guess").prop("disabled", false);
  $("#getLetter").prop("disabled", false);
  $("#getLetter").keypress(function (event) {
    if (event.which === 13) {
      //event.preventDefault();
      checkLetter();
    }
  });
  $("#start").prop("disabled", true);
  $("#theme").prop("disabled", true);
  $("#message").html("Message: ");
  $("#leftovers").html("Incorrect letters: ");
  lives = MAX_LIVES;
}
function addChar(character) {
  var xix = newWord.indexOf(character);
  guessWord = guessWord.split("");
  while (xix !== -1) {
    guessWord[xix] = newWord[xix];
    xix = newWord.indexOf(character, xix + 1);
  }
  guessWord = guessWord.join("");
}
function colourLetter(character) {
  var colouredSentence = guessWord;
  colouredSentence = colouredSentence.split("");
  var ix = colouredSentence.indexOf(character);
  while (ix !== -1) {
    colouredSentence[ix] = '<span class="blue">' + colouredSentence[ix] + "</span>";
    ix = colouredSentence.indexOf(character, ix + 1);
  }
  colouredSentence = colouredSentence.join("");
  return colouredSentence;
}
function startGame() {
  $("#theArticle").remove();
  $("#the_picture").html("");
  $("#getLetter").html("");
  $("#buildSentence").css("word-spacing", "20px");
  unTidy();
  newWord = createWord().toUpperCase();
  //console.log("newWord", newWord);
  var spcIndex = newWord.indexOf(" ");
  if (spcIndex !== -1) {
    article = newWord.substring(0, spcIndex);
    newWord = newWord.substring(++spcIndex);
  } else {
    article = "none";
  }
  guessWord = displayWord(newWord);
  $("#buildSentence").html(guessWord);
  setLives();
  $("#story").html("<img src='" + Source + "/Images/hangman7.jpg' width='440'>");
  var picElement =
    "<img src='" +
    Source +
    "/CoolToolImages/" +
    newWord.toUpperCase() +
    ".jpg' alt='Image not found' width='145' height='145'>";
  $("#the_picture").html(picElement);
  $("#theArticle").off();
  $("#getLetter").focus();
}
function setLives() {
  var block = String.fromCharCode(9608);
  block = stringFill(block, lives);
  if (lives === 1) {
    block = "<span class='red'>" + block + "</span>";
  } else if (lives < 4) {
    block = "<span class='yellow'>" + block + "</span>";
  } else {
    block = "<span class='green'>" + block + "</span>";
  }
  $("#lives").html("Forgiveness: " + block);
}
function stringFill(x, n) {
  var s = "";
  for (; ;) {
    if (n & 1) s += x;
    n >>= 1;
    if (n) x += x;
    else break;
  }
  return s;
}
function rnd(start, end) {
  return Math.floor(Math.random() * (++end - start) + start);
}
function createWord() {
  var selTheme = parseInt($("#theme").val(), 10);
  if (selTheme === LAST_THEME - 1) {
    selTheme = rnd(0, LAST_THEME - 2);
  }
  var arlen = collection[selTheme].length;
  return collection[selTheme][rnd(0, arlen - 1)];
}
function displayWord(longString) {
  var changedString = [];
  var loopLength = longString.length;
  for (var i = 0; i < loopLength; i++) {
    if (longString[i] !== " ") {
      changedString[i] = UN_CHAR;
    } else {
      changedString[i] = longString[i];
    }
  }
  changedString = changedString.join("");
  return changedString;
}
function setUp() {
  for (var t = 0; t < LAST_THEME; t++) {
    var appTXT = "<option value ='" + t + "'>" + THEMES[t] + "</option>";
    $("#theme").append(appTXT);
  }
  $("#theme option").last().prop("selected", true);
}
