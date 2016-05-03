//Variables
var centsLimit = 89;
var currencies = ['$', '£', "GBP", '€', "EUR", '¥', "Rs.", '?'];
chosenCurrency = '$';
var decimalSeparator = ['.', ','];
var priceList = [];
//

/*var selSeparator = document.getElementById('choose-separator');
selSeparator.addEventListener("change", function() { console.log("boing" + this.value);});
console.log(selSeparator);*/

//Getting all text nodes
var countCurrencies = 0;
var treeWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
            var shouldAccept = false;
            for (var c of currencies) {
                if (node.nodeValue.indexOf(c) >= 0 && node.nodeValue.trim().length < 30) {  //If we found one entry with one of the currencies, continue
                    //If this currency is the same as the chosen one or different from the previous set currency but it's still in the beggining of the analysis, accept the new node
                    if(c == chosenCurrency || (c != chosenCurrency && countCurrencies < 2)) {
                        chosenCurrency = c;
                        countCurrencies++;
                        shouldAccept = true;
                        console.log(chosenCurrency);
                        break; //Dont test other currencies if one was already found
                    }
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

        //var price = afterText;

        //Remove spaces so it doesnt break the code after this part
        p.nodeValue = p.nodeValue.replace(/\s/g, "");

        //Divides the text into 2 parts
        var beforeText = p.nodeValue.split(chosenCurrency)[0];
        var afterText = p.nodeValue.split(chosenCurrency)[1];

        //Test which side of the text is the number part and gets the decimal separator, if it exists
        if(!isNaN(afterText.trim()[0])){
            var txtToTest = afterText.trim();
            if(txtToTest.indexOf(".") - txtToTest.indexOf(",") >= 0) {
                ds = '.'
                ts = ','
            }
            else {
                ds = ','
                ts = '.'
            }
            price = afterText.trim();
            currency = beforeText;
        }
        else if (!isNaN(beforeText.trim()[beforeText.length - 1])) {
            var txtToTest = beforeText.trim();
            if(txtToTest.indexOf(".") - txtToTest.indexOf(",") >= 0) {
                ds = '.'
                ts = ','
            }
            else {
                ds = ','
                ts = '.'
            }
            price = beforeText.trim();
            currency = afterText;
        }
        else {
            skip = true;
        }

        //Remove all occurences of the thousands separator from the price text
        var re = new RegExp('\\' + ts,"g");
        price = price.replace(re, "");

        if (!skip) {
            try {
                var priceDollar = parseInt(price.split(ds)[0].trim());
                var priceCents = parseInt(price.split(ds)[1].trim());
            }
            catch(e) {
                //break;
                console.log(this + " : " + e.message);
            }

            //console.log("before" + priceDollar + " " + priceCents);
            if (priceCents >= centsLimit || priceDollar % 10 == 9) {

                //Create an element with the old price that will show up when the user hovers over the new price
                var oldP = document.createElement("div");
                var txt = document.createTextNode(p.nodeValue.trim());
                txt.nodeValue = txt.nodeValue.replace(re, "");
                txt.nodeValue = addThouSeparators(txt.nodeValue);
                oldP.appendChild(txt);
                p.parentNode.appendChild(oldP);
                oldP.className = "prices";
                oldP.style.display = "none";

                priceDollar++;
                priceCents = 0;

                //Change displayed value

                p.nodeValue = currency + chosenCurrency + " " + priceDollar + ds + "00";
                p.nodeValue = addThouSeparators(p.nodeValue);

                //Add all thousand separators where needed
                function addThouSeparators(prc) {
                    //Take the ds position and calculates where to put the ts
                    var dsPosition = prc.indexOf(ds);
                    var firstSep = dsPosition - 3;
                    var amtSep = parseInt((priceDollar.toString().length - 1)/3);

                    for(var i = firstSep, n = 0; n < amtSep; i=i-3, n++)
                        prc = prc.slice(0, i) + ts + prc.slice(i);

                    return prc;
                }

                //Styling
                p.parentNode.style.backgroundColor = "#83AF9B";
                p.parentNode.style.borderRadius = "0.4em";
                p.parentNode.style.padding = "1px";
                p.parentNode.style.border= "1px solid black";

                //Create an element with the NEW price that will show up when the user hovers out of the new price
                var newP = document.createElement("div");
                txt = document.createTextNode(p.nodeValue.trim());
                newP.appendChild(txt);
                p.parentNode.appendChild(newP);
                newP.className = "prices";
                newP.style.display = "none";

                //Events that show/hide when the user enters/leaves the price element
                p.parentNode.addEventListener("mouseenter", function() {
                    var prices = this.getElementsByClassName("prices");
                    var n1 = prices[0].cloneNode(true);
                    var n2 = prices[1].cloneNode(true);

                    var showOld = this.getElementsByClassName("prices")[0];
                    this.innerText = showOld.innerText;
                    this.style.backgroundColor = "#FC9D9A";
                    this.appendChild(n1);
                    this.appendChild(n2);
                });
                p.parentNode.addEventListener("mouseleave", function() {
                    var prices = this.getElementsByClassName("prices");
                    var n1 = prices[0].cloneNode(true);
                    var n2 = prices[1].cloneNode(true);

                    var showNew = this.getElementsByClassName("prices")[1];
                    this.innerText = showNew.innerText;
                    this.style.backgroundColor = "#83AF9B";
                    this.appendChild(n1);
                    this.appendChild(n2);
                });

            }
            //console.log("after" + priceDollar + " " + priceCents);

        }
    }

}