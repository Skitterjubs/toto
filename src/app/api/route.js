import ArgosQuery from "@/services/argos/ArgosQuery";
import Career from "../../schemas/Career/Career.js";

export async function GET() {
  const res = await ArgosQuery.getCurrentPeriod();
  return Response.json(res);
}
