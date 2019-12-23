export interface termType {
    _id: number;
    hasUnknown: boolean;
    symbol: string;
    value: number;
    exposing?: number;
} 

export class term {
    termData: termType = {hasUnknown: false, symbol: "+", value: 0, exposing: 0, _id: new Date().getUTCMilliseconds() + Math.random()};

    getFormatedTerm() {
        if (this.termData.hasUnknown)
            return `${this.termData.symbol} ${this.termData.value} X^${this.termData.exposing}`;
        return `${this.termData.symbol} ${this.termData.value}`;
    }
}