import { term } from './term';
import { containChar, getExposing } from './lib';
import { reducer } from './reducer';
import { resolveDegree2, resolveDegree1 } from './resolve';

function _formatReducedTab(termTabReduced: term[]) {
    let reducedFormString: string = "";
    for (const term of termTabReduced) {
        if (termTabReduced.indexOf(term) === 0) {
            if (term.termData.symbol === "+") {
                if (term.termData.hasUnknown) {
                    if (term.termData.value > 1)
                        reducedFormString = `${term.termData.value} * X^${term.termData.exposing}`;
                    else
                        reducedFormString = `X^${term.termData.exposing}`;
                }
                else
                    reducedFormString = `${term.termData.value}`;
            }
            else {
                if (term.termData.hasUnknown) {
                    if (term.termData.value > 1)
                        reducedFormString = `${term.termData.symbol} ${term.termData.value} * X^${term.termData.exposing}`;
                    else
                        reducedFormString = `${term.termData.symbol} X^${term.termData.exposing}`;
                }
                else
                    reducedFormString = `${term.termData.symbol} ${term.termData.value}`;
            }
        }
        else {
            if (term.termData.hasUnknown) {
                if (term.termData.value > 1)
                    reducedFormString += ` ${term.termData.symbol} ${term.termData.value} * X^${term.termData.exposing}`;
                else
                    reducedFormString += ` ${term.termData.symbol} X^${term.termData.exposing}`;
            }
            else
                reducedFormString += ` ${term.termData.symbol} ${term.termData.value}`;
        }
    }
    reducedFormString += ' = 0';
    return reducedFormString;
}

function _getTermTab(argTab: string[]) {
    const termTab: term[] = [];
    let i = 0;
    if (!argTab[0])
        i++;
    while (argTab[i]) {
        let termData: term = new term();
        if (argTab[i] === "-" || argTab[i] === "+") {
            termData.termData.symbol = argTab[i];
            i++;
        }
        while (argTab[i] !== "-" && argTab[i] !== "+" && argTab[i]){
            if (Number(argTab[i]))
                termData.termData.value = Number(argTab[i]);
            if (containChar("^", argTab[i]) && argTab[i - 1] !== "*") {
                termData.termData.value = 1;
                termData.termData.hasUnknown = true;
                termData.termData.exposing = Number(getExposing(argTab[i]));
                if (termData.termData.exposing === 0) {
                    termData.termData.exposing = undefined;
                    termData.termData.hasUnknown = false;
                }
            }
            else if (containChar("^", argTab[i])) {
                termData.termData.hasUnknown = true;
                termData.termData.exposing = Number(getExposing(argTab[i]));
                if (termData.termData.exposing === 0) {
                    termData.termData.exposing = undefined;
                    termData.termData.hasUnknown = false;
                }
            }
            else if (!containChar("^", argTab[i]) && (containChar("X", argTab[i]) || containChar("x", argTab[i]))) {
                termData.termData.hasUnknown = true;
                termData.termData.exposing = 1;
                if (argTab[i - 1] !== "*")
                    termData.termData.value = 1;
            }
            i++;
        }
        if (!termData.termData.hasUnknown)
            termData.termData.exposing = undefined;
        termTab.push(termData);
    }
    return termTab;
}

function main() {
    const splittedEntry = process.argv[2].split(" = ");
    const afterSpaceArgTab = splittedEntry[1].split(" ")
    const beforeSpaceArgTab = splittedEntry[0].split(" ")
    const termTabBefore: term[] = _getTermTab(beforeSpaceArgTab);
    const termTabAfter: term[] = _getTermTab(afterSpaceArgTab);
    const termTabReduced = reducer(termTabBefore, termTabAfter);
    let degree = 0;
    let highestValue = 0;
    for (const term of termTabReduced) {
        if (term.termData.exposing && term.termData.exposing > degree)
            degree = term.termData.exposing;
        if (highestValue < term.termData.value)
            highestValue = term.termData.value;
    }
    if (highestValue === 0) {
        console.log(`The equation is always equal to 0, all real numbers are solution.`)
        return;
    }
    console.log(`Reduced form: ${_formatReducedTab(termTabReduced)}`);
    console.log(`Polynomial degree: ${degree}`);
    if (degree > 2) {
        console.log ("The polynomial degree is stricly greater than 2, I can't solve.");
        return;
    }
    if (degree === 2) {
        resolveDegree2(termTabReduced);
    } else if (degree === 1) {
        resolveDegree1(termTabReduced);
    }
};

main();