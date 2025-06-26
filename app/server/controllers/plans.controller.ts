import { NextRequest, NextResponse } from "next/server";
import { getPlansUseCase } from "../use-cases/get-plans.use-case";

export async function plansController(request: NextRequest) {
  try {
    // Get client IP address
    const ip = request.headers.get('x-forwarded-for') || request.ip || '127.0.0.1';

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const regionId = searchParams.get('region') || searchParams.get('regionId') || undefined;
    const planId = searchParams.get('planId') || undefined;

    // Call use case
    const result = await getPlansUseCase(ip, regionId, planId);

    // Handle response based on result
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Region not found" ? 404 : 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error in plans controller:", error);
    return NextResponse.json(
      { error: "Error fetching plans" },
      { status: 500 }
    );
  }
}