import { NextResponse } from "next/server";
import { InviteService } from "@/services/invites.service";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { interviewId, email } = body;

    if (!interviewId || !email) {
      return NextResponse.json(
        { error: "Interview ID and email are required" },
        { status: 400 }
      );
    }

    logger.info(`Checking invite for interview: ${interviewId}, email: ${email}`);

    // Check if invite exists for this email and interview
    const invite = await InviteService.getInviteByEmail(interviewId, email);

    if (!invite) {
      return NextResponse.json(
        { error: "No invite found for this email address" },
        { status: 404 }
      );
    }

    // Update invite status to 'responded' when someone joins
    if (invite.status !== 'responded') {
      await InviteService.updateInviteStatus(invite.id, 'responded');
      logger.info(`Updated invite status to 'responded' for invite ID: ${invite.id}`);
    }

    return NextResponse.json(
      { 
        message: "Invite found and status updated", 
        invite: {
          ...invite,
          status: 'responded'
        }
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error(`Error checking invite: ${error}`);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
