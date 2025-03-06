import Argos from "./Argos.js";
import Logger from "../../common/Logger.js";

class ArgosQuery {
  static #argos = new Argos();
  static #logger = new Logger({ source: "ArgosQuery" });

  static async getStudentsList(careerCode, periodCode) {
    try {
      const result = await ArgosQuery.#argos.runQuery(
        "ADO_PROD",
        '{"Id":100,"SQLName":"MultiColumn1"}',
        `[
          {"Value":"${careerCode}","Type":"WideString","Name":"ddlCarrera.CODCARRERA"},
          {"Value":"0,1,2,3,4,5,6,7,9,A,C,D,F,H,I,J,M,N,P,Q,S,T,W,X,Y,Ñ","Type":"WideString","Name":"DDLESTADO.CODESTADO"},
          {"Value":"PR","Type":"String","Name":"ddlNivel.Codigo"},
          {"Value":"${periodCode}","Type":"WideString","Name":"ddlPeriodo.CODPERIODO"}
        ]`
      );

      return result.map((student) => ({
        fullName: [
          student.NOMBRES,
          student.PRIMER_APELLIDO,
          student.SEGUNDO_APELLIDO,
        ]
          .filter(Boolean)
          .join(" "),
        rut: student.RUT,
        careerCode: student.COD_CARRERA,
        status: student.ESTADO,
        register: student.MATRICULA,
      }));
    } catch (err) {
      ArgosQuery.#logger.error(
        `Error executing getStudentsList. Error: ${err.message}`
      );
      throw err;
    }
  }
}

export default ArgosQuery;
