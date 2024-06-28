import { GraphGroups, WeekDay } from '../app.types';

export interface GraphState {
  isToday: boolean;
  selectedWeekDay: WeekDay | null;
  selectedGroup: GraphGroups;
}
