import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface InfoTooltipProps {
  title: string;
  content: string;
  isoReference?: string;
}

export default function InfoTooltip({ title, content, isoReference }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-bailey-gray hover:text-bailey-blue transition-colors ml-1"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      {isOpen && (
        <div className="absolute z-50 w-72 p-3 bg-white border border-gray-200 rounded-lg shadow-lg -left-32 top-6">
          <p className="font-semibold text-sm text-bailey-navy mb-1">{title}</p>
          <p className="text-xs text-gray-600 leading-relaxed">{content}</p>
          {isoReference && (
            <p className="text-xs text-bailey-blue mt-2 font-medium">{isoReference}</p>
          )}
        </div>
      )}
    </div>
  );
}
