import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  name: string;
  description: string;
}

interface ProgressBarProps {
  currentStep: number;
  steps: Step[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full bg-background/80 backdrop-blur-sm border-b border-border py-4 px-4 sticky top-0 z-50">
      <div className="container mx-auto">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, stepIdx) => (
              <li
                key={step.name}
                className={cn(
                  'relative flex-1',
                  stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''
                )}
              >
                {/* Connector Line */}
                {stepIdx !== steps.length - 1 && (
                  <div
                    className="absolute top-4 left-0 -ml-px mt-0.5 h-0.5 w-full"
                    aria-hidden="true"
                  >
                    <div
                      className={cn(
                        'h-full transition-all duration-500',
                        currentStep > step.number
                          ? 'bg-gradient-to-r from-primary via-accent to-secondary'
                          : 'bg-muted'
                      )}
                    />
                  </div>
                )}

                {/* Step Circle */}
                <div className="group relative flex flex-col items-center">
                  <span className="flex h-9 items-center">
                    <span
                      className={cn(
                        'relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300',
                        currentStep > step.number
                          ? 'bg-gradient-to-br from-primary to-accent group-hover:scale-110'
                          : currentStep === step.number
                          ? 'bg-gradient-to-br from-accent to-secondary ring-4 ring-accent/20 group-hover:scale-110'
                          : 'bg-muted group-hover:bg-muted/80'
                      )}
                    >
                      {currentStep > step.number ? (
                        <Check className="h-5 w-5 text-primary-foreground" />
                      ) : (
                        <span
                          className={cn(
                            'text-sm font-medium',
                            currentStep === step.number
                              ? 'text-primary-foreground'
                              : 'text-muted-foreground'
                          )}
                        >
                          {step.number}
                        </span>
                      )}
                    </span>
                  </span>

                  {/* Step Label */}
                  <span className="mt-2 text-center">
                    <span
                      className={cn(
                        'text-xs font-medium block transition-colors',
                        currentStep >= step.number
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      {step.name}
                    </span>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {step.description}
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default ProgressBar;
