import React from "react";

interface CallsignPlateProps {
  callsign?: string;
  region?: string;
  size?: "sm" | "md" | "lg";
}

export const CallsignPlate: React.FC<CallsignPlateProps> = ({ 
  callsign = "RIDER", 
  region = "72",
  size = "md" 
}) => {
  const sizeClasses = {
    sm: "h-6 px-2 text-xs",
    md: "h-8 px-3 text-sm",
    lg: "h-10 px-4 text-base"
  };

  const flagClasses = {
    sm: "w-4 h-3",
    md: "w-5 h-4",
    lg: "w-6 h-5"
  };

  const regionClasses = {
    sm: "w-5 h-6 text-[10px]",
    md: "w-6 h-8 text-xs",
    lg: "w-8 h-10 text-sm"
  };

  return (
    <div 
      className={`inline-flex items-center gap-0.5 bg-white rounded ${sizeClasses[size]} font-bold relative overflow-hidden border border-black`}
      style={{ fontFamily: "'Courier New', monospace" }}
    >
      <div className="flex items-center gap-0.5">
        <div className={`${flagClasses[size]} flex-shrink-0`}>
          <svg viewBox="0 0 9 6" className="w-full h-full">
            <rect width="9" height="2" fill="#ffffff"/>
            <rect y="2" width="9" height="2" fill="#0039a6"/>
            <rect y="4" width="9" height="2" fill="#d52b1e"/>
          </svg>
        </div>
        
        <span className="text-black tracking-wider uppercase">
          {callsign}
        </span>
      </div>
      
      <div 
        className={`${regionClasses[size]} bg-white border-l border-black flex items-center justify-center font-bold text-black flex-shrink-0`}
      >
        {region}
      </div>
    </div>
  );
};
