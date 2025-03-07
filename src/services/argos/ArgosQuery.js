import Argos from "./Argos.js";
import Logger from "../../common/Logger.js";

class ArgosQuery {
  static #argos = new Argos();
  static #logger = new Logger({ source: "ArgosQuery" });

  static async getCurrentPeriod() {
    try {
      const result = await ArgosQuery.#argos.runQuery(
        "ADO_PROD",
        '{"Id":4325,"SQLName":"PeriodoActual"}',
        `[]`
      );
      return result.map((period) => ({
        code: period.CODPERIODO,
      }));
    } catch (err) {
      ArgosQuery.#logger.error(
        `Error executing getCurrentPeriod. Error: ${err.message}`
      );
      throw err;
    }
  }

  static async getPeriods() {
    try {
      const result = await ArgosQuery.#argos.runQuery(
        "ADO_PROD",
        '{"Id":4300,"SQLName":"vPeriodo"}',
        `[]`
      );
      return result.map((period) => ({
        code: period.CODIGO_PERIODO,
        description: period.PERIODO,
      }));
    } catch (err) {
      ArgosQuery.#logger.error(
        `Error executing getPeriods. Error: ${err.message}`
      );
      throw err;
    }
  }

  static async getCareers() {
    try {
      const result = await ArgosQuery.#argos.runQuery(
        "ADO_PROD",
        '{"Id":406,"SQLName":"mclAlumInscNrc"}',
        `[]`
      );

      return result.map((career) => ({
        site: career.SEDE,
        code: career.COD_CARRERA,
        name: career.CARRERA,
      }));
    } catch (err) {
      ArgosQuery.#logger.error(
        `Error executing getCareers. Error: ${err.message}`
      );
      throw err;
    }
  }

  static async getStudentCareers(rut) {
    try {
      const result = await ArgosQuery.#argos.runQuery(
        "ADO_PROD",
        '{"Id":2686,"SQLName":"DropDown2"}',
        `[{"Value":"${rut}","Type":"String","Name":"Edit1"}]`
      );

      return result.map((career) => ({
        careerCode: career.CODCARRERA,
        catalog: career.CATALOGO,
        studyPlan: career.PLANESTUDIO,
        lastUpdatePeriod: career.CODPERIODO,
        isActive: career.MOSTRAR.includes("- ACTIVO"),
      }));
    } catch (err) {
      ArgosQuery.#logger.error(
        `Error executing getStudentCareers. Error: ${err.message}`
      );
      throw err;
    }
  }

  static async getStudentsList(careerCode, periodCode) {
    try {
      const result = await ArgosQuery.#argos.runQuery(
        "ADO_PROD",
        '{"Id":100,"SQLName":"MultiColumn1"}',
        `[
          {"Value":"${careerCode}","Type":"WideString","Name":"ddlCarrera.CODCARRERA"},
          {"Value":"0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,W,X,Y,Z,Ñ","Type":"WideString","Name":"DDLESTADO.CODESTADO"},
          {"Value":"PR","Type":"String","Name":"ddlNivel.Codigo"},
          {"Value":"${periodCode}","Type":"WideString","Name":"ddlPeriodo.CODPERIODO"}
        ]`
      );

      return result.map((student) => ({
        rut: student.RUT,
        careerCode: student.COD_CARRERA,
        catalog: student.CATALOGO,
        names: student.NOMBRES,
        firstSurname: student.PRIMER_APELLIDO,
        secondSurname: student.SEGUNDO_APELLIDO,
        gender: student.SEXO,
        status: student.ESTADO,
        register: student.MATRICULA,
        affected: student.AFECTO,
        admissionPeriod: student.ADMISION,
        admissionType: student.TIPO_ADMISION,
        curricularLevel: student.NIVEL_CURRICULAR,
        phone: student.TELEFONO,
        institutionalEmail: student.EMAIL_INSTI,
        personalEmail: student.EMAIL_PERSONAL,
      }));
    } catch (err) {
      ArgosQuery.#logger.error(
        `Error executing getStudentsList. Error: ${err.message}`
      );
      throw err;
    }
  }

  static async getUserPidm(rut) {
    try {
      const result = await ArgosQuery.#argos.runQuery(
        "ADO_PROD",
        '{"Id":4985,"SQLName":"SqlPidm"}',
        `[{"Value":"${rut}","Type":"String","Name":"tbxRut"}]`
      );
      return result.map((user) => ({ pidm: user.PIDM }));
    } catch (err) {
      ArgosQuery.#logger.error(
        `Error executing getUserPidm. Error: ${err.message}`
      );
      throw err;
    }
  }
}

export default ArgosQuery;
