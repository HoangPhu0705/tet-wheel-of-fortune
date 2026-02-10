import React, { useState } from "react";
import { usePrize } from "../context/PrizeContext";
import "./SettingsPage.css";

const SettingsPage = () => {
  const {
    prizes,
    updatePrize,
    scheduledSpins,
    setScheduledSpins,
    currentSpinNumber,
    resetSystem,
    totalBudget,
  } = usePrize();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [budgetError, setBudgetError] = useState("");
  const [scheduleError, setScheduleError] = useState("");

  const calculateTotalPotentialValue = (updatedPrizes) => {
    return updatedPrizes.reduce(
      (sum, prize) => sum + prize.value * prize.quantity,
      0,
    );
  };

  const handleQuantityChange = (prizeId, newQuantity) => {
    const quantity = parseInt(newQuantity) || 0;

    // Calculate what the new total would be
    const updatedPrizes = prizes.map((p) =>
      p.id === prizeId ? { ...p, quantity } : p,
    );
    const newTotal = calculateTotalPotentialValue(updatedPrizes);

    if (newTotal > totalBudget) {
      setBudgetError(
        `Không thể cập nhật! Tổng giá trị giải thưởng (${newTotal.toLocaleString(
          "vi-VN",
        )} VND) vượt quá ngân sách (${totalBudget.toLocaleString(
          "vi-VN",
        )} VND)`,
      );
      return;
    }

    setBudgetError("");
    updatePrize(prizeId, { quantity });
  };

  const handleColorChange = (prizeId, newColor) => {
    updatePrize(prizeId, { color: newColor });
  };

  const handleMessageChange = (prizeId, newMessage) => {
    updatePrize(prizeId, { message: newMessage });
  };

  const handleAddScheduledSpin = (prizeId, spinNumber) => {
    spinNumber = parseInt(spinNumber);

    if (!spinNumber || spinNumber <= currentSpinNumber) {
      setScheduleError(
        `Số lượt quay phải lớn hơn ${currentSpinNumber} (lượt hiện tại)`,
      );
      return;
    }

    // Check if spin number is already scheduled
    if (scheduledSpins[spinNumber]) {
      setScheduleError(
        `Lượt quay ${spinNumber} đã được lên lịch cho giải khác`,
      );
      return;
    }

    // Count how many times this prize is already scheduled
    const timesScheduled = Object.values(scheduledSpins).filter(
      (id) => id === prizeId,
    ).length;
    const prize = prizes.find((p) => p.id === prizeId);

    if (timesScheduled >= prize.quantity) {
      setScheduleError(
        `Không thể lên lịch thêm! Chỉ có ${prize.quantity} giải ${prize.label}`,
      );
      return;
    }

    setScheduleError("");
    setScheduledSpins((prev) => ({
      ...prev,
      [spinNumber]: prizeId,
    }));
  };

  const handleRemoveScheduledSpin = (spinNumber) => {
    setScheduledSpins((prev) => {
      const newSchedule = { ...prev };
      delete newSchedule[spinNumber];
      return newSchedule;
    });
    setScheduleError("");
  };

  const handleReset = () => {
    resetSystem();
    setShowResetConfirm(false);
    alert("Hệ thống đã được đặt lại về mặc định!");
  };

  return (
    <div className="settings-page">
      <div className="container">
        <h1 className="page-title">⚙️ Cài Đặt Hệ Thống</h1>

        {budgetError && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            {budgetError}
          </div>
        )}

        <div className="card">
          <h2>💰 Tổng Quan Ngân Sách</h2>
          <div className="budget-summary">
            <div className="budget-item">
              <span className="budget-label">Tổng ngân sách:</span>
              <span className="budget-value">
                {totalBudget.toLocaleString("vi-VN")} VND
              </span>
            </div>
            <div className="budget-item">
              <span className="budget-label">Tổng giá trị giải thưởng:</span>
              <span className="budget-value highlight">
                {calculateTotalPotentialValue(prizes).toLocaleString("vi-VN")}{" "}
                VND
              </span>
            </div>
            <div className="budget-item">
              <span className="budget-label">Còn lại:</span>
              <span className="budget-value">
                {(
                  totalBudget - calculateTotalPotentialValue(prizes)
                ).toLocaleString("vi-VN")}{" "}
                VND
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>🎁 Cấu Hình Giải Thưởng</h2>
          <p className="section-description">
            Điều chỉnh số lượng, màu sắc và thông điệp cho từng giải thưởng
          </p>

          <div className="prizes-grid">
            {prizes.map((prize) => (
              <div key={prize.id} className="prize-config-card">
                <div
                  className="prize-header"
                  style={{ backgroundColor: prize.color }}
                >
                  <h3>{prize.label}</h3>
                </div>

                <div className="prize-config-body">
                  <div className="prize-total-value">
                    Tổng giá trị:{" "}
                    {(prize.value * prize.quantity).toLocaleString("vi-VN")} VND
                  </div>

                  <div className="form-group">
                    <label>Số lượng giải:</label>
                    <input
                      type="number"
                      min="0"
                      value={prize.quantity}
                      onChange={(e) =>
                        handleQuantityChange(prize.id, e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Màu sắc:</label>
                    <div className="color-picker-group">
                      <input
                        type="color"
                        value={prize.color}
                        onChange={(e) =>
                          handleColorChange(prize.id, e.target.value)
                        }
                      />
                      <span className="color-value">{prize.color}</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Thông điệp:</label>
                    <textarea
                      value={prize.message}
                      onChange={(e) =>
                        handleMessageChange(prize.id, e.target.value)
                      }
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>🎯 Lên Lịch Giải Thưởng</h2>
          <p className="section-description">
            Chỉ định chính xác lượt quay nào sẽ trúng giải cao (500K, 400K,
            300K). Lưu ý: Không thể lên lịch nhiều hơn số lượng giải có sẵn.
          </p>

          {scheduleError && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              {scheduleError}
            </div>
          )}

          <div className="info-box" style={{ marginBottom: "20px" }}>
            <p>
              📊 Lượt quay hiện tại: <strong>{currentSpinNumber}</strong>
            </p>
          </div>

          <div className="schedule-config">
            {[1, 2, 3].map((index) => {
              const prize = prizes[index - 1]; // 500K, 400K, 300K
              const scheduledCount = Object.values(scheduledSpins).filter(
                (id) => id === prize.id,
              ).length;

              return (
                <div key={prize.id} className="prize-schedule-card">
                  <div
                    className="schedule-header"
                    style={{ backgroundColor: prize.color }}
                  >
                    <h3>{prize.label}</h3>
                    <span className="schedule-count">
                      {scheduledCount}/{prize.quantity} đã lên lịch
                    </span>
                  </div>

                  <div className="schedule-body">
                    {/* Show existing schedules for this prize */}
                    <div className="scheduled-spins-list">
                      {Object.entries(scheduledSpins)
                        .filter(([_, prizeId]) => prizeId === prize.id)
                        .sort(([a], [b]) => parseInt(a) - parseInt(b))
                        .map(([spinNum]) => (
                          <div key={spinNum} className="scheduled-spin-item">
                            <span>Lượt {spinNum}</span>
                            <button
                              className="remove-schedule-btn"
                              onClick={() => handleRemoveScheduledSpin(spinNum)}
                              title="Xóa lịch"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      {scheduledCount === 0 && (
                        <p
                          style={{
                            color: "#999",
                            fontSize: "14px",
                            fontStyle: "italic",
                          }}
                        >
                          Chưa có lịch nào
                        </p>
                      )}
                    </div>

                    {/* Add new schedule */}
                    {scheduledCount < prize.quantity ? (
                      <div className="add-schedule">
                        <input
                          type="number"
                          min={currentSpinNumber + 1}
                          placeholder="Nhập số lượt quay"
                          className="schedule-input"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleAddScheduledSpin(prize.id, e.target.value);
                              e.target.value = "";
                            }
                          }}
                        />
                        <button
                          className="add-schedule-btn"
                          onClick={(e) => {
                            const input = e.target.previousSibling;
                            handleAddScheduledSpin(prize.id, input.value);
                            input.value = "";
                          }}
                        >
                          + Thêm lịch
                        </button>
                      </div>
                    ) : prize.quantity > 0 ? (
                      <p
                        style={{
                          color: "#ff9800",
                          fontSize: "14px",
                          marginTop: "12px",
                          fontWeight: "600",
                        }}
                      >
                        ✓ Đã lên lịch đủ {prize.quantity} giải
                      </p>
                    ) : (
                      <p
                        style={{
                          color: "#999",
                          fontSize: "14px",
                          marginTop: "12px",
                          fontStyle: "italic",
                        }}
                      >
                        Tăng số lượng giải để thêm lịch
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="info-box" style={{ marginTop: "20px" }}>
            <p>
              ℹ️ Các lượt quay đã lên lịch sẽ trúng giải tương ứng. Các lượt còn
              lại sẽ quay ngẫu nhiên theo trọng số.
            </p>{" "}
            <p style={{ marginTop: "8px", fontSize: "14px", color: "#666" }}>
              💡 Lịch sẽ tự động xóa khi: (1) lượt quay đã qua, (2) giảm số
              lượng giải dưới số lịch đã đặt.
            </p>{" "}
          </div>
        </div>

        <div className="card danger-zone">
          <button
            className="reset-button"
            onClick={() => setShowResetConfirm(true)}
          >
            Đặt Lại Hệ Thống
          </button>
          <p className="section-description">
            Các thao tác này không thể hoàn tác.!
          </p>
        </div>

        {showResetConfirm && (
          <div
            className="confirm-modal-overlay"
            onClick={() => setShowResetConfirm(false)}
          >
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
              <h3>⚠️ Xác Nhận Đặt Lại</h3>
              <p>
                Bạn có chắc chắn muốn đặt lại toàn bộ hệ thống? Tất cả dữ liệu
                về số lượt quay, lịch sử và cấu hình tùy chỉnh sẽ bị xóa.
              </p>
              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Hủy
                </button>
                <button className="confirm-button" onClick={handleReset}>
                  Xác Nhận Đặt Lại
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
