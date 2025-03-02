'use client';

import Tippy from '@tippyjs/react';
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from 'lucide-react';
import 'tippy.js/dist/tippy.css';

interface ToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
}

export function Toolbar({
  onBold,
  onItalic,
  onUnderline,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
}: ToolbarProps) {
  const ToolbarButton = ({
    icon: Icon,
    label,
    onClick,
  }: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    onClick: () => void;
  }) => (
    <Tippy content={label} delay={[300, 0]} placement="bottom">
      <button
        type="button"
        onClick={onClick}
        className="p-1.5 hover:bg-gray-100 rounded-sm text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        aria-label={label}
      >
        <Icon size={16} className="stroke-[1.5px]" />
      </button>
    </Tippy>
  );

  return (
    <div className="flex items-center h-9 border-b border-gray-200 bg-white/80 backdrop-blur-sm px-1.5 gap-1">
      <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1">
        <ToolbarButton icon={BoldIcon} label="Bold" onClick={onBold} />
        <ToolbarButton icon={ItalicIcon} label="Italic" onClick={onItalic} />
        <ToolbarButton icon={UnderlineIcon} label="Underline" onClick={onUnderline} />
      </div>
      <div className="flex items-center gap-0.5">
        <ToolbarButton icon={AlignLeftIcon} label="Align Left" onClick={onAlignLeft} />
        <ToolbarButton icon={AlignCenterIcon} label="Align Center" onClick={onAlignCenter} />
        <ToolbarButton icon={AlignRightIcon} label="Align Right" onClick={onAlignRight} />
      </div>
    </div>
  );
}
