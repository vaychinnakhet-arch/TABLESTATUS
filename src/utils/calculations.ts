import { CONFIG, TASK_DEFINITIONS, COMMON_AREA_DEFINITIONS } from '../constants';
import { ProjectData } from '../types';

export function calculateProjectSummary(projectData: ProjectData) {
  if (!projectData || Object.keys(projectData).length === 0) {
    return { overallProgress: 0, completedUnits: 0, qcPassRate: 0 };
  }

  let totalProgressPoints = 0;
  let totalMaxPoints = 0;

  // 1. Calculate Residential Progress
  Object.keys(TASK_DEFINITIONS).forEach(catKey => {
    const catDef = TASK_DEFINITIONS[catKey];
    CONFIG.FLOORS.forEach(floor => {
      const roomsOnThisFloor = (floor === 2) ? CONFIG.ROOMS_ON_FLOOR_2 : CONFIG.ROOMS_PER_FLOOR;
      for (let room = 1; room <= roomsOnThisFloor; room++) {
        const unitData = projectData[catKey]?.[floor]?.[room] || {};
        if (catDef.type === 'progress') {
          const taskProgress = (unitData.progress || 0) / catDef.tasks.length;
          const completedTasksProgress = (unitData.taskIndex || 0) * (100 / catDef.tasks.length);
          totalProgressPoints += taskProgress + completedTasksProgress;
          totalMaxPoints += 100;
        } else if (catDef.type === 'multi-progress') {
          let subTaskTotal = 0;
          catDef.tasks.forEach(task => {
            subTaskTotal += (unitData[`progress_${task.key}`] || 0);
          });
          totalProgressPoints += subTaskTotal / catDef.tasks.length;
          totalMaxPoints += 100;
        } else if (catDef.type === 'inspection') {
          const score = unitData.qcScore > 0 ? unitData.qcScore : (unitData.cmScore || 0);
          totalProgressPoints += score;
          totalMaxPoints += 100;
        }
      }
    });
  });

  // 2. Calculate Common Area Progress
  Object.keys(COMMON_AREA_DEFINITIONS).forEach(locKey => {
    const locDef = COMMON_AREA_DEFINITIONS[locKey];
    locDef.tasks.forEach((task, taskIndex) => {
      CONFIG.COMMON_AREA_FLOORS.forEach(floor => {
        totalProgressPoints += projectData.commonArea?.[locKey]?.tasks?.[taskIndex]?.progress?.[floor] || 0;
        totalMaxPoints += 100;
      });
    });
  });

  const overallProgress = totalMaxPoints > 0 ? (totalProgressPoints / totalMaxPoints) * 100 : 0;

  // 3. Calculate Completed Units (based on End Product QC pass)
  let completedUnits = 0;
  if (projectData.endProduct) {
    CONFIG.FLOORS.forEach(floor => {
      const roomsOnThisFloor = (floor === 2) ? CONFIG.ROOMS_ON_FLOOR_2 : CONFIG.ROOMS_PER_FLOOR;
      for (let room = 1; room <= roomsOnThisFloor; room++) {
        const unitData = projectData.endProduct[floor]?.[room] || {};
        if (unitData.qcScore >= 85) {
          completedUnits++;
        }
      }
    });
  }

  // 4. Calculate QC Pass Rate
  let totalQcChecks = 0;
  let totalQcPasses = 0;
  ['wetWork', 'endProduct'].forEach(catKey => {
    if (!projectData[catKey]) return;
    CONFIG.FLOORS.forEach(floor => {
      const roomsOnThisFloor = (floor === 2) ? CONFIG.ROOMS_ON_FLOOR_2 : CONFIG.ROOMS_PER_FLOOR;
      for (let room = 1; room <= roomsOnThisFloor; room++) {
        const unitData = projectData[catKey][floor]?.[room] || {};
        if (unitData.qcScore > 0) {
          totalQcChecks++;
          if (unitData.qcScore >= 85) {
            totalQcPasses++;
          }
        }
      }
    });
  });
  const qcPassRate = totalQcChecks > 0 ? (totalQcPasses / totalQcChecks) * 100 : 0;

  return { overallProgress, completedUnits, qcPassRate };
}
