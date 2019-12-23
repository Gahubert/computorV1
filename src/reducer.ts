import { getCopy } from "./lib";
import { term } from "./term";

function _sortNonExposing(termTab: term[]) {
    const termTabNonExposing: term[] =[]
    for (const term of termTab)
        if (!term.termData.hasUnknown)
            termTabNonExposing.push(term);
    const termTabSorted: term[] = termTabNonExposing.sort((t1, t2) => {
        if (t1.termData.symbol === t2.termData.symbol) {
            if (t1.termData.symbol === "+") {
                if (t1.termData.value > t2.termData.value)
                    return -1;
                if (t1.termData.value < t2.termData.value)
                    return 1;
            } else {
                if (t1.termData.value > t2.termData.value)
                    return 1;
                if (t1.termData.value < t2.termData.value)
                    return -1;
            }
        } else {
            if (t1.termData.symbol === "-")
                return 1;
            else if (t2.termData.symbol === "-")
                return -1;
        }
        return 0;
    });
    return termTabSorted;
}

function _sortExposing(termTab: term[]) {
    const termTabExposing: term[] = []
    for (const term of termTab)
        if (term.termData.exposing)
            termTabExposing.push(term);
    const termTabSorted: term[] = termTabExposing.sort((t1, t2) => {
        if (t1.termData.exposing && t2.termData.exposing && t1.termData.exposing > t2.termData.exposing)
            return -1;
        if (t1.termData.exposing && t2.termData.exposing && t1.termData.exposing < t2.termData.exposing)
            return 1;
        return 0;
    });
    return termTabSorted;
}

function _sumValues(term1: term, term2: term) {
    let sum: number = 0;
    let symbol: string = "";
    if (term1.termData.symbol === "+" && term2.termData.symbol === "+") {
        sum = term1.termData.value + term2.termData.value;
        symbol = "+";
    }
    else if (term1.termData.symbol === "+" && term2.termData.symbol === "-") {
        if (term1.termData.value < term2.termData.value) {
            sum = (term1.termData.value - term2.termData.value) * -1;
            symbol = "-"
        }
        else {
            sum = term1.termData.value - term2.termData.value;
            symbol = "+";
        }
    }
    else if (term1.termData.symbol === "-" && term2.termData.symbol === "+") {
        if (term2.termData.value < term1.termData.value) {
            sum = (term2.termData.value - term1.termData.value) * -1;
            symbol = "-"
        }
        else {
            sum = term2.termData.value - term1.termData.value;
            symbol = "+";
        }
    }
    else if (term1.termData.symbol === "-" && term2.termData.symbol === "-") {
        sum = term1.termData.value + term2.termData.value;
        symbol = "-";
    }
    return {sum, symbol};
}

function _summerizer(termTab: term[]) {
    const termTabCopy: term[] = getCopy(termTab);
    const deletedIds: number[] = [];
    const termTabReduced: term[] = [];
    for (const term of getCopy(termTab)) {
        const termTmp = term;
        if (term.termData.hasUnknown) {
            const toPop: term[] = [];
            for (const term2 of termTabCopy) {
                if (term2.termData.hasUnknown && term.termData._id !== term2.termData._id && term.termData.exposing === term2.termData.exposing) {
                    toPop.push(term2);
                    const sum = _sumValues(termTmp, term2).sum;
                    const symbol = _sumValues(termTmp, term2).symbol;
                    termTmp.termData.value = sum;
                    termTmp.termData.symbol = symbol;
                    deletedIds.push(term2.termData._id);
                }
            }
            for (const pop of toPop) {
                termTabCopy.splice(termTabCopy.indexOf(pop), 1);
            }
        } else {
            const toPop: term[] = [];
            for (const term2 of termTabCopy) {
                if (!term2.termData.hasUnknown && term.termData._id !== term2.termData._id) {
                    toPop.push(term2);
                    const sum = _sumValues(termTmp, term2).sum;
                    const symbol = _sumValues(termTmp, term2).symbol;
                    termTmp.termData.value = sum;
                    termTmp.termData.symbol = symbol;
                    deletedIds.push(term2.termData._id);
                }
            }
            for (const pop of toPop) {
                termTabCopy.splice(termTabCopy.indexOf(pop), 1);
            }
        }
        if (!deletedIds.find(i => i === termTmp.termData._id))
            termTabReduced.push(termTmp);
    }
    return termTabReduced;
}

export function reducer(termTabBefore: term[], termTabAfter: term[]) {
    for (const afterTerm of getCopy(termTabAfter)) {
        if (afterTerm.termData.symbol === "-")
            afterTerm.termData.symbol = "+";
        else
            afterTerm.termData.symbol = "-";
        termTabBefore.push(afterTerm);
    }
    const termTabReduced: term[] = _summerizer(termTabBefore);
    const termTabNonExposingSorted: term[] = _sortNonExposing(termTabReduced);
    const termTabExposingSorted: term[] = _sortExposing(termTabReduced);
    return termTabExposingSorted.concat(termTabNonExposingSorted);
}