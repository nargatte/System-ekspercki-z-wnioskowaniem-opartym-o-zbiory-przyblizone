import { Attribute } from "./attribute";
import { Fact } from "./fact";

export class System {
    name: string = "";
    decisionAttribute: Attribute;
    conditionAttributes: Attribute[] = [];
    facts: Fact[] = [];
    questionCounter: number = 0;
}