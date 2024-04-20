import React from "react";

const Spinner2 = ({ color = "#000", size = 50 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      style={{ background: "none" }}
    >
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke={color}
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="2s"
          repeatCount="indefinite"
          from="0"
          to="502"
        />
        <animate
          attributeName="stroke-dasharray"
          dur="2s"
          repeatCount="indefinite"
          values="150.6 100.4;1 250;150.6 100.4"
        />
      </circle>
    </svg>
  );
};

export interface SpinnerProps {
  size?: string;
  className?: string;
  color?: string;
  width?: string;
  height?: string;
  style?: any;
}

const Spinner: React.FC<SpinnerProps & {}> = ({
  className,
  color,
  size = 25,
  width,
  height,
  style,
}): React.ReactElement => {
  const newWidth = width ?? size;
  const newHeight = height ?? size;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      style={{ background: "none", ...style }}
    >
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke={color}
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="2s"
          repeatCount="indefinite"
          from="0"
          to="502"
          fill={color}
        />
        <animate
          attributeName="stroke-dasharray"
          dur="2s"
          repeatCount="indefinite"
          values="150.6 100.4;1 250;150.6 100.4"
          fill={color}
        />
      </circle>
    </svg>
  );
};

export default Spinner;
