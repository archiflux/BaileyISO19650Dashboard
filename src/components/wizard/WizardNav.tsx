import { Check } from 'lucide-react';
import { WIZARD_STEPS } from '../../data/defaults';
import { useBep } from '../../context/BepContext';

export default function WizardNav() {
  const { bep, dispatch } = useBep();

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {WIZARD_STEPS.map((step, index) => {
          const isActive = bep.currentStep === step.id;
          const isCompleted = bep.completedSteps.includes(step.id);
          const isPast = step.id < bep.currentStep;

          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => dispatch({ type: 'SET_STEP', payload: step.id })}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-bailey-blue text-white shadow-sm'
                    : isCompleted
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : isPast
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    step.id
                  )}
                </span>
                <span className="hidden lg:inline">{step.shortTitle}</span>
              </button>
              {index < WIZARD_STEPS.length - 1 && (
                <div
                  className={`w-4 h-0.5 mx-0.5 shrink-0 ${
                    isCompleted || isPast ? 'bg-green-300' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
