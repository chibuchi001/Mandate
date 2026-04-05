import React from "react";

interface OrbitingCirclesProps {
  children: React.ReactNode;
  radius?: number;
  iconSize?: number;
  reverse?: boolean;
  speed?: number;
  duration?: number;
  path?: boolean;
  className?: string;
}

export function OrbitingCircles({
  children,
  radius = 160,
  iconSize = 32,
  reverse = false,
  speed = 1,
  duration = 20,
  path = true,
}: OrbitingCirclesProps) {
  const calculatedDuration = duration / speed;
  const count = React.Children.count(children);

  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 pointer-events-none size-full"
        >
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            className="stroke-1 stroke-white/10"
          />
        </svg>
      )}
      {React.Children.map(children, (child, index) => {
        const angle = (360 / count) * index;
        return (
          <div
            style={
              {
                "--duration": calculatedDuration,
                "--radius": radius,
                "--angle": angle,
                "--icon-size": `${iconSize}px`,
              } as React.CSSProperties
            }
            className={`absolute flex size-[var(--icon-size)] transform-gpu animate-orbit items-center justify-center rounded-full ${
              reverse ? "[animation-direction:reverse]" : ""
            }`}
          >
            {child}
          </div>
        );
      })}
    </>
  );
}
