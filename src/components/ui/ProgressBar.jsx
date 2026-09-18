'use client';

export default function ProgressBar({ currentStep = 1, totalSteps = 4 }) {
// Map step progress to specific fill colors
const getStepColor = (step, total) => {
const ratio = step / total;

if (ratio <= 0.25) return 'bg-[#F97316]'; 
if (ratio <= 0.75) return 'bg-[#EAB308]'; 
return 'bg-emerald-500';              
};

const percentage = Math.round(
Math.min(Math.max((currentStep / totalSteps) * 100, 0), 100)
);

return (
<div className="w-full font-sans select-none mb-6">
    {/* Header Info Row */}
    <div className="flex justify-between items-center text-xs text-[--text-secondary] font-medium mb-2">
    <span className="font-semibold text-[--text-primary]">
        Step {currentStep} of {totalSteps}
    </span>
    <span>{percentage}% Complete</span>
    </div>

    {/* Track & Dynamic Color Fill */}
    <div className="w-full h-1.5 bg-[--bg-main] border border-[--border-subtle] rounded-full overflow-hidden">
    <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${getStepColor(
        currentStep,
        totalSteps
        )}`}
        style={{ width: `${percentage}%` }}
    />
    </div>
</div>
);
}