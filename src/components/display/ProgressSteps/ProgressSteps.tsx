'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './ProgressSteps.module.css';

/** A single step in the wizard progress indicator. */
export interface Step {
  /** Display title for the step. */
  title: string;
  /** Optional description shown below the title. */
  description?: string;
  /** Optional icon override (default: numbered circle or checkmark). */
  icon?: React.ReactNode;
}

export interface ProgressStepsProps extends ComponentPropsWithoutRef<'nav'> {
  /** Ordered list of steps to display. */
  steps: Step[];
  /** 0-based index of the current active step. */
  currentStep: number;
  /** Visual layout direction. */
  orientation?: 'horizontal' | 'vertical';
  /** Visual style variant. */
  variant?: 'default' | 'numbered' | 'compact';
  /** Called when a completed step is clicked. */
  onStepClick?: (stepIndex: number) => void;
}

/**
 * A multi-step wizard progress indicator.
 * Displays a sequence of steps with connected lines showing completed,
 * current, and upcoming states.
 */
export const ProgressSteps = forwardRef<HTMLElement, ProgressStepsProps>(
  (
    {
      steps,
      currentStep,
      orientation = 'horizontal',
      variant = 'default',
      onStepClick,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <nav
        ref={ref}
        className={cn(
          styles.steps,
          styles[orientation],
          styles[variant],
          className,
        )}
        {...props}
      >
        <ol className={styles.list} aria-label="Progress">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            const isClickable = isCompleted && !!onStepClick;

            let indicatorContent: React.ReactNode;
            if (step.icon) {
              indicatorContent = step.icon;
            } else if (variant === 'numbered') {
              indicatorContent = index + 1;
            } else if (isCompleted) {
              indicatorContent = '✓';
            } else {
              indicatorContent = index + 1;
            }

            const indicator = (
              <span className={styles.indicator}>{indicatorContent}</span>
            );

            const label = (
              <span className={styles.label}>
                <span className={styles.title}>{step.title}</span>
                {variant !== 'compact' && step.description && (
                  <span className={styles.description}>{step.description}</span>
                )}
              </span>
            );

            return (
              <li
                key={index}
                className={cn(
                  styles.step,
                  isCompleted && styles.completed,
                  isActive && styles.active,
                )}
                aria-current={isActive ? 'step' : undefined}
                aria-label={
                  isCompleted ? `Step ${index + 1}: completed` : undefined
                }
              >
                {isClickable ? (
                  <button
                    type="button"
                    className={styles.stepButton}
                    onClick={() => onStepClick(index)}
                  >
                    {indicator}
                    {label}
                  </button>
                ) : (
                  <div className={styles.stepBody}>
                    {indicator}
                    {label}
                  </div>
                )}
                {index < steps.length - 1 && (
                  <span className={styles.connector} aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);

ProgressSteps.displayName = 'ProgressSteps';
