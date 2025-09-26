import { NextResponse } from "next/server";
import { InviteService } from "@/services/invites.service";
import { logger } from "@/lib/logger";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const interviewId = searchParams.get("interviewId");

    if (!interviewId) {
      return NextResponse.json(
        { error: "Interview ID is required" },
        { status: 400 }
      );
    }

    logger.info(`Fetching invites for interview: ${interviewId}`);

    const invites = await InviteService.getAllInvites(interviewId);

    return NextResponse.json({ invites }, { status: 200 });
  } catch (error) {
    logger.error(`Error fetching invites: ${error}`);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { interview_id, name, email } = body;

    if (!interview_id || !name || !email) {
      return NextResponse.json(
        { error: "Interview ID, name, and email are required" },
        { status: 400 }
      );
    }

    // Check if invite already exists for this email and interview
    const existingInvite = await InviteService.getInviteByEmail(interview_id, email);
    if (existingInvite) {
      return NextResponse.json(
        { error: "An invite for this email already exists" },
        { status: 409 }
      );
    }

    logger.info(`Creating invite for interview: ${interview_id}`);

    const invite = await InviteService.createInvite({
      interview_id,
      name,
      email,
    });

    return NextResponse.json(
      { message: "Invite created successfully", invite },
      { status: 201 }
    );
  } catch (error) {
    logger.error(`Error creating invite: ${error}`);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
