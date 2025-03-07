class LocalSetting {
  static #sites = Object.freeze({
    antofagasta: "ANTOFAGASTA",
    coquimbo: "COQUIMBO",
  });
  static #roles = Object.freeze({
    master: "MASTER",
    student: "STUDENT",
  });
  static #genders = Object.freeze({
    masculino: "MASCULINO",
    femenino: "FEMENINO",
  });

  static getSites() {
    return LocalSetting.#sites;
  }
  static getSitesList() {
    return Object.values(LocalSetting.#sites);
  }

  static getRoles() {
    return LocalSetting.#roles;
  }
  static getRolesList() {
    return Object.values(LocalSetting.#roles);
  }

  static getGenders() {
    return LocalSetting.#genders;
  }
  static getGendersList() {
    return Object.values(LocalSetting.#genders);
  }
}

export default LocalSetting;
