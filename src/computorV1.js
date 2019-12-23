"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var term_1 = require("./term");
var lib_1 = require("./lib");
var reducer_1 = require("./reducer");
var resolve_1 = require("./resolve");
function _formatReducedTab(termTabReduced) {
    var reducedFormString = "";
    for (var _i = 0, termTabReduced_1 = termTabReduced; _i < termTabReduced_1.length; _i++) {
        var term_2 = termTabReduced_1[_i];
        if (termTabReduced.indexOf(term_2) === 0) {
            if (term_2.termData.symbol === "+") {
                if (term_2.termData.hasUnknown) {
                    if (term_2.termData.value > 1)
                        reducedFormString = term_2.termData.value + " * X^" + term_2.termData.exposing;
                    else
                        reducedFormString = "X^" + term_2.termData.exposing;
                }
                else
                    reducedFormString = "" + term_2.termData.value;
            }
            else {
                if (term_2.termData.hasUnknown) {
                    if (term_2.termData.value > 1)
                        reducedFormString = term_2.termData.symbol + " " + term_2.termData.value + " * X^" + term_2.termData.exposing;
                    else
                        reducedFormString = term_2.termData.symbol + " X^" + term_2.termData.exposing;
                }
                else
                    reducedFormString = term_2.termData.symbol + " " + term_2.termData.value;
            }
        }
        else {
            if (term_2.termData.hasUnknown) {
                if (term_2.termData.value > 1)
                    reducedFormString += " " + term_2.termData.symbol + " " + term_2.termData.value + " * X^" + term_2.termData.exposing;
                else
                    reducedFormString += " " + term_2.termData.symbol + " X^" + term_2.termData.exposing;
            }
            else
                reducedFormString += " " + term_2.termData.symbol + " " + term_2.termData.value;
        }
    }
    reducedFormString += ' = 0';
    return reducedFormString;
}
function _getTermTab(argTab) {
    var termTab = [];
    var i = 0;
    if (!argTab[0])
        i++;
    while (argTab[i]) {
        var termData = new term_1.term();
        if (argTab[i] === "-" || argTab[i] === "+") {
            termData.termData.symbol = argTab[i];
            i++;
        }
        while (argTab[i] !== "-" && argTab[i] !== "+" && argTab[i]) {
            if (Number(argTab[i]))
                termData.termData.value = Number(argTab[i]);
            if (lib_1.containChar("^", argTab[i]) && argTab[i - 1] !== "*") {
                termData.termData.value = 1;
                termData.termData.hasUnknown = true;
                termData.termData.exposing = Number(lib_1.getExposing(argTab[i]));
                if (termData.termData.exposing === 0) {
                    termData.termData.exposing = undefined;
                    termData.termData.hasUnknown = false;
                }
            }
            else if (lib_1.containChar("^", argTab[i])) {
                termData.termData.hasUnknown = true;
                termData.termData.exposing = Number(lib_1.getExposing(argTab[i]));
                if (termData.termData.exposing === 0) {
                    termData.termData.exposing = undefined;
                    termData.termData.hasUnknown = false;
                }
            }
            else if (!lib_1.containChar("^", argTab[i]) && (lib_1.containChar("X", argTab[i]) || lib_1.containChar("x", argTab[i]))) {
                termData.termData.hasUnknown = true;
                termData.termData.exposing = 1;
                if (argTab[i - 1] !== "*")
                    termData.termData.value = 1;
            }
            i++;
        }
        if (!termData.termData.hasUnknown)
            termData.termData.exposing = undefined;
        if (termData.termData.value !== 0)
            termTab.push(termData);
    }
    return termTab;
}
function main() {
    if (process.argv.length !== 3)
        return console.log("Usage: node " + process.argv[1] + " \"[EQUATION BEGINING] = [EQUATION END]\"");
    var termTabBefore;
    var termTabAfter;
    try {
        var splittedEntry = process.argv[2].split(" = ");
        var afterSpaceArgTab = splittedEntry[1].split(" ");
        var beforeSpaceArgTab = splittedEntry[0].split(" ");
        termTabBefore = _getTermTab(beforeSpaceArgTab);
        termTabAfter = _getTermTab(afterSpaceArgTab);
    }
    catch (err) {
        return console.log("Unprocessable equation string. Please enter a valid equation.");
    }
    var termTabReduced = reducer_1.reducer(termTabBefore, termTabAfter);
    var degree = 0;
    var highestValue = 0;
    for (var _i = 0, termTabReduced_2 = termTabReduced; _i < termTabReduced_2.length; _i++) {
        var term_3 = termTabReduced_2[_i];
        if (term_3.termData.exposing && term_3.termData.exposing > degree)
            degree = term_3.termData.exposing;
        if (highestValue < term_3.termData.value)
            highestValue = term_3.termData.value;
    }
    if (highestValue === 0)
        return console.log("The equation is always equal to 0, all real numbers are solution.");
    console.log("Reduced form: " + _formatReducedTab(termTabReduced));
    if (degree === 0)
        return console.log("The equation has no unknown value, there is no possible solution.");
    console.log("Polynomial degree: " + degree);
    if (degree > 2)
        return console.log("The polynomial degree is stricly greater than 2, I can't solve.");
    if (degree === 2)
        return resolve_1.resolveDegree2(termTabReduced);
    else if (degree === 1)
        return resolve_1.resolveDegree1(termTabReduced);
}
;
main();
