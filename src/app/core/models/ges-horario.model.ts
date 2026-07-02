import { User } from './user.models';
import { Location } from './location.model';

export type GesHorarioStatus = 'scheduled' | 'completed' | 'cancelled';

export interface GesHorario {
  id: number;

  user_id: number;
  location_id: number;
  start_datetime: string | Date;
  end_datetime: string | Date;
  total_hours?: number | string;
  status: GesHorarioStatus;
  notes?: string | null;
  created_at?: string | Date;
  created_by?: number | null;
  updated_at?: string | Date | null;
  updated_by?: number | null;
  user?: User;
  location?: Location;
  created_user?: User;
  updated_user?: User;
}

export interface GesHorarioOverlapError {
  success: false;
  code: 'SCHEDULE_OVERLAP';
  message: string;
  data?: {
    horario?: GesHorario;
  };
}
