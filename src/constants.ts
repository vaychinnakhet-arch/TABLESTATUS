import { TaskDefinition, CommonAreaDefinition } from './types';

export const CONFIG = {
  FLOORS: [8, 7, 6, 5, 4, 3, 2],
  COMMON_AREA_FLOORS: [2, 3, 4, 5, 6, 7, 8],
  ROOMS_PER_FLOOR: 21,
  ROOMS_ON_FLOOR_2: 18,
  get TOTAL_UNITS() { return ((this.FLOORS.length - 1) * this.ROOMS_PER_FLOOR) + this.ROOMS_ON_FLOOR_2; },
  DB_TABLE_NAME: 'project_data',
  DB_ROW_ID: 1,
  GEMINI_API_MODEL: 'gemini-2.5-flash',
};

export const TASK_DEFINITIONS: Record<string, TaskDefinition> = {
  skimAndPaint: { name: 'งานสกิม/ทาสี', reportName: 'งานสกิมและทาสีห้องพัก', reportEmoji: '🎨', title: 'STATUS งานสกิม / ทาสี', type: 'progress', tasks: [ { name: 'สกิม', color: 'bg-blue-500', textColor: 'text-white' }, { name: 'ทาสี', color: 'bg-orange-400', textColor: 'text-white' } ] },
  topping: { name: 'งานเท TOPPING', reportName: 'งานเทปรับระดับพื้นห้องพัก', reportEmoji: '🛠️', title: 'STATUS งานเท TOPPING', type: 'progress', tasks: [ { name: 'จับปุ่ม/ขังน้ำ', color: 'bg-violet-500', textColor: 'text-white' }, { name: 'เท Topping', color: 'bg-teal-500', textColor: 'text-white' } ] },
  ceiling: { name: 'งานติดตั้งฝ้า', reportName: 'งานติดตั้งฝ้าห้องพัก-ห้องน้ำ', reportEmoji: '🪜', title: 'STATUS งานติดตั้งฝ้า', type: 'progress', tasks: [ { name: 'ขึ้นโครง', color: 'bg-purple-500', textColor: 'text-white' }, { name: 'ติดแผ่น', color: 'bg-lime-500', textColor: 'text-white' } ] },
  texcaWall: { name: 'งานผนัง TEXCA', reportName: 'งานผนัง TEXCA', reportEmoji: '🧱', title: 'STATUS งานผนัง TEXCA WALL', type: 'progress', tasks: [ { name: 'ตีไลน์', color: 'bg-gray-400', textColor: 'text-white' }, { name: 'เขิบ', color: 'bg-stone-500', textColor: 'text-white' }, { name: 'TEXCA', color: 'bg-cyan-500', textColor: 'text-white' } ] },
  furniture: { name: 'งานติดตั้งเฟอร์นิเจอร์', reportName: 'งานติดตั้งเฟอร์นิเจอร์', reportEmoji: '🛋️', title: 'STATUS งานติดตั้งเฟอร์นิเจอร์', type: 'progress', tasks: [ { name: 'ติดตั้งชุดครัว', color: 'bg-orange-500', textColor: 'text-white' }, { name: 'ติดตั้งเฟอร์นิเจอร์', color: 'bg-lime-500', textColor: 'text-white' }, ] },
  laminate: { name: 'งานปูพื้นไม้ลามิเนต', reportName: 'งานปูพื้นไม้ลามิเนต', reportEmoji: '🌲', title: 'STATUS งานปูพื้นไม้ลามิเนต', type: 'progress', tasks: [ { name: 'ตรวจรับพื้นที่', color: 'bg-yellow-500', textColor: 'text-black' }, { name: 'ปูพื้นไม้', color: 'bg-amber-800', textColor: 'text-white' }, ] },
  waterproofing: { name: 'งานกันซึม', reportName: 'งานกันซึม', reportEmoji: '🛡️', title: 'STATUS งานกันซึม', type: 'multi-progress', tasks: [ { name: 'ห้องน้ำ', key: 'bathroom', shortName: 'น้ำ', color: 'bg-indigo-500', textColor: 'text-white' }, { name: 'ระเบียง', key: 'balcony', shortName: 'รบ.', color: 'bg-cyan-500', textColor: 'text-white' } ] },
  tiling: { name: 'งานปูกระเบื้อง', reportName: 'งานปูกระเบื้อง', reportEmoji: '🟧', title: 'STATUS งานปูกระเบื้อง', type: 'multi-progress', hasDetailedView: true, tasks: [ { name: 'ห้องน้ำ', key: 'bathroom', shortName: 'น้ำ', color: 'bg-teal-500', textColor: 'text-white' }, { name: 'ระเบียง', key: 'balcony', shortName: 'รบ.', color: 'bg-lime-600', textColor: 'text-white' }, { name: 'ครัว', key: 'kitchen', shortName: 'ครัว', color: 'bg-rose-500', textColor: 'text-white' } ] },
  door: { name: 'งานติดตั้งประตูไม้', reportName: 'งานติดตั้งประตูไม้', reportEmoji: '🚪', title: 'STATUS งานติดตั้งประตูไม้', type: 'multi-progress', tasks: [ { name: 'ประตูหน้า', key: 'front', shortName: 'หน้า', color: 'bg-amber-600', textColor: 'text-white' }, { name: 'ประตูห้องน้ำ', key: 'bathroom', shortName: 'น้ำ', color: 'bg-blue-400', textColor: 'text-white' }, { name: 'อุปกรณ์ประตู', key: 'hardware', shortName: 'อปก.', color: 'bg-green-500', textColor: 'text-white' } ] },
  aluminum: { name: 'งานติดตั้งอลูมิเนียม', reportName: 'งานติดตั้งอลูมิเนียม', reportEmoji: '🪟', title: 'STATUS งานติดตั้งอลูมิเนียม', type: 'multi-progress', hasDetailedView: true, tasks: [ { name: 'บานกั้นห้อง', key: 'partition', shortName: 'กั้น', color: 'bg-sky-400', textColor: 'text-white' }, { name: 'บานออกระเบียง', key: 'balcony', shortName: 'รบ.', color: 'bg-blue-400', textColor: 'text-white' }, { name: 'บานหน้าต่าง', key: 'window', shortName: 'นต.', color: 'bg-teal-400', textColor: 'text-white' } ] },
  showerScreen: { name: 'งาน SHOWER SCREEN', reportName: 'งาน SHOWER SCREEN', reportEmoji: '🚿', title: 'STATUS งาน SHOWER SCREEN', type: 'progress', tasks: [ { name: 'ติดตั้ง', color: 'bg-sky-500', textColor: 'text-white' }, { name: 'เก็บงาน', color: 'bg-emerald-500', textColor: 'text-white' } ] },
  wetWork: { name: 'WET WORK', reportName: 'WET WORK', reportEmoji: '💧', title: 'STATUS งาน WET WORK', type: 'inspection', tasks: [ { name: 'CM WW', color: 'bg-orange-400', textColor: 'text-white' }, { name: 'QC WW', color: 'bg-yellow-400', textColor: 'text-black' } ] },
  endProduct: { name: 'END PRODUCT', reportName: 'END PRODUCT', reportEmoji: '✅', title: 'STATUS งาน END PRODUCT', type: 'inspection', tasks: [ { name: 'CM End', color: 'bg-rose-300', textColor: 'text-black' }, { name: 'QC End', color: 'bg-emerald-400', textColor: 'text-black' }, ] },
};

export const COMMON_AREA_DEFINITIONS: Record<string, CommonAreaDefinition> = {
  "staircase1": { locationName: "บันได ST1", tasks: [ { taskName: "ฉาบผนัง" }, { taskName: "เทปรับระดับ ขัดมัน" }, { taskName: "งานฉาบท้องบันได" }, { taskName: "สกิมทาสี ผนัง" }, { taskName: "ราวบันได" } ]},
  "staircase2": { locationName: "บันได ST2", tasks: [ { taskName: "ฉาบผนัง" }, { taskName: "เทปรับระดับ ขัดมัน" }, { taskName: "งานฉาบท้องบันได" }, { taskName: "สกิมทาสี ผนัง" }, { taskName: "ราวบันได" } ]},
  "electricalRoom": { locationName: "ห้องไฟฟ้า", tasks: [ { taskName: "งานตั้งผนัง texca wall" }, { taskName: "ฉาบแต่งห้องพื้น" }, { taskName: "ทาสี" }, { taskName: "เทปูนระดับ" } ]},
  "garbageRoom": { locationName: "ห้องขยะ", tasks: [ { taskName: "งานก่อผนัง" }, { taskName: "ฉาบแต่งห้องพื้น" }, { taskName: "ทาสี" }, { taskName: "ปูกระเบื้อง" } ]},
  "lift": { locationName: "LIFT", tasks: [ { taskName: "เท Door jam" }, { taskName: "งานฉาบผนัง หน้าลิฟท์" }, { taskName: "งานสกิมทาสีผนัง หน้าลิฟท์" } ]},
  "hallway": { locationName: "ทางเดิน", tasks: [ { taskName: "ติดบานชาร์ป" }, { taskName: "ฝ้า" }, { taskName: "กระเบื้อง" } ]}
};
