import React, { useState, useEffect } from 'react';
import { initialProcessingSteps, ProcessingStep, StepStatus } from '../config/processingSteps';
import { IconType } from 'react-icons';

interface ProcessingPageProps {
  onProcessingComplete: () => void;
  onProcessingError: (error: string) => void; // For future use
}

const ProcessingPage: React.FC<ProcessingPageProps> = ({ onProcessingComplete, onProcessingError }) => {
  // Initialize state by creating new step objects but preserving icon references
  const [steps, setSteps] = useState<ProcessingStep[]>(() => 
    initialProcessingSteps.map(step => ({ ...step }))
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Set the first step to active initially when component mounts
    setSteps(prevSteps => 
      prevSteps.map((step, index) => 
        index === 0 ? { ...step, status: StepStatus.ACTIVE } : { ...step, status: StepStatus.PENDING }
      )
    );
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    // Simulate backend processing
    // Make sure we only proceed if the currentStepIndex is valid and steps array is populated
    if (steps.length === 0 || currentStepIndex >= steps.length) {
        // If all steps are completed (currentStepIndex might be steps.length)
        if (steps.length > 0 && steps.every(step => step.status === StepStatus.COMPLETED)) {
            const completionTimer = setTimeout(() => {
                onProcessingComplete();
            }, 1500);
            return () => clearTimeout(completionTimer);
        }
        return; // Do nothing if steps aren't initialized or processing is done
    }

    // Ensure the current step is marked ACTIVE if it's not already (e.g. after initial mount effect)
    if (steps[currentStepIndex].status !== StepStatus.ACTIVE) {
        setSteps(prevSteps => 
            prevSteps.map((step, index) => 
                index === currentStepIndex ? { ...step, status: StepStatus.ACTIVE } : step
            )
        );
    }

    const timer = setTimeout(() => {
      setSteps(prevSteps => 
        prevSteps.map((step, index) => {
          if (index === currentStepIndex) {
            return { ...step, status: StepStatus.COMPLETED };
          }
          // No need to activate the next step here, the next iteration of this effect will handle it
          return step;
        })
      );
      setCurrentStepIndex(prev => prev + 1);
    }, 2000 + Math.random() * 2000);

    return () => clearTimeout(timer);
  // Depend on currentStepIndex and the steps array (specifically its length or content if it could change structurally)
  // For this simulation, currentStepIndex and steps.length should be sufficient to re-trigger correctly.
  }, [currentStepIndex, steps, onProcessingComplete]); // Added steps to dependency array

  const getStepIcon = (step: ProcessingStep): React.ReactElement => {
    let IconComponent: IconType = step.icon;
    let iconClass = 'text-cool-gray';

    if (step.status === StepStatus.ACTIVE && step.activeIcon) {
      IconComponent = step.activeIcon;
      iconClass = 'text-electric-teal animate-spin'; // animate-spin for FiLoader
    } else if (step.status === StepStatus.COMPLETED && step.completedIcon) {
      IconComponent = step.completedIcon;
      iconClass = 'text-electric-teal';
    } else if (step.status === StepStatus.ERROR) {
      // IconComponent = FiAlertCircle; // For future error state
      // iconClass = 'text-red-500';
    }
    return <IconComponent size={24} className={`mr-4 shrink-0 ${iconClass} transition-colors duration-300`} />;
  };

  return (
    <div className="min-h-screen bg-deep-charcoal text-off-white flex flex-col items-center justify-center p-6 font-sans">
      <main className="flex flex-col items-center text-center w-full max-w-lg">
        <h1 className="text-3xl font-bold text-off-white mb-10">
          Generating Your Smart Notes...
        </h1>

        <div className="space-y-5 w-full mb-12">
          {steps.map((step) => (
            <div key={step.key} className={`flex items-center p-4 rounded-lg transition-all duration-300 ease-in-out 
                                          ${step.status === StepStatus.ACTIVE ? 'bg-dark-slate shadow-lg' : 'bg-transparent'}`}>
              {getStepIcon(step)}
              <span className={`text-lg 
                               ${step.status === StepStatus.PENDING ? 'text-cool-gray' : 'text-off-white'}
                               ${step.status === StepStatus.COMPLETED ? 'line-through text-cool-gray/70' : ''}
                               transition-colors duration-300`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-cool-gray text-sm">
          This might take a few minutes, especially for longer lectures. Please keep this page open.
        </p>

        {/* Optional Overall Progress Bar - Can be added later */}
        {/* <div className="w-full bg-dark-slate rounded-full h-2.5 mt-8"> */}
        {/*   <div className="bg-electric-teal h-2.5 rounded-full" style={{ width: `${(currentStepIndex / steps.length) * 100}%` }}></div> */}
        {/* </div> */}

      </main>
    </div>
  );
};

export default ProcessingPage; 