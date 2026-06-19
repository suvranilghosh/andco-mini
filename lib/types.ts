export interface Activity {
  at: string;
  text: string;
}

export interface Request {
  id: string;
  category: string;
  document_type: string;
  source: string;
  status: string;
  assignee: string;
  requested_at: string | null;
  due_at: string | null;
  updated_at: string;
  pages_received?: number | null;
  pages_expected?: number | null;
  activity?: Activity[];
  action_required?: string;
  reason?: string;
}

export interface CaseInfo {
  id: string;
  matter_name: string;
  client_name: string;
  matter_type: string;
  date_of_incident: string;
  assigned_paralegal: string;
  opened_at: string;
}

export interface CaseData {
  case: CaseInfo;
  requests: readonly Request[];
}
