export interface Invite {
  id: number;
  created_at: Date;
  interview_id: string;
  name: string;
  email: string;
  status: 'pending' | 'sent' | 'responded';
  sent_at?: Date;
  responded_at?: Date;
}

export interface CreateInviteData {
  interview_id: string;
  name: string;
  email: string;
}
