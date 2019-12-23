import { term } from "./term";

export function getCopy(tab: term[]) {
    const copy : term[] = [];
    for (const obj of tab)
        copy.push(JSON.parse(JSON.stringify(obj)));
    return copy;
}

export function getExposing(str: string) {
    const charTab = str.split("^");
    return charTab[1] as any;
}

export function containChar(char: string, str: string) {
    let i = 0;
    while (str[i]) {
        if (str[i] === char)
            return true;
        i++;
    }
    return false;
}