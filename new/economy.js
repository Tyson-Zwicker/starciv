class Game {
  static types = ['food', 'ore', 'gas', 'tech', 'manu'];
  static {
    this.max = {};

  }
}
class Civ {
  mod = {
    food: 1,
    ore: 1,
    gas: 1,
    tech: 1,
    money: 1,
    making: 1,
    terraforming: 0.01,
    infrastructure: 0.05,
    workslot: 0.1
  };
  tech = 1;
}
//TODO:  Gates would be a StarSystem thing not a planet thing.
//TODO:  StarSystems should have a mod for gate building (some easier to connect with than others)
//Money "Stores" are a civ wide thing...
class Planet {
  mod = {
    food: 1,
    ore: 1,
    gas: 1,
    tech: 1,
    money: 1,
    making: 1,
    terraforming: 0.01,
    workslot: 0.1,
    popGrowth: 1
  };
  infra = {
    food: 1,
    ore: 1,
    gas: 1,
    tech: 1,
    money: 1
  };
  stores = {

  }
  population = 10;
  maxSlots = {
    food: this.population,
    ore: this.population,
    gas: this.population,
    money: this.population,
    tech: this.population
  }
}
class Buildable {
  static mod = { //the five basics are not included on this list.. they don't have this modifier..

    terraforming: {
      ore: 0.1,
      gas: 1,
      money: 1,
      base: 0.001
    },
    ore_infra: {
      ore: 1,
      gas: 1,
      money: 1,
      base: 0.001
    },
    gas_infra: {
      ore: 1,
      gas: 1,
      money: 1,
      base: 0.001
    },
    food_infra: {
      ore: 1,
      gas: 1,
      money: 1,
      base: 0.001
    },
    tech_infra: {
      ore: 1,
      gas: 1,
      money: 1,
      base: 0.001
    },
    money_infra: {
      ore: 1,
      gas: 1,
      money: 1,
      base: 0.001
    },
    workslot: {
      ore: 0.1,
      gas: 1,
      money: 1,
      base: 0.001
    },
    autoslot: {
      ore: 0.1,
      gas: 1,
      money: 1,
      base: 0.001
    },
    orbital: {
      ore: 0.1,
      gas: 1,
      money: 1,
      base: 0.001
    }
  }
}
class Work {
  doWork(type, workers, civ, planet, res) {
    prod = 0;
    let frm1 = ['food', 'ore', 'gas', 'tech', 'money'];
    let frm2 = ['food_infra', 'ore_infra', 'gas_infra', 'money_infra', 'tech_infra', 'terraforming', 'workerslot', 'autoslot'];
    let frm3 = ['orbital', 'probe', 'freighter', 'transport', 'gate', 'ship1', 'ship2', 'defence'];
    let civmod = 1;
    if (civ.mod[type] !== undefined) civmod = civ.mod[type]
    if (frm1.contains(type)) {//apply the first formula for production
      prod = workers * planet.mod[type] * planet.infra[type] * civ[type] * civ.tech;
    }
    else if (frm2.contains(type)) { //apply the 2nd formula for production
      prod = (res.ore * Buildable.mod[type].ore + res.gas * Buildable.mod[type].gas) * planet.mod[type] * Buildable.mod[type].base * civ.tech * racemod;
    }
    else if (frm3.contains(type)) { //..
      prod = (res.ore * Buildable.mod[type].ore + res.gas * Buildable.mod[type].gas + res.money * Buildable.mod[type].money) * Buildable.mod[type].base * civ.tech * racemod;
    } else {
      throw new Error(`Unknown: [${type}]`);
    }
    return prod;
  }
}