import { term } from "./term";

function _calculateDiscriminator(termTab: term[]){
    let a: number = 0;
    let b: number = 0;
    let c: number = 0;
    for (const term of termTab) {
        if (term.termData.exposing && term.termData.exposing === 2) {
            if (term.termData.symbol === "-")
                a = term.termData.value * -1;
            else
                a = term.termData.value;
        }
        if (term.termData.exposing && term.termData.exposing === 1) {
            if (term.termData.symbol === "-")
                b = term.termData.value * -1;
            else
                b = term.termData.value;
        }
        if (!term.termData.hasUnknown) {
            if (term.termData.symbol === "-")
                c = term.termData.value * -1;
            else
                c = term.termData.value;
        }
    }
    const delta = (b) * (b) - (4 * (a) * (c));
    if (delta > 0)
        console.log("Discriminant is strictly positive, the two solutions are:");
    else if (delta === 0)
        console.log("Discriminant is equal to 0, the solution is:");
    else if (delta < 0)
        console.log("Discriminant is strictly negative, the two complexes solutions are:");
    return {delta, a, b, c};
}

export function resolveDegree2(termTab: term[]) {
    const result = _calculateDiscriminator(termTab);
    if (result.delta < 0) {
        const highSol1 = `${-(result.b)} + i * ${Math.sqrt(-(result.delta))}`;
        const highSol2 = `${-(result.b)} - i * ${Math.sqrt(-(result.delta))}`;
        const lowSol = (2 * result.a);
        console.log(`${highSol1} / ${lowSol}`);
        console.log(`${highSol2} / ${lowSol}`);
    }
    else if (result.delta > 0) {
        const highSol1 = (-(result.b) + Math.sqrt(result.delta));
        const lowSol = (2 * result.a);
        const highSol2 = (-(result.b) - Math.sqrt(result.delta));
        console.log(highSol1 / lowSol);
        console.log(highSol2 / lowSol);
    }
    else {
        let highSol = -(result.b);
        let lowSol = 2 * result.a;
        console.log(highSol / lowSol);
    }
}

export function resolveDegree1(termTab: term[]) {
    console.log("The solution is:");
    let a: number = 0;
    let b: number = 0;
    for (const term of termTab) {
        if (term.termData.exposing) {
            if (term.termData.symbol === "-")
                a = term.termData.value * -1;
            else
                a = term.termData.value;
        }
        if (!term.termData.hasUnknown) {
            if (term.termData.symbol === "-")
                b = term.termData.value * -1;
            else
                b = term.termData.value;
        }
    }
    console.log(-(b) / a);
}