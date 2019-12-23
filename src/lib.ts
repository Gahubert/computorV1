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

export function sqrt(nb: number) {
    let root = 1;
	let sqrt = 0;
	while (root <= nb / 2) {
		sqrt = root * root;
		if (sqrt === nb) {
			return (root);
        }
        else if (sqrt <= nb && ((root + 0.000001) * (root + 0.000001)) >= nb) {
            return(root);
        }
		root = root + 0.000001;
	}
	return NaN;
}