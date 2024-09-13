import React from 'react'

interface TimerProps {
    time: number;
    isActive: boolean;
  }
  
  const Timer: React.FC<TimerProps> = ({ time, isActive }) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return (
      <div
        className={`text-sm sm:text-base md:text-lg lg:text-2xl font-mono font-bold ${
          isActive ? `${minutes<1?"text-white bg-red-800":"text-emerald-500 bg-black"} rounded-sm` : "text-gray-500"
        } transition-colors duration-300`}
      >
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </div>
    );
  };

  export default Timer;