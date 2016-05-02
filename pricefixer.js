//Variables
var centsLimit = 90;
var currencies = ['$', '£', "GBP", '€', "EUR", '¥', '?'];
chosenCurrency = '$';
var decimalSeparator = ['.', ','];
var priceList = [];
//

/*var selSeparator = document.getElementById('choose-separator');
selSeparator.addEventListener("change", function() { console.log("boing" + this.value);});
console.log(selSeparator);*/

//Getting all text nodes
var treeWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
            var shouldAccept = false;
            for (var c of currencies) {
                if (node.nodeValue.indexOf(c) >= 0 && node.nodeValue.trim().length < 30) {
                    chosenCurrency = c;
                    shouldAccept = true;
                    console.log(chosenCurrency);
                    break; //Dont test other currencies if one was already found
                }
            }
            if (shouldAccept) return NodeFilter.FILTER_ACCEPT;
            else return NodeFilter.FILTER_SKIP;
        }
    },
    false
);


var nodeList = [];
while (treeWalker.nextNode())
    priceList.push(treeWalker.currentNode);

splitNodes();

function splitNodes() {
    //console.log(priceList);
    for (var p of priceList) {
        var skip = false;
        var price = "";
        var currency = "";
        var beforeText = p.nodeValue.split(chosenCurrency)[0];
        var afterText = p.nodeValue.split(chosenCurrency)[1];
        var price = afterText;
        //var ds = ',';

        //console.log(beforeText + ":" + afterText);

        if (!isNaN(afterText.trim().replace(',', '.'))) {
            price = afterText.trim();
            //console.log("indexof PONTO: " + price.indexOf('.'));
            //console.log("indexof VIRGULA: " + price.indexOf(','));
            currency = beforeText;
        } else if (!isNaN(beforeText.trim().replace(',', '.'))) {
            price = beforeText.trim();
            currency = afterText;
        } else {
            skip = true;
        }

        //Choose automatically which is the correct decimal separator
        ds = price.indexOf('.') > 0 ? '.' : ',';

        //console.log(currency + ":" + price);
        //console.log(ds);
        if (!skip) {

            var priceDollar = parseInt(price.split(ds)[0].trim());
            var priceCents = parseInt(price.split(ds)[1].trim());

            //console.log("before" + priceDollar + " " + priceCents);
            if (priceCents >= centsLimit) {

                //Create an element with the old price that will show up when the user hovers over the new price
                var old = document.createElement("div");
                var txt = document.createTextNode("Real price: " + p.nodeValue.trim());       // Create a text node
                old.appendChild(txt);
                p.parentNode.parentNode.appendChild(old);
                //old.style.position = "relative";
                //old.style.top = "10px";
                old.className = "old-price";
                old.style.display = "none";

                //Events that show/hide when the user enters/leaves the price element
                p.parentNode.addEventListener("mouseenter", function() {
                    var showOld = this.parentNode.getElementsByClassName("old-price")[0];
                    showOld.style.display = "inline";
                });
                p.parentNode.addEventListener("mouseleave", function() {
                    var showOld = this.parentNode.getElementsByClassName("old-price")[0];
                    showOld.style.display = "none";
                });

                priceDollar++;
                priceCents = 0;

                //Change displayed value
                p.nodeValue = currency + chosenCurrency + " " + priceDollar + ds + "00";
                p.parentNode.style.backgroundColor = "#F78181";
                p.parentNode.style.borderRadius = "0.4em";
                p.parentNode.style.padding = "2px";
                p.parentNode.style.border= "1px solid black";

            }
            //console.log("after" + priceDollar + " " + priceCents);

        }
    }

}