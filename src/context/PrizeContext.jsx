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

  const [highValueSpinCount, setHighValueSpinCount] = useState(() => {
    const saved = localStorage.getItem("highValueSpinCount");
    return saved ? parseInt(saved) : 0;
  });

  const [highValueCondition, setHighValueCondition] = useState(() => {
    const saved = localStorage.getItem("highValueCondition");
    return saved
      ? JSON.parse(saved)
      : {
          minSpins: 10,
          maxSpins: 20,
          enabled: true,
          restrictedPrizes: [500000, 400000, 300000],
        };
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
    localStorage.setItem("highValueSpinCount", highValueSpinCount.toString());
  }, [highValueSpinCount]);

  useEffect(() => {
    localStorage.setItem(
      "highValueCondition",
      JSON.stringify(highValueCondition),
    );
  }, [highValueCondition]);

  const remainingBudget = totalBudget - spentAmount;

  const getAvailablePrizes = () => {
    const available = prizes.filter((prize) => prize.quantity > 0);

    // Apply high-value conditional logic for restricted prizes
    if (
      highValueCondition.enabled &&
      highValueSpinCount < highValueCondition.minSpins
    ) {
      // Filter out all restricted prizes (500K, 400K, 300K by default)
      const restrictedValues = highValueCondition.restrictedPrizes || [500000];
      return available.filter((p) => !restrictedValues.includes(p.value));
    }

    return available;
  };

  const selectPrize = () => {
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
    };
    setSpinHistory((prev) => [spinRecord, ...prev]);

    // Update high-value spin counter
    setHighValueSpinCount((prev) => {
      const newCount = prev + 1;
      // Reset counter if we reached the max threshold
      if (
        highValueCondition.enabled &&
        newCount >= highValueCondition.maxSpins
      ) {
        return 0;
      }
      return newCount;
    });

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
    setHighValueSpinCount(0);
    localStorage.clear();
  };

  const value = {
    prizes,
    totalBudget,
    spentAmount,
    remainingBudget,
    spinHistory,
    highValueCondition,
    setHighValueCondition,
    spin,
    updatePrize,
    resetSystem,
    getAvailablePrizes,
    betterLuckOption: BETTER_LUCK_OPTION,
  };

  return (
    <PrizeContext.Provider value={value}>{children}</PrizeContext.Provider>
  );
};
