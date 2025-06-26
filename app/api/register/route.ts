import { registerController } from "@/app/server/controllers/register.controller";

export async function POST(request: Request) {
  return registerController(request);
}
