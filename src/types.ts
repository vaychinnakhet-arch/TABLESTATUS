export interface Task {
  name: string;
  color: string;
  textColor: string;
  key?: string;
  shortName?: string;
}

export interface TaskDefinition {
  name: string;
  reportName: string;
  reportEmoji: string;
  title: string;
  type: 'progress' | 'multi-progress' | 'inspection';
  hasDetailedView?: boolean;
  tasks: Task[];
}

export interface CommonAreaTask {
  taskName: string;
}

export interface CommonAreaDefinition {
  locationName: string;
  tasks: CommonAreaTask[];
}

export interface UnitData {
  taskIndex?: number;
  progress?: number;
  // For multi-progress
  [key: `progress_${string}`]: number;
  // For inspection
  cmScore?: number;
  qcScore?: number;
  cmHasMajorDefect?: boolean;
  qcHasMajorDefect?: boolean;
  inInspection?: boolean;
}

export interface ProjectData {
  [category: string]: {
    [floor: number]: {
      [room: number]: UnitData;
    };
  } | any; // 'any' for commonArea structure flexibility
  commonArea?: {
    [locationKey: string]: {
      tasks: {
        [taskIndex: number]: {
          progress: {
            [floor: number]: number;
          };
        };
      };
    };
  };
}

export type ViewType = 'residential' | 'common' | 'qcSummary';
