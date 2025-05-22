import { IconType } from 'react-icons';
import { FiUploadCloud, FiEdit, FiCpu, FiCheckCircle, FiLoader } from 'react-icons/fi';
// Assuming you'll have a GoogleDocsIcon or similar later
// For now, FiFileText can be a placeholder for Google Docs step or we can use FiUploadCloud again

export enum StepStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ERROR = 'error', // For later use
}

export interface ProcessingStep {
  key: string;
  label: string;
  icon: IconType;
  activeIcon?: IconType; // e.g., FiLoader for the active step
  completedIcon?: IconType;
  status: StepStatus;
}

export const initialProcessingSteps: ProcessingStep[] = [
  {
    key: 'audio_prep',
    label: 'Preparing audio file...',
    icon: FiUploadCloud,
    activeIcon: FiLoader,
    completedIcon: FiCheckCircle,
    status: StepStatus.PENDING,
  },
  {
    key: 'transcription',
    label: 'Transcribing audio with Whisper...',
    icon: FiEdit,
    activeIcon: FiLoader,
    completedIcon: FiCheckCircle,
    status: StepStatus.PENDING,
  },
  {
    key: 'note_generation',
    label: 'Generating structured notes with AI...',
    icon: FiCpu,
    activeIcon: FiLoader,
    completedIcon: FiCheckCircle,
    status: StepStatus.PENDING,
  },
  {
    key: 'doc_saving',
    label: 'Saving to Google Docs...',
    icon: FiUploadCloud, // Placeholder, ideally a Google Docs icon
    activeIcon: FiLoader,
    completedIcon: FiCheckCircle,
    status: StepStatus.PENDING,
  },
]; 