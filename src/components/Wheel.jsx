import React, { useState, useRef } from "react";
import { usePrize } from "../context/PrizeContext";
import "./Wheel.css";

const Wheel = ({ onSpinComplete }) => {
  const { prizes, getAvailablePrizes, betterLuckOption } = usePrize();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef(null);

  const allOptions = [...getAvailablePrizes(), betterLuckOption];
  const segmentAngle = 360 / allOptions.length;

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    // Get the prize from context
    const { spin } = usePrize();
    const selectedPrize = spin();

    // Find the index of the selected prize in allOptions
    const selectedIndex = allOptions.findIndex(
      (p) => p.id === selectedPrize.id,
    );

    // Calculate rotation: spin multiple times + land on selected segment
    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const selectedAngle = selectedIndex * segmentAngle;
    const randomOffset =
      Math.random() * segmentAngle * 0.8 + segmentAngle * 0.1; // Random position within segment
    const targetRotation = spins * 360 + (360 - selectedAngle - randomOffset);

    setRotation((prevRotation) => prevRotation + targetRotation);

    // After animation completes
    setTimeout(() => {
      setIsSpinning(false);
      onSpinComplete(selectedPrize);
    }, 4000);
  };

  return (
    <div className="wheel-container">
      <div className="wheel-pointer">▼</div>
      <div
        ref={wheelRef}
        className="wheel"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning
            ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
            : "none",
        }}
      >
        {allOptions.map((option, index) => {
          const angle = index * segmentAngle;
          return (
            <div
              key={option.id}
              className="wheel-segment"
              style={{
                transform: `rotate(${angle}deg)`,
                backgroundColor: option.color,
              }}
            >
              <div
                className="segment-content"
                style={{
                  transform: `rotate(${segmentAngle / 2}deg) translateY(-50px)`,
                }}
              >
                <span className="segment-label">{option.label}</span>
              </div>
            </div>
          );
        })}
        <div className="wheel-center">
          <span className="wheel-center-text">Lì Xì</span>
        </div>
      </div>
      <button
        className="spin-button"
        onClick={handleSpin}
        disabled={isSpinning}
      >
        {isSpinning ? "Đang quay..." : "QUAY THƯỞNG"}
      </button>
    </div>
  );
};

// Modified Wheel component to use context spin method properly
const WheelWrapper = ({ onSpinComplete }) => {
  const prizeContext = usePrize();

  return (
    <WheelInternal
      onSpinComplete={onSpinComplete}
      prizeContext={prizeContext}
    />
  );
};

const WheelInternal = ({ onSpinComplete, prizeContext }) => {
  const { prizes, getAvailablePrizes, betterLuckOption, spin } = prizeContext;
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef(null);

  const allOptions = [...getAvailablePrizes(), betterLuckOption];
  const segmentAngle = 360 / allOptions.length;

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    // Get the prize from context
    const selectedPrize = spin();

    // Find the index of the selected prize in allOptions
    const selectedIndex = allOptions.findIndex(
      (p) => p.id === selectedPrize.id,
    );

    // Calculate rotation: spin multiple times + land on selected segment
    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const selectedAngle = selectedIndex * segmentAngle;
    const randomOffset =
      Math.random() * segmentAngle * 0.8 + segmentAngle * 0.1;
    const targetRotation = spins * 360 + (360 - selectedAngle - randomOffset);

    setRotation((prevRotation) => prevRotation + targetRotation);

    // After animation completes
    setTimeout(() => {
      setIsSpinning(false);
      onSpinComplete(selectedPrize);
    }, 4000);
  };

  return (
    <div className="wheel-container">
      <div className="wheel-pointer">▼</div>
      <div
        ref={wheelRef}
        className="wheel"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning
            ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
            : "none",
        }}
      >
        {allOptions.map((option, index) => {
          const angle = index * segmentAngle;
          return (
            <div
              key={`${option.id}-${index}`}
              className="wheel-segment"
              style={{
                transform: `rotate(${angle}deg)`,
                backgroundColor: option.color,
                clipPath: `polygon(50% 50%, 100% 0%, 100% 100%)`,
              }}
            >
              <div
                className="segment-content"
                style={{
                  transform: `rotate(${segmentAngle / 2}deg) translateY(-80px)`,
                }}
              >
                <span className="segment-label">{option.label}</span>
              </div>
            </div>
          );
        })}
        <div className="wheel-center">
          <span className="wheel-center-text">🧧</span>
        </div>
      </div>
      <button
        className="spin-button"
        onClick={handleSpin}
        disabled={isSpinning}
      >
        {isSpinning ? "Đang quay..." : "QUAY THƯỞNG"}
      </button>
    </div>
  );
};

export default WheelWrapper;
