import { useState } from 'react';

export default function DiagonalRibbon() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 800);
  };

  if (!isVisible) return null;

  return (
    <div
      onClick={handleClick}
      className="fixed inset-0 z-50 pointer-events-none cursor-pointer"
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      <div
        className={`absolute w-[200%] h-24 bg-red-600 shadow-2xl transition-all duration-700 ${
          isAnimating ? 'animate-tear-ribbon' : ''
        }`}
        style={{
          top: '50%',
          left: '-50%',
          transform: 'translate(0, -50%) rotate(-45deg)',
          transformOrigin: 'center',
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-px h-full dash-line-vertical" />
          </div>
          
          <p className="text-white font-bold text-lg md:text-xl text-center px-4 relative z-10 whitespace-nowrap">
            Платформа доступна, но на данный момент находится в разработке
          </p>
        </div>
      </div>

      <style>{`
        .dash-line-vertical {
          background-image: linear-gradient(to bottom, white 50%, transparent 50%);
          background-size: 1px 20px;
          background-repeat: repeat-y;
        }

        @keyframes tear-left {
          0% {
            transform: translate(0, -50%) rotate(-45deg);
          }
          100% {
            transform: translate(-100%, -50%) rotate(-50deg);
            opacity: 0;
          }
        }

        @keyframes tear-right {
          0% {
            transform: translate(0, -50%) rotate(-45deg);
          }
          100% {
            transform: translate(100%, -50%) rotate(-40deg);
            opacity: 0;
          }
        }

        .animate-tear-ribbon::before {
          content: '';
          position: absolute;
          inset: 0;
          right: 50%;
          background: inherit;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          animation: tear-left 0.8s ease-in forwards;
        }

        .animate-tear-ribbon::after {
          content: '';
          position: absolute;
          inset: 0;
          left: 50%;
          background: inherit;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          animation: tear-right 0.8s ease-in forwards;
        }

        .animate-tear-ribbon > * {
          opacity: 0;
        }
      `}</style>
    </div>
  );
}