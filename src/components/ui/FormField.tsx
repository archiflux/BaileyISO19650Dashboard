import InfoTooltip from './InfoTooltip';

interface FormFieldProps {
  label: string;
  tooltip?: { title: string; content: string; isoReference?: string };
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function FormField({
  label,
  tooltip,
  required,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {tooltip && (
          <InfoTooltip
            title={tooltip.title}
            content={tooltip.content}
            isoReference={tooltip.isoReference}
          />
        )}
      </label>
      {children}
    </div>
  );
}

// Reusable input styling
export const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-bailey-blue focus:border-bailey-blue outline-none transition-all';

export const selectClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-bailey-blue focus:border-bailey-blue outline-none transition-all bg-white';

export const textareaClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-bailey-blue focus:border-bailey-blue outline-none transition-all resize-y min-h-[80px]';
