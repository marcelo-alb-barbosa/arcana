import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { 
  updateUserAstrologyUseCase, 
  getUserAstrologyUseCase 
} from "../use-cases/user-astrology.use-case";

// Controller for handling POST requests to update user astrology information
export async function updateUserAstrologyController(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401 }
      );
    }

    // Get user ID from session
    const userId = session.user.id;

    // Parse request body
    const body = await req.json();

    // Call use case
    const result = await updateUserAstrologyUseCase(userId, body);

    // Handle response based on result
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("Error in user astrology controller:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao processar a requisição" },
      { status: 500 }
    );
  }
}

// Controller for handling GET requests to retrieve user astrology information
export async function getUserAstrologyController() {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401 }
      );
    }

    // Get user ID from session
    const userId = session.user.id;

    // Call use case
    const result = await getUserAstrologyUseCase(userId);

    // Handle response based on result
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Error in user astrology controller:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao processar a requisição" },
      { status: 500 }
    );
  }
}