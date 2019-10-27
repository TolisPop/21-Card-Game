var cards = [];
var suits = ["clubs", "diams", "spades", "hearts"];
var numb = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var dealerCard = [];
var playerCard = [];


var cardCount = 0;
var mypounds = 1000;
var endplay = false;

var message = document.getElementById('message');
var output = document.getElementById('output');
var dealerHolder = document.getElementById('dealerHolder');
var playerHolder = document.getElementById('playerHolder');
var pValue = document.getElementById('pValue');
var dValue = document.getElementById('dValue');
var dollarValue = document.getElementById('pounds');

function Start() { //start game! 
  shuffleDeck(cards);
  dealNew(); //deal new deck of cards 
  document.getElementById('start').style.display = 'none';
  dollarValue.innerHTML = mypounds;
  
  function maxbet() { //max bet function
  document.getElementById('mybet').value = mypounds; //max bet take the value and set to my pounds
  message.innerHTML = "Bet changed to £" + mypounds;
}
}

document.getElementById('mybet').onchange = function() {
  if (this.value < 0) {
    this.value = 0;
  }
  if (this.value > mypounds) {
    this.value = mypounds;
  }
  message.innerHTML = "Bet changed to £" + this.value;
}


  for (n in numb) {
    //output.innerHTML += "<span style='color:" + bgcolor + "'>&" + suits[s] + ";" + numb[n] + "</span> ";
    var cardValue = (n > 9) ? 10 : parseInt(n) + 1;
    //var cardValue = 1;
	for (s in suits) {
  var suit = suits[s][0].toUpperCase();
  var bgcolor = (suit == "S" || suit == "C") ? "black" : "red";
    var card = {
      suit: suit,
      icon: suits[s],
      bgcolor: bgcolor,
      cardnum: numb[n],
      cardvalue: cardValue
    }
    cards.push(card);
  }
}



function dealNew() {
  dValue.innerHTML = "?";
  playerCard = [];
  dealerCard = [];
  dealerHolder.innerHTML = "";
  playerHolder.innerHTML = "";
  var betvalue = document.getElementById('mybet').value;
  mypounds = mypounds - betvalue;
  document.getElementById('pounds').innerHTML = mypounds;
  document.getElementById('myactions').style.display = 'block';
  message.innerHTML = "<br>Current bet is £" + betvalue;
  document.getElementById('mybet').disabled = true;
  document.getElementById('maxbet').disabled = true;
  deal();
  document.getElementById('btndeal').style.display = 'none';
}

function redeal() {
  cardCount++;
  if (cardCount > 40) {
    console.log("new");
    shuffleDeck(cards);
    cardCount = 0;
    message.innerHTML = "New Shuffle";
  }
}

function deal() {
  for (x = 0; x < 2; x++) {
    dealerCard.push(cards[cardCount]);
    dealerHolder.innerHTML += cardOutput(cardCount, x);
    if (x == 0) {
      dealerHolder.innerHTML += '<div id="cover" style="left:100px;"></div>';
    }
    redeal();
    playerCard.push(cards[cardCount]);
    playerHolder.innerHTML += cardOutput(cardCount, x);
    redeal();
  }
  var playervalue = checktotal(playerCard);
  if (playervalue == 21 && playerCard.length == 2) {
    playend();
  }
  pValue.innerHTML = playervalue;
}

function cardOutput(n, x) {
  var hpos = (x > 0) ? x * 59 + 100 : 100; //card position
  return '<div class="icard ' + cards[n].icon + '" style="left:' + hpos + 'px;">  <div class="top-card suit">' + cards[n].cardnum + '<br></div>  <div class="content-card suit"></div>  <div class="bottom-card suit">' + cards[n].cardnum +
    '<br></div> </div>';
}

function cardplay() {
  playerCard.push(cards[cardCount]);
  playerHolder.innerHTML += cardOutput(cardCount, (playerCard.length - 1)); //update in HTML
  redeal(); //update  cards
  var rValu = checktotal(playerCard); //checks value
  pValue.innerHTML = rValu;
  if (rValu > 21) { //check is its over 21
    message.innerHTML = "!!!";
    playend();
  }
}

function cardAction(a) {
  console.log(a);
  switch (a) { //switch statement
    case 'hit':
      cardplay(); // it adds new card 
      break;
    case 'hold':
      playend(); 
      break;
    case 'double': //takes the bet value and double tge value
      var betvalue = parseInt(document.getElementById('mybet').value);
      if ((mypounds - betvalue) < 0) {
        betvalue = betvalue + mypounds;
        mypounds = 0;
      } else {
        mypounds = mypounds - betvalue;
        betvalue = betvalue * 2;
      }
      document.getElementById('pounds').innerHTML = mypounds;
      document.getElementById('mybet').value = betvalue;
      cardplay(); // add new card 
      playend();
      break;
    default:
      console.log('done');
      playend(); 
  }
}



function playend() { //updates what it desplayed 
  endplay = true;
  document.getElementById('cover').style.display = 'none';
  document.getElementById('myactions').style.display = 'none';
  document.getElementById('btndeal').style.display = 'block';
  document.getElementById('mybet').disabled = false;
  document.getElementById('maxbet').disabled = false;
  message.innerHTML = "Game Over!<br>";
  var payoutJack = 1;
  var dealervalue = checktotal(dealerCard);
  dValue.innerHTML = dealervalue;

  while (dealervalue < 17) {
    dealerCard.push(cards[cardCount]);
    dealerHolder.innerHTML += cardOutput(cardCount, (dealerCard.length - 1));
    redeal();
	
    dealervalue = checktotal(dealerCard);
    dValue.innerHTML = dealervalue;
  }

  
  var playervalue = checktotal(playerCard); //final check who won the game 
  if (playervalue == 21 && playerCard.length == 2) {
    message.innerHTML = "Player 21";
    payoutJack = 1.5;
  }

  var betvalue = parseInt(document.getElementById('mybet').value) * payoutJack;
  if ((playervalue < 22 && dealervalue < playervalue) || (dealervalue > 21 && playervalue < 22)) {
    message.innerHTML += '<span style="color:#008000;">You won £' + betvalue + '</span>';
    mypounds = mypounds + (betvalue * 2);
  } else if (playervalue > 21) {
    message.innerHTML += '<span style="color:#c40000;"> You lost £ ' + betvalue + '</span>';
  } else if (playervalue == dealervalue) {
    message.innerHTML += '<span  style="color:#ffff99;">!!!</span>';
    mypounds = mypounds + betvalue;
  } else {
    message.innerHTML += '<span>You lost £' + betvalue + '</span>';
  }
  pValue.innerHTML = playervalue;
  dollarValue.innerHTML = mypounds;
}



function shuffleDeck(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function checktotal(arr) { //check total of array values 
  var rValue = 0;
  var aceAdjust = false;
  for (var i in arr) {
    if (arr[i].cardnum == 'A' && !aceAdjust) {
      aceAdjust = true;
      rValue = rValue + 10;
    }
    rValue = rValue + arr[i].cardvalue;
  }

  if (aceAdjust && rValue > 21) {
    rValue = rValue - 10;
  }
  return rValue;
}

function outputCard() {
  output.innerHTML += "<span style='color:" + cards[cardCount].bgcolor + "'>" + cards[cardCount].cardnum + "&" + cards[cardCount].icon + ";</span>  ";
}