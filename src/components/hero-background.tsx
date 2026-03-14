import React from "react";
import { BackgroundGradientAnimation } from "./ui/background-gradient-animation";

export const HeroBackground = () => {
  return (
    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(255, 255, 255)"
        gradientBackgroundEnd="rgb(255, 255, 255)"
        firstColor="255, 92, 0"
        secondColor="255, 120, 40"
        thirdColor="255, 150, 80"
        fourthColor="255, 80, 20"
        fifthColor="255, 100, 60"
        pointerColor="255, 92, 0"
        size="80%"
        blendingValue="normal"
      />
    </div>
  );
};
