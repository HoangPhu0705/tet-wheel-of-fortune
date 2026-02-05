import React, { useState, useRef, useEffect } from "react";
import { Wheel } from "spin-wheel";
import { usePrize } from "../context/PrizeContext";
import "./Wheel.css";

const WheelComponent = ({ onSpinComplete, wheelUpdateRef }) => {
  const { getAllPrizesForDisplay, spin, prizes } = usePrize();
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelContainerRef = useRef(null);
  const wheelInstanceRef = useRef(null);

  // Function to update the wheel
  const updateWheel = () => {
    const displayPrizes = getAllPrizesForDisplay();
    const items = displayPrizes.map((prize) => ({
      label: prize.label,
      backgroundColor: prize.color,
      weight: prize.quantity === Infinity ? 30 : prize.quantity,
    }));

    if (wheelInstanceRef.current) {
      wheelInstanceRef.current.init({
        items: items,
        itemBackgroundColors: items.map((item) => item.backgroundColor),
        itemLabelFontSizeMax: 20,
        itemLabelRadius: 0.85,
        itemLabelRadiusMax: 0.35,
        itemLabelAlign: "center",
        itemLabelColors: ["#fff"],
        itemLabelBaselineOffset: -0.07,
        itemLabelRotation: 0,
      });
    }
  };

  // Expose updateWheel to parent
  if (wheelUpdateRef) {
    wheelUpdateRef.current = updateWheel;
  }

  useEffect(() => {
    if (!wheelContainerRef.current) return;

    // Get all prizes for display
    const displayPrizes = getAllPrizesForDisplay();

    // Create items for the wheel based on prizes
    const items = displayPrizes.map((prize) => ({
      label: prize.label,
      backgroundColor: prize.color,
      weight: prize.quantity === Infinity ? 30 : prize.quantity,
    }));

    // If wheel already exists, update its items (only if not spinning)
    if (wheelInstanceRef.current && !isSpinning) {
      wheelInstanceRef.current.init({
        items: items,
        itemBackgroundColors: items.map((item) => item.backgroundColor),
        itemLabelFontSizeMax: 20,
        itemLabelRadius: 0.85,
        itemLabelRadiusMax: 0.35,
        itemLabelAlign: "center",
        itemLabelColors: ["#fff"],
        itemLabelBaselineOffset: -0.07,
        itemLabelRotation: 0,
      });
    } else if (!wheelInstanceRef.current) {
      // Initialize the wheel for the first time
      const wheel = new Wheel(wheelContainerRef.current, {
        items: items,
        borderWidth: 0,
        borderColor: "#FFD700",
        radius: 0.92,
        itemLabelRadius: 0.85,
        itemLabelRadiusMax: 0.35,
        itemLabelRotation: 0,
        itemLabelAlign: "center",
        itemLabelColors: ["#fff"],
        itemLabelBaselineOffset: -0.07,
        itemLabelFontSizeMax: 20,
        itemBackgroundColors: items.map((item) => item.backgroundColor),
        rotationSpeedMax: 500,
        rotationResistance: -100,
        lineWidth: 3,
        lineColor: "#fff",
        overlayImage: null,
        pointerAngle: 0,
        isInteractive: false,
      });

      wheelInstanceRef.current = wheel;
    }
  }, [prizes, getAllPrizesForDisplay, isSpinning]);

  // Cleanup only on unmount
  useEffect(() => {
    return () => {
      if (wheelInstanceRef.current) {
        wheelInstanceRef.current.remove();
        wheelInstanceRef.current = null;
      }
    };
  }, []);

  const handleSpin = () => {
    if (isSpinning || !wheelInstanceRef.current) return;

    setIsSpinning(true);

    // Get the prize from context
    const selectedPrize = spin();
    console.log("Prize selected:", selectedPrize.label);

    // Find the index of the selected prize
    const displayPrizes = getAllPrizesForDisplay();
    const selectedIndex = displayPrizes.findIndex(
      (p) => p.id === selectedPrize.id,
    );

    console.log("Prize index:", selectedIndex);

    if (selectedIndex === -1) {
      console.error("Selected prize not found in display prizes!");
      setIsSpinning(false);
      return;
    }

    // Spin to the selected item
    const duration = 4000;
    const revolutions = 5 + Math.floor(Math.random() * 3);

    wheelInstanceRef.current.spinToItem(
      selectedIndex,
      duration,
      true, // spinToCenter
      revolutions,
      1, // direction: 1 = clockwise
      null, // use default easing
    );

    // Show result after animation
    setTimeout(() => {
      setIsSpinning(false);

      // Wait 1.5 seconds before showing the modal so users can see the result
      setTimeout(() => {
        onSpinComplete(selectedPrize);
      }, 1500);
    }, duration);
  };

  return (
    <div className="wheel-wrapper">
      <div className="wheel-pointer">▼</div>
      <div ref={wheelContainerRef} className="wheel-container-lib"></div>
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

export default WheelComponent;
