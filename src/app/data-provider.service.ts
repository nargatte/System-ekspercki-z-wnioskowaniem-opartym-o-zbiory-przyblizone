import { Injectable } from '@angular/core';
import { Attribute } from 'src/model/attribute';
import { System } from 'src/model/system';
import { Fact } from 'src/model/fact';
import { FactProcessor } from './helpers/fact-processor';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  constructor() {
    if(localStorage.getItem('decisionRelation') != undefined)
      this.load();
    else 
    {
      this.feedByExampleData();
      this.save();
    }
   }

  attributes: Attribute[] = [];
  systems: System[] = [];

  getAttributeId(attribute: Attribute): number {
    return this.attributes.indexOf(attribute);
  }

  getSystemId(system: System): number {
    return this.systems.indexOf(system);
  }

  deleteAttribute(attribute: Attribute): void {
    this.attributes.splice(this.getAttributeId(attribute), 1);
    this.save();
  }

  addAttribute(attribute: Attribute): void {
    this.attributes.push(attribute);
    this.save();
  }

  replaceAttribute(attribute: Attribute, index: number): void {
    this.relinkAttribute(this.attributes[index], attribute);
    this.attributes[index] = attribute;
    this.save();
  }

  deleteSystem(system: System): void {
    this.unlinkSystem(system);
    this.systems.splice(this.getSystemId(system), 1);
    this.save();
  }

  addSystem(system: System): void {
    this.linkSystem(system);
    this.systems.push(system);
    this.save();
  }

  replaceSystem(system: System, index: number): void {
    this.unlinkSystem(this.systems[index]);
    this.linkSystem(system);
    this.systems[index] = system;
    this.save();
  }

  unlinkSystem(system: System): void {
    system.conditionAttributes.forEach(attribute => {
      attribute.systems.splice(attribute.systems.indexOf(system), 1);
    });
    system.decisionAttribute.systems.splice(system.decisionAttribute.systems.indexOf(system), 1);
  }

  linkSystem(system: System): void {
    system.conditionAttributes.forEach(attribute => {
      attribute.systems.push(system);
    });
    system.decisionAttribute.systems.push(system);
  }

  relinkAttribute(attributeSource: Attribute, attributeDestination: Attribute): void {
    attributeSource.systems.forEach(system => {
      let i = system.conditionAttributes.indexOf(attributeSource);
      if(i == -1)
        system.decisionAttribute = attributeDestination;
      else
        system.conditionAttributes[i] = attributeDestination;
    });
  }

  save() {
    let decisionRelation: number[] = [];
    let conditionRelation: number[][] = [];
    this.systems.forEach(system => {
      decisionRelation.push(this.attributes.indexOf(system.decisionAttribute));
      conditionRelation.push(system.conditionAttributes.map(ca => this.attributes.indexOf(ca)));

      system.decisionAttribute = null;
      system.conditionAttributes = [];
    });

    this.attributes.forEach(attribute => {
      attribute.systems = [];
    });

    localStorage.setItem('attributes', JSON.stringify(this.attributes));
    localStorage.setItem('systems', JSON.stringify(this.systems));
    localStorage.setItem('decisionRelation', JSON.stringify(decisionRelation));
    localStorage.setItem('conditionRelation', JSON.stringify(conditionRelation));

    this.systems.forEach((system, i) => {
      system.decisionAttribute = this.attributes[decisionRelation[i]];
      system.conditionAttributes = conditionRelation[i].map(ci => this.attributes[ci]);

      this.linkSystem(system);
    });
  }

  load() {
    this.systems = JSON.parse(localStorage.getItem('systems'));
    this.attributes = JSON.parse(localStorage.getItem('attributes'));
    let decisionRelation = JSON.parse(localStorage.getItem('decisionRelation'));
    let conditionRelation = JSON.parse(localStorage.getItem('conditionRelation'));

    this.systems.forEach((system, i) => {
      system.decisionAttribute = this.attributes[decisionRelation[i]];
      system.conditionAttributes = conditionRelation[i].map(ci => this.attributes[ci]);

      this.linkSystem(system);
    });
  }

  feedByExampleData() {    
    let a = new Attribute();
    a.name = "Opady";
    a.question = "Co coś dziś padało?";
    a.values = ["Brak opadów", "Deszcz", "Snieg", "Grad"];
    this.attributes.push(a);
    a = new Attribute();
    a.name = "Zachmurzenie";
    a.question = "Jaki jest stopień pokrycia nieba przez chmury?";
    a.values = ["Bezchmurnie", "Umiarkowane", "Niebo niewidoczne"];
    this.attributes.push(a);
    a = new Attribute();
    a.name = "Ciśnienie";
    a.question = "Jak zmieniało się ciśnienie w ciągu doby?";
    a.values = ["Malało", "Stało", "Rosło"];
    this.attributes.push(a);
    a = new Attribute();
    a.name = "Temperatura";
    a.question = "Jaka była dziś temperatura (w stopniach Celsjusza)?";
    a.values = ["Poniżej 0", "Mędzy 0 a 10", "Powyżej 10"];
    this.attributes.push(a);
    a = new Attribute();
    a.name = "Klimat";
    a.question = "W jakiej strefie klimatycznej mieszkasz?";
    a.values = ["Równikowy", "Zwrotnikowy", "Umiarkowany", "Okołobiegunowy"];
    this.attributes.push(a);
    a = new Attribute();
    a.name = "Czas";
    a.question = "Jaka jest pora dnia?";
    a.values = ["Poranek", "Południe", "Wieczór", "Noc"];
    this.attributes.push(a);
    a = new Attribute();
    a.name = "Droga";
    a.question = "Jaka jest sytuacja na drodze?";
    a.values = ["Bezpiecznie", "Niebezpiecznie", "Bardzo niebezpiecznie"];
    this.attributes.push(a);
    
    let s = new System();
    s.name = "Strefy klimatyczne";
    s.decisionAttribute = this.attributes[4];
    s.conditionAttributes = [this.attributes[0], this.attributes[1], this.attributes[2], this.attributes[3]];
    s.facts = [];

    let f = new Fact();
    f.conditions = [0, 0, 1, 2];
    f.decision = 0;
    s.facts.push(f);

    f = new Fact();
    f.conditions = [1, 0, 1, 2];
    f.decision = 1;
    s.facts.push(f);

    
    f = new Fact();
    f.conditions = [0, 2, 1, 1];
    f.decision = 2;
    s.facts.push(f);

    
    f = new Fact();
    f.conditions = [2, 1, 1, 0];
    f.decision = 3;
    s.facts.push(f);

    
    f = new Fact();
    f.conditions = [3, 2, 1, 0];
    f.decision = 2;
    s.facts.push(f);

    
    f = new Fact();
    f.conditions = [2, 2, 1, 0];
    f.decision = 2;
    s.facts.push(f);

    
    f = new Fact();
    f.conditions = [1, 1, 1, 2];
    f.decision = 0;
    s.facts.push(f);

    f = new Fact();
    f.conditions = [3, 2, 1, 0];
    f.decision = 3;
    s.facts.push(f);

    s.questionCounter = new FactProcessor(s.facts).reduct.length;
    this.addSystem(s);

    s = new System();
    s.name = "Sytuacja na drodze";
    s.decisionAttribute = this.attributes[6];
    s.conditionAttributes = [this.attributes[0], this.attributes[3], this.attributes[5]];
    s.facts = [];

    f = new Fact();
    f.conditions = [0, 0, 0];
    f.decision = 0;
    s.facts.push(f);

    f = new Fact();
    f.conditions = [1, 0, 1];
    f.decision = 2;
    s.facts.push(f);

    f = new Fact();
    f.conditions = [1, 1, 1];
    f.decision = 1;
    s.facts.push(f);

    f = new Fact();
    f.conditions = [3, 1, 1];
    f.decision = 2;
    s.facts.push(f);

    f = new Fact();
    f.conditions = [2, 0, 2];
    f.decision = 1;
    s.facts.push(f);

    f = new Fact();
    f.conditions = [3, 0, 3];
    f.decision = 2;
    s.facts.push(f);

    f = new Fact();
    f.conditions = [1, 2, 2];
    f.decision = 0;
    s.facts.push(f);

    f = new Fact();
    f.conditions = [0, 2, 1];
    f.decision = 0;
    s.facts.push(f);

    f = new Fact();
    f.conditions = [0, 2, 1];
    f.decision = 1;
    s.facts.push(f);

    s.questionCounter = new FactProcessor(s.facts).reduct.length;
    this.addSystem(s);
  }

}
