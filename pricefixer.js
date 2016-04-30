//Variables
var priceLimit = 0.80;
var currencies = ['$', '£', '€', "EUR", '¥', '?'];
var chosenCurrency = '$';
var decimalSeparator = '.';
var priceList = [];
//

//Getting all text nodes
var treeWalker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_TEXT, {
    acceptNode: function(node) {
      return NodeFilter.FILTER_ACCEPT;
    }
  },
  false
);

var nodeList = [];
while (treeWalker.nextNode())
  nodeList.push(treeWalker.currentNode);
//

//Push all text nodes with the money symbol (eg: $) to an array
for (var n of nodeList) {
    //console.log(n.nodeValue.indexOf(chosenCurrency));
    //console.log(n);
  if (n.nodeValue.indexOf(chosenCurrency) >= 0 && n.length < 100) {
    priceList.push(n);
  }
}
console.log(priceList);

for (var p of priceList)
{
  var price = "";
  var currency = "";
  var beforeText = p.nodeValue.split(chosenCurrency)[0];
  var afterText = p.nodeValue.split(chosenCurrency)[1];
  price = afterText;

if(!isNaN(afterText.trim()))
{
    price = afterText.trim();
    currency = beforeText;
}
else if(!isNaN(beforeText.trim()))
{
    price = beforeText.trim();
    currency = afterText;
}

console.log(price);
console.log(currency);

  var priceDollar = parseFloat(price.split(decimalSeparator)[0].trim());
  var priceCents = parseFloat(price.split(decimalSeparator)[1].trim());
  //console.log("before" + priceDollar + " " + priceCents);
  if(priceCents >= priceLimit)
    {
      priceDollar++;
      priceCents = 0;
    }
  console.log("after" + priceDollar + " " + priceCents);
  p.nodeValue = currency + chosenCurrency + parseFloat(priceDollar + decimalSeparator + priceCents).toFixed(2);

}