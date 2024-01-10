import { XCircle } from "lucide-react";

interface FormErrorsProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
};

export const FormErrors = ({
  id,
  errors
}: FormErrorsProps) => {
  if (!errors) {
    return null;
  }
  
  return (
    <div
      id={`${id}-error`}
      aria-live="polite"
      className="mt-2 text-xs text-rose-500"
    >
      {errors?.[id]?.map((error: string) => (
        <div 
          key={error}
          className="flex items-center font-medium p-2 border border-rose-500 bg-rose-500/10 rounded-sm"
        >
          <XCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      ))}
    </div>
  );
};