import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getUserProfileUseCase } from '../use-cases/user-profile.use-case';
import { updateProfileUseCase } from '../use-cases/update-profile.use-case';

// Controller for handling GET requests to retrieve user profile information
export async function getUserProfileController() {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    console.log("API Session:", JSON.stringify(session, null, 2));

    if (!session?.user?.id) {
      console.log("No user ID in session");
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Get user ID from session
    const userId = session.user.id;

    // Call use case
    const result = await getUserProfileUseCase(userId);

    // Handle response based on result
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Usuário não encontrado" ? 404 : 500 }
      );
    }

    console.log("API response data:", JSON.stringify(result.data, null, 2));

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// Controller for handling PUT requests to update user profile information
export async function updateUserProfileController(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
    }

    // Get user ID from session
    const userId = session.user.id;

    // Parse request body
    const body = await req.json();

    // Call use case
    const result = await updateProfileUseCase(userId, body);

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
    console.error('Erro ao atualizar perfil do usuário:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
