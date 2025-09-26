import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Invite, CreateInviteData } from "@/types/invite";

const supabase = createClientComponentClient();

const getAllInvites = async (interviewId: string) => {
  try {
    const { data, error } = await supabase
      .from("invite")
      .select("*")
      .eq("interview_id", interviewId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching invites:", error);
      
return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllInvites:", error);
    
return [];
  }
};

const createInvite = async (inviteData: CreateInviteData) => {
  try {
    const { data, error } = await supabase
      .from("invite")
      .insert(inviteData)
      .select()
      .single();

    if (error) {
      console.error("Error creating invite:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in createInvite:", error);
    throw error;
  }
};

const updateInviteStatus = async (inviteId: number, status: string) => {
  try {
    const updateData: any = { status };
    
    if (status === 'sent') {
      updateData.sent_at = new Date().toISOString();
    } else if (status === 'responded') {
      updateData.responded_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("invite")
      .update(updateData)
      .eq("id", inviteId)
      .select()
      .single();

    if (error) {
      console.error("Error updating invite status:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in updateInviteStatus:", error);
    throw error;
  }
};

const deleteInvite = async (inviteId: number) => {
  try {
    const { error } = await supabase
      .from("invite")
      .delete()
      .eq("id", inviteId);

    if (error) {
      console.error("Error deleting invite:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteInvite:", error);
    throw error;
  }
};

const getInviteByEmail = async (interviewId: string, email: string) => {
  try {
    const { data, error } = await supabase
      .from("invite")
      .select("*")
      .eq("interview_id", interviewId)
      .eq("email", email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching invite by email:", error);
      
return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getInviteByEmail:", error);
    
return null;
  }
};

export const InviteService = {
  getAllInvites,
  createInvite,
  updateInviteStatus,
  deleteInvite,
  getInviteByEmail,
};
