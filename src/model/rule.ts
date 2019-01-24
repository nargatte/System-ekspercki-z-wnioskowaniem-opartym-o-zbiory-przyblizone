export class Rule {
    conditions: [number, number][];
    decision: number;

    support: number;
    accuracy: number;
    coverage: number;
    length: number;

    facts: number[];
    class: number;
}