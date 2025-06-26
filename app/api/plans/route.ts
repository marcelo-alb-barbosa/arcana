import { NextRequest } from "next/server";
import { plansController } from "@/app/server/controllers/plans.controller";

export async function GET(request: NextRequest) {
  return plansController(request);
}
