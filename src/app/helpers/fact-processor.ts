import { Fact } from "src/model/fact";
import { Rule } from "src/model/Rule";

export class FactProcessor {

  static alphabet: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'w'];

  undiffClasses: number[][];
  decisionClasses: number[][];
  decisionToClass: number[];

  upApprox: number[][];
  downApprox: number[][];

  dDecision: number[][];
  dRelation: number[][];
  dClasses: number[][];
  dClassesForUndiffClasses: number[];

  matrix1: number[][][];
  matrix2: number[][][];
  matrix3: number[][][];

  core: number[];
  reducts: number[][];
  reduct: number[];

  rules: Rule[];
  reducedRules: Rule[];

  constructor(public facts: Fact[]) {
    if(facts == null || facts.length == 0)
      return;
      
    this.undiffClasses = this.getUndiffClasses();
    this.decisionClasses = this.getDecicionClasses();
    this.decisionToClass = this.getDecisionToClass();
    this.upApprox = this.getUpApprox();
    this.downApprox = this.getDownApprox();
    this.dDecision = this.getDDecision();
    this.dRelation = this.getDRelation();
    this.dClasses = this.getDClasses();
    this.dClassesForUndiffClasses = this.getDClassesForUndiffClasses();
    this.matrix1 = this.getMatrix1();
    this.matrix2 = this.getMatrix2();
    this.core = this.getCore();
    this.reducts = this.getReducts();
    this.reduct = this.getReduct();
    this.matrix3 = this.getMatrix3();
    this.rules = this.getRules();
    this.reducedRules = this.getReducedRules();
  }

  getUndiffClasses(): number[][] {
    return this.getClasses(this.facts, (f1, f2) => this.arrayCompare(f1.conditions, f2.conditions));
  }

  getDecicionClasses(): number[][] {
    return this.getClasses(this.facts, (f1, f2) => f1.decision == f2.decision);
  }

  getDecisionToClass(): number[] {
    return this.fold(this.decisionClasses, [], (s, o, i) => {
      s[this.facts[o[0]].decision] = i;
      return s;
    });
  }

  getUpApprox(): number[][] {
    return this.getApprox((dc, uc) => this.intersectionLengthForSortedArrays(dc, uc) != 0);
  }

  getDownApprox(): number[][] {
    return this.getApprox((dc, uc) => this.intersectionLengthForSortedArrays(dc, uc) == uc.length);
  }

  getDDecision(): number[][] {
    return this.undiffClasses.map(uc => this.removeRepetedFormSortedArray(uc.map(uco => this.facts[uco].decision).sort()));
  }

  getDRelation(): number[][] {
    return this.getClasses(this.dDecision, (a, b) => this.arrayCompare(a, b));
  }

  getDClasses(): number[][] {
    return this.dRelation.map(dd => this.iron(dd.map(ddd => this.undiffClasses[ddd])).sort());
  }

  getDClassesForUndiffClasses(): number[] {
    return this.fold<[number, number][], number[]>(this.dRelation, [], (s, o, i) => {
      o.forEach(cdn => {
        s.push([cdn, i]);
      });
      return s;
    }).sort((a, b) => a[0] - b[0]).map(p => p[1]);
  }

  getMatrix1(): number[][][] {
    return this.createMatrix(this.undiffClasses.length, (i, j) => this.diffRelation(this.getAttributeFormUndiffClasses(i), this.getAttributeFormUndiffClasses(j)));
  }

  getMatrix2(): number[][][] {
    return this.createMatrix(this.undiffClasses.length, (i, j) => this.dClassesForUndiffClasses[i] == this.dClassesForUndiffClasses[j] ? [] : this.matrix1[i][j]);
  }

  getAttributeFormUndiffClasses(classNumber: number): number[] {
    return this.facts[this.undiffClasses[classNumber][0]].conditions;
  }

  getCore(): number[] {
    return this.removeRepetedFormSortedArray(this.iron(this.iron(this.matrix1).filter(e => e.length == 1)).sort());
  }

  diffRelation(a1: number[], a2: number[]): number[] {
    return a1.map((o1, i) => o1 == a2[i] ? null : i).filter(n => n != null);
  }

  getReducts(): number[][] {
    return this.toDNF(this.iron(this.matrix2));
  }

  getReduct(): number[] {
    if(this.reducts[0].length == 0)
      return [];
    return this.reducts.reduce((r1, r2) => r1.length < r2.length ? r1 : r2);
  }

  getMatrix3(): number[][][] {
    return this.createMatrix(this.undiffClasses.length, (i, j) => this.intersectionForSortedArrays(this.matrix2[i][j], this.reduct));
  }

  getRules(): Rule[] {
    return this.iron(this.matrix3.map((row, rowi) => this.cartesianProductForRules(this.toDNF(row), this.dDecision[rowi], rowi)));
  }

  getReducedRules(): Rule[] {
    return this.getClasses(this.rules, (r1, r2) => r1.decision == r2.decision && this.arrayCompareAbstract(r1.conditions, r2.conditions, (o1, o2) => o1[0] == o2[0] && o1[1] == o2[1]))
    .map(ris => this.reduceRule(ris));
  }

  getCorrectRules(answer: number[]): Rule[] {
    return this.reducedRules.filter(r => this.ruleTest(answer, r));
  }

  getIndexOfBestRule(rules: Rule[]): number {
    return rules.map<[Rule, number]>((r, i) => [r, i]).reduce((p1, p2) => {
      if(p1[0].accuracy > p2[0].accuracy)
        return p1;
      if(p1[0].accuracy < p2[0].accuracy)
        return p2;
      if(p1[0].coverage > p2[0].coverage)
        return p1;
      if(p1[0].coverage < p2[0].coverage)
        return p2;
      if(p1[0].support > p2[0].support)
        return p1;
      if(p1[0].support < p2[0].support)
        return p2;
      if(p1[0].length > p2[0].length)
        return p1;
      if(p1[0].length < p2[0].length)
        return p2;
      return p1;
    })[1];
  }

  ruleTest(answer: number[], rule: Rule): boolean {
    return this.all(rule.conditions, o => answer[o[0]] == o[1]);
  }

  reduceRule(rulesIndexes: number[]): Rule {
    let r = new Rule();
    let fr = this.rules[rulesIndexes[0]];
    r.conditions = fr.conditions;
    r.decision = fr.decision;
    r.length = fr.length;
    r.support = 0;
    r.coverage = 0;
    r.accuracy = 0;
    r.facts = [];
    let accSum = 0;
    rulesIndexes.forEach(ri => {
      let nr = this.rules[ri];
      r.support += nr.support;
      r.coverage += nr.coverage;
      r.accuracy += nr.accuracy * nr.facts.length;
      accSum += nr.facts.length;
      r.facts.push(...nr.facts);
    });
    r.accuracy /= accSum;
    r.facts.sort();
    r.facts = this.removeRepetedFormSortedArray(r.facts);
    return r;
  }

  arrayCompare(a1: number[], a2: number[]): boolean {
    return this.arrayCompareAbstract(a1, a2, (o1, o2) => o1 == o2);
  }

  arrayCompareAbstract<T>(a1: T[], a2: T[], predicate: (t1: T, t2: T) => boolean): boolean {
    if (a1.length != a2.length)
      return false;
    for (let x = 0; x < a1.length; x++) {
      if (!predicate(a1[x], a2[x]))
        return false;
    }
    return true;
  }

  fold<Ts, Ta>(array: Ta[], initial: Ts, press: (state: Ts, item: Ta, index: number) => Ts): Ts {
    array.forEach((item, i) => {
      initial = press(initial, item, i);
    });
    return initial;
  }

  firstIndex<T>(array: T[], predicate: (item: T, index: number) => boolean): number {
    for (let x = 0; x < array.length; x++)
      if (predicate(array[x], x))
        return x;
    return null;
  }

  any<T>(array: T[], predicate: (item: T, index: number) => boolean): boolean {
    return this.firstIndex(array, (t, n) => predicate(t, n)) != null;
  }

  all<T>(array: T[], predicate: (item: T, index: number) => boolean): boolean {
    return !this.any(array, (t, n) => !predicate(t, n));
  }

  getClasses<T>(array: T[], predicate: (f1: T, f2: T) => boolean): number[][] {
    let updateClasses =
      (cs: number[][], item: number, place: number): number[][] => {
        if (place == null)
          cs.push([item]);
        else
          cs[place].push(item);
        return cs;
      }

    return this.fold<number[][], T>(array, [],
      (s, f, i) => updateClasses(s, i,
        this.firstIndex(s, item => predicate(f, array[item[0]]))
      )
    );
  }

  getApprox(predicate: (dc: number[], uc: number[]) => boolean): number[][] {
    return this.decisionClasses.map(dc =>
      this.iron(this.undiffClasses.filter(uc => predicate(dc, uc))
      ).sort()
    );
  }

  iron<T>(array: T[][]): T[] {
    return this.fold(array, [], (s, item) => { s.push(...item); return s; });
  }

  intersectionLengthForSortedArrays(arr1: number[], arr2: number[]): number {
    return this.intersectionForSortedArrays(arr1, arr2).length;
  }

  intersectionForSortedArrays(arr1: number[], arr2: number[]): number[] {
    let i1 = 0;
    let i2 = 0;
    let inter = [];
    while (i1 < arr1.length && i2 < arr2.length) {
      let o1 = arr1[i1];
      let o2 = arr2[i2];
      if (o1 == o2) {
        inter.push(o1);
        i1++;
        i2++;
      }
      else if (o1 < o2)
        i1++;
      else
        i2++;
    }
    return inter;
  }

  removeRepetedFormSortedArray(array: number[]): number[] {
    if(array.length == 0)
      return [];
    return this.fold(array.slice(1), [array[0]], (s, item) => {
      if(s[s.length-1] != item) s.push(item);
      return s;
    });
  }

  createMatrix(size: number, creator: (i: number, j: number) => number[]): number[][][] {
    let mat = [];
    for(let x=0;x<size;x++) {
      let row = [];
      for(let y = 0;y<size;y++) {
        row.push(creator(x, y));
      }
      mat.push(row);
    }
    return mat;
  }

  reductList(array: number[][]): number[][] {
    if(array.length == 0)
      return [];
    return this.fold(array.slice(1), [array[0]], (s, o) => {
      let intersectionLengths = s.map(r => this.intersectionLengthForSortedArrays(r, o));
      if(this.any(s, (item, index) => item.length == intersectionLengths[index]))
        return s;
      s = s.filter((item, index) => intersectionLengths[index] != o.length);
      s.push(o);
      return s;
    });
  }

  cartesianProduct(array: number[][]): number[][] {
    return this.fold(array, [[]], (s, o) => {
      let newS = [];
      s.forEach(ss => {
        o.forEach(oo => {
          let x = ss.slice();
          x.push(oo);
          newS.push(x);
        });
      });
      return newS;
    });
  }

  cartesianProductForRules(alpha: number[][], betha: number[], undiffClassIndex: number): Rule[] {
    let rs: Rule[] = [];
    alpha.forEach(alphaItem => {
      betha.forEach(bethaItem => {
        let r = new Rule();
        r.decision = bethaItem;
        let attriburesVals = this.facts[this.undiffClasses[undiffClassIndex][0]].conditions;
        r.conditions = alphaItem.map<[number, number]>(ai => [ai, attriburesVals[ai]]);
        let decisionClasseIndex = this.decisionToClass[bethaItem];
        r.support = this.intersectionLengthForSortedArrays(this.undiffClasses[undiffClassIndex], this.decisionClasses[decisionClasseIndex]);
        r.accuracy = r.support/this.undiffClasses[undiffClassIndex].length;
        r.coverage = r.support/this.decisionClasses[decisionClasseIndex].length;
        r.length = alphaItem.length;
        r.facts = this.undiffClasses[undiffClassIndex].slice();
        r.class = undiffClassIndex;
        rs.push(r);
      });
    });
    return rs;
  }

  toDNF(array: number[][]): number[][] {
    return this.cartesianProduct(this.reductList(array.filter(l => l.length > 0))).map(l => this.removeRepetedFormSortedArray(l.sort()));
  }
}