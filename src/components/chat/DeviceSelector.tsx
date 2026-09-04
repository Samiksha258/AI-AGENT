import { motion } from 'framer-motion';
import { Smartphone, Laptop, Monitor, Tablet, Printer, Tv, Wifi, HelpCircle } from 'lucide-react';
import type { DeviceType } from '../../types';

interface DeviceSelectorProps {
  selected: DeviceType;
  onChange: (device: DeviceType) => void;
  disabled?: boolean;
}

const devices: { id: DeviceType; label: string; Icon: React.ElementType }[] = [
  { id: 'phone',    label: 'Phone',    Icon: Smartphone },
  { id: 'laptop',   label: 'Laptop',   Icon: Laptop },
  { id: 'desktop',  label: 'Desktop',  Icon: Monitor },
  { id: 'tablet',   label: 'Tablet',   Icon: Tablet },
  { id: 'printer',  label: 'Printer',  Icon: Printer },
  { id: 'smart-tv', label: 'TV',       Icon: Tv },
  { id: 'router',   label: 'Router',   Icon: Wifi },
  { id: 'other',    label: 'Other',    Icon: HelpCircle },
];

export default function DeviceSelector({ selected, onChange, disabled }: DeviceSelectorProps) {
  return (
    <div className="px-4 py-2 bg-white border-b border-slate-100">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
        Device
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {devices.map(({ id, label, Icon }) => {
          const active = selected === id;
          return (
            <motion.button
              key={id}
              whileHover={disabled ? {} : { scale: 1.06 }}
              whileTap={disabled ? {} : { scale: 0.95 }}
              onClick={() => !disabled && onChange(id)}
              disabled={disabled}
              aria-pressed={active}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-xl flex-shrink-0 
                text-xs font-medium transition-all border cursor-pointer
                ${active
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-blue-200 hover:text-blue-500'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <Icon size={16} />
              <span>{label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
