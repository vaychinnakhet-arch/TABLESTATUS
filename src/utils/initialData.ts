import { CONFIG, TASK_DEFINITIONS, COMMON_AREA_DEFINITIONS } from '../constants';
import { ProjectData, UnitData } from '../types';

export function generateInitialDataObject(): ProjectData {
  const data: ProjectData = {};
  
  Object.keys(TASK_DEFINITIONS).forEach(catKey => {
    const catDef = TASK_DEFINITIONS[catKey];
    data[catKey] = {};
    CONFIG.FLOORS.forEach(floor => {
      data[catKey][floor] = {};
      const roomsOnThisFloor = (floor === 2) ? CONFIG.ROOMS_ON_FLOOR_2 : CONFIG.ROOMS_PER_FLOOR;
      for (let room = 1; room <= roomsOnThisFloor; room++) {
        data[catKey][floor][room] = {};
        const unitData: UnitData = data[catKey][floor][room];
        
        if (catDef.type === 'inspection') {
          unitData.cmScore = 0;
          unitData.qcScore = 0;
          unitData.cmHasMajorDefect = false;
          unitData.qcHasMajorDefect = false;
          unitData.inInspection = false;
        } else if (catDef.type === 'multi-progress') {
          catDef.tasks.forEach(task => {
            if (task.key) {
              unitData[`progress_${task.key}` as keyof UnitData] = 0;
            }
          });
        } else {
          unitData.taskIndex = 0;
          unitData.progress = 0;
        }
      }
    });
  });

  data.commonArea = {};
  Object.keys(COMMON_AREA_DEFINITIONS).forEach(locKey => {
    data.commonArea![locKey] = { tasks: {} } as any;
    const locDef = COMMON_AREA_DEFINITIONS[locKey];
    locDef.tasks.forEach((task, taskIndex) => {
      data.commonArea![locKey].tasks[taskIndex] = { progress: {} };
      CONFIG.COMMON_AREA_FLOORS.forEach(floor => {
        data.commonArea![locKey].tasks[taskIndex].progress[floor] = 0;
      });
    });
  });

  return data;
}
