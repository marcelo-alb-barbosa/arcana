import { getUserProfileController, updateUserProfileController } from '@/app/server/controllers/user-profile.controller';

export async function GET() {
  return getUserProfileController();
}

export async function PUT(req: Request) {
  return updateUserProfileController(req);
}
