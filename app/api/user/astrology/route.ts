import { NextRequest } from "next/server";
import { 
  updateUserAstrologyController, 
  getUserAstrologyController 
} from "@/app/server/controllers/user-astrology.controller";

export async function POST(req: NextRequest) {
  return updateUserAstrologyController(req);
}

export async function GET() {
  return getUserAstrologyController();
}
