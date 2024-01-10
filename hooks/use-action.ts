import { useState, useCallback } from "react";
import { ActionState, FieldErrors } from "@/lib/create-safe-action"

// Defining the type for the action function
type Action<TInput, TOutput> = (data: TInput) => Promise<ActionState<TInput, TOutput>>;

// Defining the options for the useAction hook
interface UseActionOptions<TOutput> {
  onSuccess?: (data: TOutput) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
};

// Defining the useAction hook
export const useAction = <TInput, TOutput> (
  action: Action<TInput, TOutput>,
  options: UseActionOptions<TOutput> = {}
) => {
  // Defining state variables
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TInput> | undefined>(
    undefined
  );
  const [error, setError] = useState<string | undefined>(undefined);
  const [data, setData] = useState<TOutput | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
	

  // Defining the execute function
  const execute = useCallback(
    async (input: TInput) => {

      // Setting loading state to true
      setIsLoading(true);

      try {
        // Executing the action function
        const result = await action(input);

        // If no result, return
        if (!result) {
          return;
        }

        // Setting field errors
        setFieldErrors(result.fieldErrors);

        // If there's an error, set the error state and call onError callback
        if (result.error) {
          setError(result.error);
          options.onError?.(result.error);
        }
				
        // If there's data, set the data state and call onSuccess callback
        if (result.data) {
          setData(result.data);
          options.onSuccess?.(result.data);
        }
      } finally {
        // Setting loading state to false and calling onComplete callback
        setIsLoading(false);
        options.onComplete?.();
      }
    },
    // Dependencies for useCallback
    [action, options]
  );

  return {
    execute,
    fieldErrors,
    error,
    data,
    isLoading,
  };
};