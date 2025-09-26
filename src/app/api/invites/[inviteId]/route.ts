import { NextResponse } from "next/server";
import { InviteService } from "@/services/invites.service";
import { logger } from "@/lib/logger";

export async function PUT(
  req: Request,
  { params }: { params: { inviteId: string } }
) {
  try {
    const { inviteId } = params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    if (!['pending', 'sent', 'responded'].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'pending', 'sent', or 'responded'" },
        { status: 400 }
      );
    }

    logger.info(`Updating invite status: ${inviteId} to ${status}`);

    const invite = await InviteService.updateInviteStatus(parseInt(inviteId), status);

    return NextResponse.json(
      { message: "Invite status updated successfully", invite },
      { status: 200 }
    );
  } catch (error) {
    logger.error(`Error updating invite status: ${error}`);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { inviteId: string } }
) {
  try {
    const { inviteId } = params;

    logger.info(`Deleting invite: ${inviteId}`);

    await InviteService.deleteInvite(parseInt(inviteId));

    return NextResponse.json(
      { message: "Invite deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    logger.error(`Error deleting invite: ${error}`);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
