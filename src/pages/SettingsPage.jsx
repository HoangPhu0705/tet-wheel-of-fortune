import React, { useState } from "react";
import { usePrize } from "../context/PrizeContext";
import "./SettingsPage.css";

const SettingsPage = () => {
  const {
    prizes,
    updatePrize,
    highValueCondition,
    setHighValueCondition,
    resetSystem,
    totalBudget,
  } = usePrize();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [budgetError, setBudgetError] = useState("");

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

  const handleHighValueConditionChange = (field, value) => {
    setHighValueCondition((prev) => ({
      ...prev,
      [field]: field === "enabled" ? value : parseInt(value) || 0,
    }));
  };

  const handleRestrictedPrizeToggle = (prizeValue) => {
    setHighValueCondition((prev) => {
      const restrictedPrizes = prev.restrictedPrizes || [500000];
      const isRestricted = restrictedPrizes.includes(prizeValue);

      return {
        ...prev,
        restrictedPrizes: isRestricted
          ? restrictedPrizes.filter((v) => v !== prizeValue)
          : [...restrictedPrizes, prizeValue],
      };
    });
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
              <span className="budget-label">Còn lại cho "Better Luck":</span>
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
          <h2>🎯 Điều Kiện Giải Cao</h2>
          <p className="section-description">
            Cấu hình logic phân phối giải cao (500K, 400K, 300K) để kiểm soát sự
            công bằng
          </p>

          <div className="high-value-config">
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={highValueCondition.enabled}
                  onChange={(e) =>
                    handleHighValueConditionChange("enabled", e.target.checked)
                  }
                />
                Bật điều kiện giới hạn giải cao
              </label>
            </div>

            {highValueCondition.enabled && (
              <>
                <div className="form-group">
                  <label>Chọn các giải áp dụng điều kiện:</label>
                  <div
                    style={{ display: "flex", gap: "15px", marginTop: "10px" }}
                  >
                    {[
                      { value: 500000, label: "500K" },
                      { value: 400000, label: "400K" },
                      { value: 300000, label: "300K" },
                    ].map((prize) => (
                      <label
                        key={prize.value}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={(
                            highValueCondition.restrictedPrizes || [500000]
                          ).includes(prize.value)}
                          onChange={() =>
                            handleRestrictedPrizeToggle(prize.value)
                          }
                        />
                        {prize.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    Số lượt quay tối thiểu trước khi có thể trúng giải cao:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={highValueCondition.minSpins}
                    onChange={(e) =>
                      handleHighValueConditionChange("minSpins", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Đặt lại bộ đếm sau số lượt quay:</label>
                  <input
                    type="number"
                    min="1"
                    value={highValueCondition.maxSpins}
                    onChange={(e) =>
                      handleHighValueConditionChange("maxSpins", e.target.value)
                    }
                  />
                </div>

                <div className="info-box">
                  <p>
                    ℹ️ Các giải đã chọn (
                    {(highValueCondition.restrictedPrizes || [500000])
                      .map((v) => v / 1000 + "K")
                      .join(", ")}
                    ) sẽ chỉ xuất hiện sau{" "}
                    <strong>{highValueCondition.minSpins}</strong> lượt quay và
                    bộ đếm sẽ được đặt lại sau{" "}
                    <strong>{highValueCondition.maxSpins}</strong> lượt.
                  </p>
                </div>
              </>
            )}
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
