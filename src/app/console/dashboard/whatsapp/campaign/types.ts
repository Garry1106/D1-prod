export interface Template {
  id: string;
  name: string;
  content: string;
}
export interface Group {
    id: string;
    name: string;
    contactCount: number;
    contacts?: { id: string; phone: string }[]; // Optional, depending on your use case
}

export interface Campaign {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  groupId: string;
  groupName: string;
  scheduledFor: string | null;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  createdAt: string;
}