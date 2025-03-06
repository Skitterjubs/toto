import ArgosQuery from "@/services/argos/ArgosQuery";
import Career from "../../schemas/Career/Career.js";

export async function GET() {
  const careers = await Career.distinct("code");
  const res = [];

  for (const career of careers) {
    const students = await ArgosQuery.getStudentsList(career, "202510");
    res.push(...students);
  }

  return Response.json(res);
}
