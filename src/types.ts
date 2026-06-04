export interface User {
  id: string;
  name: string;
  role: string;
  pass: string;
  enabled: boolean;
  canInput: boolean;
  canSeeReports: boolean;
  canSeeGlobal: boolean;
  canSeeGlobalOverview?: boolean;
  canSeeDraftsView?: boolean;
  canEditGlobalOverview?: boolean;
  canEditOwnInputs?: boolean;
  canReassign?: boolean;
  phone: string;
  whatsapp: string;
}

export interface TimelineItem {
  id: string;
  type: string;
  time: string;
  by: string;
  text: string;
  link?: string;
  links?: string[];
}

export interface PersonalDetails {
  name: string;
  designation?: string;
  newDesignation?: string;
  gender?: string;
  referralPerson?: string;
  mobileNumber: string;
  whatsappNumber?: string;
  houseName?: string;
  place?: string;
  postOffice?: string;
  pinCode?: string;
  localBody?: string;
  otherLocalBody?: string;
  wardNumber?: string;
}

export interface Attachment {
  name: string;
  url: string;
  type: string;
}

export interface Task {
  id: string;
  types: string[];
  category: string;
  personalDetails: PersonalDetails;
  taskType?: string;
  isSelfMode?: boolean;
  subject: string;
  description?: string;
  assignedTo: string[];
  deadline: string;
  programDate?: string | null;
  status: string;
  priority?: string;
  officerStatuses: Record<string, string>;
  reassignedFrom?: Record<string, string>;
  isSignedByMLA?: boolean;
  attachment?: Attachment | null;
  attachments?: Attachment[];
  createdAt: string;
  createdBy: string;
  createdByUid: string;
  timeline: TimelineItem[];
  isCompletionLetter?: boolean;
  isReadByAdmin?: boolean;
}

export interface GlobalFilters {
  dateRange: string;
  status: string;
  applicationMode: string;
}

export interface BackupMeta {
  lastBackup: string | null;
  lastBackupType: string | null;
  lastImport: string | null;
  lastImportCount?: number;
}

export interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: ((val: string) => void) | null;
  confirmText: string;
  cancelText: string;
  isDanger: boolean;
  showInput: boolean;
  inputPlaceholder: string;
  inputValue: string;
}

// Global variable declarations
declare global {
  interface Window {
    __firebase_config?: string;
    __app_id?: string;
    __initial_auth_token?: string;
    define?: any;
    html2pdf?: any;
  }
}
