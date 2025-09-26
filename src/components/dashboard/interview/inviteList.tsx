"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UserPlus, Mail, Clock, CheckCircle, Trash2, Send, RefreshCw } from "lucide-react";
import { Invite } from "@/types/invite";
import InviteForm from "./inviteForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface InviteListProps {
  interviewId: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "sent":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "responded":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-3 w-3" />;
    case "sent":
      return <Send className="h-3 w-3" />;
    case "responded":
      return <CheckCircle className="h-3 w-3" />;
    default:
      return <Clock className="h-3 w-3" />;
  }
};

export default function InviteList({ interviewId }: InviteListProps) {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);

  const fetchInvites = useCallback(async () => {
    try {
      const response = await fetch(`/api/invites?interviewId=${interviewId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch invites");
      }

      setInvites(data.invites || []);
    } catch (error) {
      console.error("Error fetching invites:", error);
      toast.error("Failed to fetch invites");
    } finally {
      setIsLoading(false);
    }
  }, [interviewId]);

  useEffect(() => {
    fetchInvites();
  }, [interviewId, fetchInvites]);

  const handleInviteAdded = (newInvite: Invite) => {
    setInvites((prev) => [newInvite, ...prev]);
  };

  const handleDeleteInvite = async (inviteId: number) => {
    try {
      const response = await fetch(`/api/invites/${inviteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete invite");
      }

      setInvites((prev) => prev.filter((invite) => invite.id !== inviteId));
      toast.success("Invite deleted successfully");
    } catch (error) {
      console.error("Error deleting invite:", error);
      toast.error("Failed to delete invite");
    }
  };

  const handleUpdateStatus = async (inviteId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/invites/${inviteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update invite status");
      }

      setInvites((prev) =>
        prev.map((invite) =>
          invite.id === inviteId ? { ...invite, status: newStatus as any } : invite
        )
      );
      toast.success("Invite status updated successfully");
    } catch (error) {
      console.error("Error updating invite status:", error);
      toast.error("Failed to update invite status");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Invites
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading invites...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Invites ({invites.length})
        </CardTitle>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
            onClick={fetchInvites}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowInviteForm(true)}
          >
            <UserPlus className="h-4 w-4" />
            Add Invite
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showInviteForm && (
          <div className="mb-4 p-4 border rounded-lg bg-gray-50">
            <InviteForm
              interviewId={interviewId}
              onInviteAdded={handleInviteAdded}
              onClose={() => setShowInviteForm(false)}
            />
          </div>
        )}

        {invites.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No invites yet</p>
            <p className="text-sm">Add invites to track candidate responses</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">{invite.name}</p>
                      <p className="text-sm text-gray-600">{invite.email}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`flex items-center gap-1 ${getStatusColor(invite.status)}`}
                    >
                      {getStatusIcon(invite.status)}
                      {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Added {formatDate(invite.created_at.toString())}
                    {invite.sent_at && (
                      <span> • Sent {formatDate(invite.sent_at.toString())}</span>
                    )}
                    {invite.responded_at && (
                      <span> • Responded {formatDate(invite.responded_at.toString())}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {invite.status === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(invite.id, "sent")}
                    >
                      Mark as Sent
                    </Button>
                  )}
                  {invite.status === "sent" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(invite.id, "responded")}
                    >
                      Mark as Responded
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Invite</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the invite for {invite.name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleDeleteInvite(invite.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
