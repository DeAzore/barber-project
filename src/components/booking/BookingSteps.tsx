import { CheckCircle2, Circle } from 'lucide-react';

interface BookingStepsProps {
  currentStep: number;
}

const BookingSteps = ({ currentStep }: BookingStepsProps) => {
  const steps = [
    { number: 1, label: "Services" },
    { number: 2, label: "Barbier" },
    { number: 3, label: "Date & Heure" },
    { number: 4, label: "Détails" }
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center relative">
        {/* Progress line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-cabbelero-gray -translate-y-1/2 z-0" />
        
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center relative z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              currentStep > step.number 
                ? 'bg-cabbelero-gold text-cabbelero-black' 
                : currentStep === step.number
                  ? 'bg-cabbelero-gold/80 text-cabbelero-black'
                  : 'bg-cabbelero-black border-2 border-cabbelero-gray text-gray-400'
            }`}>
              {currentStep > step.number ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <span className="font-medium">{step.number}</span>
              )}
            </div>
            <span className={`text-xs font-medium ${
              currentStep >= step.number ? 'text-cabbelero-gold' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingSteps;
