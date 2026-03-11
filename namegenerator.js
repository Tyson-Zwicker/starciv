export default class NameGenerator {
  static {
    let prefixes = [
      "Aer", "Astra", "Cali", "Cyno", "Heli", "Lyra", "Nyx", "Solis", "Thala", "Zenith",
      "Brak", "Drak", "Ghor", "Krag", "Mort", "Skar", "Thrak", "Vark", "Zod", "Vox",
      "Ala", "El", "Fey", "Iri", "Lua", "Sha", "Vai", "Zea", "Ili", "Rae",
      "Al", "Ba", "Da", "Ha", "Ka", "Ach", "Ben", "Cor", "Erak", "Fom",
      "Cy", "Ex", "Hex", "Ion", "Neo", "Plas", "Quant", "Rho", "Syn", "Vect", "Nor"
    ];
    let medials = [
      "a", "o", "i", "u", "e", "an", "on", "in", "ar", "or", "al", "ol", "en", "un"
    ];
    let suffixes = [
      "ion", "is", "us", "os", "um", "ia", "on", "ax", "era", "id", "ium",
      "ga", "ko", "rok", "tash", "vuk", "zog", "dar", "gar", "tor", "vax",
      "elle", "lys", "nee", "ora", "une", "wyn", "ysa", "eth", "ina", "ari",
      "oid", "ex", "ite", "ode", "ic", "ent", "at", "est", "yne", "ane", "pus",
      "prime", "major", "minor", "core", "reach", "void", "gate", "puslse",
      "non", "el", "an", "be", "ca", "tis", "san"
    ];
    const names = new Set();
    const count = 1000;
    while (names.size < count) {
      let name = "";
      const dice = Math.random();
      // Type 1: Simple (Prefix + Suffix) - 40%
      if (dice < 0.4) {
        name = this.#pick(prefixes) + this.#pick(suffixes);
      }
      // Type 2: Complex (Prefix + Medial + Suffix) - 40%
      else if (dice < 0.8) {
        name = this.#pick(prefixes) + this.#pick(medials) + this.#pick(suffixes);
      }
      // Type 3: Technical (Prefix + Roman Numeral/Number) - 20%
      else {
        const numerals = ["Alpha", "Beta", "Gamma", "Delta", "Sigma", "Omicron", "Kappa", "Xhe", "Tao", "Phi", "Psi",];
        name = this.#pick(prefixes) + "-" + this.#pick(numerals) + " " + Math.floor(Math.random() * 99);
      }
      //Capitalize first letter
      names.add(name.charAt(0).toUpperCase() + name.slice(1));
    }
    this.names = Array.from(names);
  }
  static #pick(array) {
    return array[Math.floor(Math.random() * array.length)];
  }  
}
