import { NextResponse } from "next/server";
import { registerUserUseCase } from "../use-cases/register-user.use-case";

export async function registerController(request: Request) {
  try {
    // Extract data from request
    const body = await request.json();
    const { email, password, name } = body;

    // Call use case
    const result = await registerUserUseCase({ 
      email, 
      password, 
      name
    });

    // Handle response based on result
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        user: result.user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no controller de registro:", error);
    return NextResponse.json(
      { error: "Erro ao processar o registro" },
      { status: 500 }
    );
  }
}
