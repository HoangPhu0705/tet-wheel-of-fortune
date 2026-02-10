import React, { createContext, useContext, useState, useEffect } from "react";

const PrizeContext = createContext();

export const usePrize = () => {
  const context = useContext(PrizeContext);
  if (!context) {
    throw new Error("usePrize must be used within a PrizeProvider");
  }
  return context;
};

const DEFAULT_PRIZES = [
  {
    id: 1,
    value: 500000,
    label: "500K",
    quantity: 1,
    color: "#FFD700",
    message: "Chúc mừng! Bạn đã trúng 500,000 VND! 🎊",
  },
  {
    id: 2,
    value: 400000,
    label: "400K",
    quantity: 2,
    color: "#FF6347",
    message: "Xuất sắc! Bạn đã trúng 400,000 VND! 🎉",
  },
  {
    id: 3,
    value: 300000,
    label: "300K",
    quantity: 3,
    color: "#FF69B4",
    message: "Tuyệt vời! Bạn đã trúng 300,000 VND! 🎈",
  },
  {
    id: 4,
    value: 250000,
    label: "250K",
    quantity: 5,
    color: "#9370DB",
    message: "Thật may mắn! Bạn đã trúng 250,000 VND! 🎁",
  },
  {
    id: 5,
    value: 200000,
    label: "200K",
    quantity: 8,
    color: "#4169E1",
    message: "Chúc mừng! Bạn đã trúng 200,000 VND! 🌟",
  },
  {
    id: 6,
    value: 150000,
    label: "150K",
    quantity: 12,
    color: "#32CD32",
    message: "Tốt lắm! Bạn đã trúng 150,000 VND! 🍀",
  },
  {
    id: 7,
    value: 100000,
    label: "100K",
    quantity: 20,
    color: "#00CED1",
    message: "Chúc mừng! Bạn đã trúng 100,000 VND! ✨",
  },
];

const BETTER_LUCK_OPTION = {
  id: 0,
  value: 0,
  label: "Chúc may mắn lần sau",
  quantity: Infinity,
  color: "#95A5A6",
  message: "Chúc bạn may mắn lần sau! Năm mới vạn sự như ý! 🧧",
};

const INITIAL_BUDGET = 20000000; // 20 million VND

export const PrizeProvider = ({ children }) => {
  // Load from localStorage or use defaults
  const [prizes, setPrizes] = useState(() => {
    const saved = localStorage.getItem("prizes");
    return saved ? JSON.parse(saved) : DEFAULT_PRIZES;
  });

  const [totalBudget] = useState(() => {
    const saved = localStorage.getItem("totalBudget");
    return saved ? parseInt(saved) : INITIAL_BUDGET;
  });

  const [spentAmount, setSpentAmount] = useState(() => {
    const saved = localStorage.getItem("spentAmount");
    return saved ? parseInt(saved) : 0;
  });

  const [spinHistory, setSpinHistory] = useState(() => {
    const saved = localStorage.getItem("spinHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentSpinNumber, setCurrentSpinNumber] = useState(() => {
    const saved = localStorage.getItem("currentSpinNumber");
    return saved ? parseInt(saved) : 0;
  });

  // scheduledSpins: { spinNumber: prizeId }
  // Example: { 5: 1, 12: 1, 8: 2 } means spin 5 and 12 get 500K (id:1), spin 8 gets 400K (id:2)
  const [scheduledSpins, setScheduledSpins] = useState(() => {
    const saved = localStorage.getItem("scheduledSpins");
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("prizes", JSON.stringify(prizes));
  }, [prizes]);

  useEffect(() => {
    localStorage.setItem("spentAmount", spentAmount.toString());
  }, [spentAmount]);

  useEffect(() => {
    localStorage.setItem("spinHistory", JSON.stringify(spinHistory));
  }, [spinHistory]);

  useEffect(() => {
    localStorage.setItem("currentSpinNumber", currentSpinNumber.toString());
  }, [currentSpinNumber]);

  useEffect(() => {
    localStorage.setItem("scheduledSpins", JSON.stringify(scheduledSpins));
  }, [scheduledSpins]);

  const remainingBudget = totalBudget - spentAmount;

  // Clean up scheduled spins that are no longer valid
  const cleanupScheduledSpins = () => {
    setScheduledSpins((prev) => {
      const cleaned = { ...prev };
      let modified = false;

      // Remove past spins
      Object.keys(cleaned).forEach((spinNum) => {
        if (parseInt(spinNum) <= currentSpinNumber) {
          delete cleaned[spinNum];
          modified = true;
        }
      });

      // Remove excess schedules if prize quantity decreased
      prizes.forEach((prize) => {
        const scheduledForPrize = Object.entries(cleaned).filter(
          ([_, prizeId]) => prizeId === prize.id,
        );

        if (scheduledForPrize.length > prize.quantity) {
          // Keep only the first N schedules (by spin number)
          const sorted = scheduledForPrize.sort(
            ([a], [b]) => parseInt(a) - parseInt(b),
          );
          sorted.slice(prize.quantity).forEach(([spinNum]) => {
            delete cleaned[spinNum];
            modified = true;
          });
        }
      });

      return modified ? cleaned : prev;
    });
  };

  // Auto-cleanup when prizes or currentSpinNumber change
  useEffect(() => {
    cleanupScheduledSpins();
  }, [prizes, currentSpinNumber]);

  // Get all prizes with quantity > 0 for DISPLAY on wheel (ignores restrictions)
  const getAllPrizesForDisplay = () => {
    return prizes.filter((prize) => prize.quantity > 0);
  };

  // Get available prizes for SELECTION
  const getAvailablePrizes = () => {
    return prizes.filter((prize) => prize.quantity > 0);
  };

  const selectPrize = () => {
    // Check if current spin number has a scheduled prize
    const nextSpinNumber = currentSpinNumber + 1;
    const scheduledPrizeId = scheduledSpins[nextSpinNumber];

    if (scheduledPrizeId) {
      const scheduledPrize = prizes.find((p) => p.id === scheduledPrizeId);
      // Verify the prize is still available
      if (
        scheduledPrize &&
        scheduledPrize.quantity > 0 &&
        scheduledPrize.value <= remainingBudget
      ) {
        return scheduledPrize;
      }
    }

    // Otherwise, use random selection
    const available = getAvailablePrizes();

    // If no prizes available or budget exhausted, return better luck
    if (available.length === 0 || remainingBudget <= 0) {
      return BETTER_LUCK_OPTION;
    }

    // Check if we can afford any prize
    const affordablePrizes = available.filter(
      (p) => p.value <= remainingBudget,
    );

    if (affordablePrizes.length === 0) {
      return BETTER_LUCK_OPTION;
    }

    // Weight-based random selection (lower value = higher probability)
    const totalWeight = affordablePrizes.reduce((sum, prize) => {
      // Inverse weight: higher value = lower weight
      const weight = 1000000 / prize.value;
      return sum + weight;
    }, 0);

    let random = Math.random() * totalWeight;

    for (const prize of affordablePrizes) {
      const weight = 1000000 / prize.value;
      random -= weight;
      if (random <= 0) {
        return prize;
      }
    }

    // Fallback
    return affordablePrizes[0];
  };

  const spin = () => {
    const selectedPrize = selectPrize();
    const nextSpinNumber = currentSpinNumber + 1;

    // Increment spin counter
    setCurrentSpinNumber(nextSpinNumber);

    // Remove the scheduled spin if it was just used
    if (scheduledSpins[nextSpinNumber]) {
      setScheduledSpins((prev) => {
        const updated = { ...prev };
        delete updated[nextSpinNumber];
        return updated;
      });
    }

    // Update prize quantity if not "better luck"
    if (selectedPrize.id !== 0) {
      setPrizes((prev) =>
        prev.map((p) =>
          p.id === selectedPrize.id ? { ...p, quantity: p.quantity - 1 } : p,
        ),
      );
      setSpentAmount((prev) => prev + selectedPrize.value);
    }

    // Update spin history
    const spinRecord = {
      timestamp: new Date().toISOString(),
      prize: selectedPrize.label,
      amount: selectedPrize.value,
      spinNumber: nextSpinNumber,
    };
    setSpinHistory((prev) => [spinRecord, ...prev]);

    return selectedPrize;
  };

  const updatePrize = (id, updates) => {
    setPrizes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  };

  const resetSystem = () => {
    setPrizes(DEFAULT_PRIZES);
    setSpentAmount(0);
    setSpinHistory([]);
    setCurrentSpinNumber(0);
    setScheduledSpins({});
    localStorage.clear();
  };

  const value = {
    prizes,
    totalBudget,
    spentAmount,
    remainingBudget,
    spinHistory,
    currentSpinNumber,
    scheduledSpins,
    setScheduledSpins,
    spin,
    updatePrize,
    resetSystem,
    getAvailablePrizes,
    getAllPrizesForDisplay,
    betterLuckOption: BETTER_LUCK_OPTION,
  };

  return (
    <PrizeContext.Provider value={value}>{children}</PrizeContext.Provider>
  );
};
