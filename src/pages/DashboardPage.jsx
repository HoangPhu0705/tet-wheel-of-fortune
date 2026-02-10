import React from "react";
import { usePrize } from "../context/PrizeContext";
import "./DashboardPage.css";

const DashboardPage = () => {
  const { prizes, totalBudget, spentAmount, remainingBudget, spinHistory } =
    usePrize();

  const totalSpins = spinHistory.length;
  const successfulSpins = spinHistory.filter((spin) => spin.amount > 0).length;
  const successRate =
    totalSpins > 0 ? ((successfulSpins / totalSpins) * 100).toFixed(1) : 0;
  const budgetUsedPercent = ((spentAmount / totalBudget) * 100).toFixed(1);

  const remainingPrizesCount = prizes.reduce(
    (sum, prize) => sum + prize.quantity,
    0,
  );

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1 className="page-title">📊 Bảng Điều Khiển Quản Trị</h1>

        <div className="stats-grid">
          <div className="stat-card budget-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Ngân Sách</h3>
              <div className="stat-value">
                {totalBudget.toLocaleString("vi-VN")} VND
              </div>
              <div className="stat-label">Tổng ngân sách</div>
            </div>
          </div>

          <div className="stat-card spent-card">
            <div className="stat-icon">💸</div>
            <div className="stat-info">
              <h3>Đã Chi</h3>
              <div className="stat-value">
                {spentAmount.toLocaleString("vi-VN")} VND
              </div>
              <div className="stat-label">{budgetUsedPercent}% đã sử dụng</div>
            </div>
          </div>

          <div className="stat-card remaining-card">
            <div className="stat-icon">🏦</div>
            <div className="stat-info">
              <h3>Còn Lại</h3>
              <div className="stat-value">
                {remainingBudget.toLocaleString("vi-VN")} VND
              </div>
              <div className="stat-label">
                {(100 - budgetUsedPercent).toFixed(1)}% còn lại
              </div>
            </div>
          </div>

          <div className="stat-card spins-card">
            <div className="stat-icon">🎡</div>
            <div className="stat-info">
              <h3>Lượt Quay</h3>
              <div className="stat-value">{totalSpins}</div>
              <div className="stat-label">
                {successfulSpins} lượt trúng thưởng
              </div>
            </div>
          </div>
        </div>

        <div className="progress-section card">
          <h2>📈 Tiến Độ Ngân Sách</h2>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${budgetUsedPercent}%` }}
            >
              <span className="progress-text">{budgetUsedPercent}%</span>
            </div>
          </div>
          <div className="progress-info">
            <span>Đã chi: {spentAmount.toLocaleString("vi-VN")} VND</span>
            <span>Còn lại: {remainingBudget.toLocaleString("vi-VN")} VND</span>
          </div>
        </div>

        <div className="prizes-overview card">
          <h2>🎁 Tổng Quan Giải Thưởng</h2>
          <div className="prizes-table">
            <table>
              <thead>
                <tr>
                  <th>Giải Thưởng</th>
                  <th>Giá Trị</th>
                  <th>Còn Lại</th>
                  <th>Tổng Giá Trị</th>
                  <th>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {prizes.map((prize) => {
                  const totalValue = prize.value * prize.quantity;
                  const status = prize.quantity > 0 ? "✅ Còn" : "❌ Hết";
                  return (
                    <tr key={prize.id}>
                      <td>
                        <div className="prize-label-cell">
                          <div
                            className="color-indicator"
                            style={{ backgroundColor: prize.color }}
                          ></div>
                          {prize.label}
                        </div>
                      </td>
                      <td>{prize.value.toLocaleString("vi-VN")} VND</td>
                      <td className="quantity-cell">{prize.quantity}</td>
                      <td>{totalValue.toLocaleString("vi-VN")} VND</td>
                      <td className="status-cell">{status}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2">
                    <strong>Tổng Cộng</strong>
                  </td>
                  <td>
                    <strong>{remainingPrizesCount}</strong>
                  </td>
                  <td colSpan="2">
                    <strong>
                      {prizes
                        .reduce((sum, p) => sum + p.value * p.quantity, 0)
                        .toLocaleString("vi-VN")}{" "}
                      VND
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="history-section card">
          <h2>📜 Lịch Sử Quay Toàn Bộ ({spinHistory.length} lượt)</h2>
          {spinHistory.length === 0 ? (
            <p className="no-data">Chưa có lượt quay nào.</p>
          ) : (
            <div className="history-list">
              {spinHistory.map((spin, index) => (
                <div key={index} className="history-item">
                  <div className="history-spin-number">
                    #{spin.spinNumber || spinHistory.length - index}
                  </div>
                  <div className="history-time">
                    {new Date(spin.timestamp).toLocaleString("vi-VN")}
                  </div>
                  <div className="history-prize">
                    <strong>{spin.prize}</strong>
                  </div>
                  <div
                    className={`history-amount ${spin.amount > 0 ? "won" : "lost"}`}
                  >
                    {spin.amount > 0
                      ? `+${spin.amount.toLocaleString("vi-VN")} VND`
                      : "Chúc may mắn lần sau"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="insights-section card">
          <h2>💡 Thông Tin Chi Tiết</h2>
          <div className="insights-grid">
            <div className="insight-item">
              <span className="insight-label">Tỷ lệ trúng thưởng:</span>
              <span className="insight-value">{successRate}%</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Trung bình mỗi lượt:</span>
              <span className="insight-value">
                {totalSpins > 0
                  ? (spentAmount / totalSpins).toLocaleString("vi-VN")
                  : 0}{" "}
                VND
              </span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Giải còn lại:</span>
              <span className="insight-value">{remainingPrizesCount} giải</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Lượt quay thành công:</span>
              <span className="insight-value">
                {successfulSpins}/{totalSpins}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
