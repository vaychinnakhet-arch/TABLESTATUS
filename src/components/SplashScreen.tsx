import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ProjectData } from '../types';
import { calculateProjectSummary } from '../utils/calculations';
import { CONFIG } from '../constants';
import { Home, Activity, CheckCircle, BarChart2, Zap, Layers } from 'lucide-react';

interface SplashScreenProps {
  projectData: ProjectData;
  onNavigate: (view: 'residential' | 'common' | 'quickUpdate') => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ projectData, onNavigate }) => {
  const summary = useMemo(() => calculateProjectSummary(projectData), [projectData]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-200">
      <div className="w-full max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-2 tracking-tight">
            Vay Chinnakhet
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium">
            ระบบติดตามความคืบหน้าโครงการ
          </p>
        </motion.div>

        {/* Summary Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <SummaryCard 
            title="ภาพรวมโครงการ" 
            value={`${summary.overallProgress.toFixed(1)}%`}
            icon={<Activity className="w-6 h-6 text-emerald-500" />}
            color="emerald"
          />
          <SummaryCard 
            title="ห้องพักที่เสร็จสมบูรณ์" 
            value={`${summary.completedUnits} / ${CONFIG.TOTAL_UNITS}`}
            icon={<CheckCircle className="w-6 h-6 text-blue-500" />}
            color="blue"
          />
          <SummaryCard 
            title="QC PASS RATE" 
            value={`${summary.qcPassRate.toFixed(1)}%`}
            icon={<BarChart2 className="w-6 h-6 text-indigo-500" />}
            color="indigo"
          />
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <NavCard 
            title="ระบบติดตาม (ห้องพัก)" 
            onClick={() => onNavigate('residential')}
            gradient="from-emerald-400 to-cyan-500"
            icon={<Home className="w-10 h-10 text-white" />}
          />
          <NavCard 
            title="โหมดอัพเดทหน้างาน" 
            onClick={() => onNavigate('quickUpdate')}
            gradient="from-orange-400 to-rose-500"
            icon={<Zap className="w-10 h-10 text-white" />}
          />
          <NavCard 
            title="ระบบติดตาม (ส่วนกลาง)" 
            onClick={() => onNavigate('common')}
            gradient="from-blue-400 to-indigo-500"
            icon={<Layers className="w-10 h-10 text-white" />}
          />
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-12 text-slate-400 text-center text-sm"
        >
          ข้อมูลล่าสุด ณ {new Date().toLocaleTimeString('th-TH')}
        </motion.p>
      </div>
    </div>
  );
};

const colorMap: Record<string, { bg: string, text: string, border: string }> = {
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200' },
  indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-200' },
};

const SummaryCard = ({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: keyof typeof colorMap }) => {
  const colors = colorMap[color];
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border ${colors.border} flex flex-col items-center justify-center relative overflow-hidden group`}
    >
      <div className={`absolute top-0 left-0 w-full h-1 ${colors.bg} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 z-10 flex items-center gap-2">
        {title}
      </h2>
      <div className="flex items-center justify-center h-24 z-10">
        <div className="flex items-center gap-3">
          {icon}
          <p className={`text-5xl font-extrabold ${colors.text} tracking-tight`}>{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

const NavCard = ({ title, onClick, gradient, icon }: { title: string, onClick: () => void, gradient: string, icon: React.ReactNode }) => (
  <motion.div 
    whileHover={{ scale: 1.03, y: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`cursor-pointer p-8 md:p-10 rounded-2xl shadow-xl text-white flex flex-col items-center justify-center bg-gradient-to-br ${gradient} relative overflow-hidden`}
  >
    <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300" />
    <div className="mb-4 p-4 bg-white/20 rounded-full backdrop-blur-sm shadow-inner">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-center drop-shadow-md">{title}</h3>
  </motion.div>
);

export default SplashScreen;
