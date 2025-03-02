'use client';

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
  const ToolbarButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1 hover:bg-gray-100 rounded text-sm text-[var(--spreadsheet-text-primary)]"
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center h-10 border-b border-gray-300 bg-white px-2 space-x-2">
      <div className="flex items-center space-x-1 border-r border-gray-300 pr-2">
        <ToolbarButton label="B" onClick={onBold} />
        <ToolbarButton label="I" onClick={onItalic} />
        <ToolbarButton label="U" onClick={onUnderline} />
      </div>
      <div className="flex items-center space-x-1">
        <ToolbarButton label="Left" onClick={onAlignLeft} />
        <ToolbarButton label="Center" onClick={onAlignCenter} />
        <ToolbarButton label="Right" onClick={onAlignRight} />
      </div>
    </div>
  );
} 