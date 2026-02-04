import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { WIZARD_STEPS } from '../../data/defaults';
import { useBep } from '../../context/BepContext';

interface StepWrapperProps {
  children: React.ReactNode;
}

export default function StepWrapper({ children }: StepWrapperProps) {
  const { bep, dispatch } = useBep();
  const currentStepData = WIZARD_STEPS.find((s) => s.id === bep.currentStep);
  const isFirst = bep.currentStep === 1;
  const isLast = bep.currentStep === WIZARD_STEPS.length;

  const handlePrevious = () => {
    if (!isFirst) {
      dispatch({ type: 'SET_STEP', payload: bep.currentStep - 1 });
    }
  };

  const handleNext = () => {
    dispatch({ type: 'COMPLETE_STEP', payload: bep.currentStep });
    if (!isLast) {
      dispatch({ type: 'SET_STEP', payload: bep.currentStep + 1 });
    }
  };

  const handleSave = () => {
    dispatch({ type: 'COMPLETE_STEP', payload: bep.currentStep });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Step Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-bailey-blue uppercase tracking-wide mb-1">
              Step {bep.currentStep} of {WIZARD_STEPS.length}
            </p>
            <h2 className="text-xl font-bold text-gray-900">
              {currentStepData?.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {currentStepData?.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                bep.completedSteps.includes(bep.currentStep)
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {bep.completedSteps.includes(bep.currentStep)
                ? 'Completed'
                : 'In Progress'}
            </span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-auto px-8 py-6">{children}</div>

      {/* Step Navigation */}
      <div className="bg-white border-t border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={isFirst}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
            >
              <Save className="w-4 h-4" />
              Save Progress
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-bailey-blue text-white hover:bg-blue-700 transition-all"
            >
              {isLast ? 'Complete' : 'Save & Continue'}
              {!isLast && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
