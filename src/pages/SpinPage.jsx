import React, { useState } from "react";
import Wheel from "../components/Wheel";
import "./SpinPage.css";

const SpinPage = () => {
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleSpinComplete = (prize) => {
    setResult(prize);
    setShowResult(true);
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setResult(null);
  };

  return (
    <div className="spin-page">
      <div className="container">
        <div className="header-section">
          <h1 className="page-title">🧧 Khai Xuân Đón Lộc 🧧</h1>
          <p className="page-subtitle">
            Chúc mừng năm mới! Hãy thử vận may của bạn!
          </p>
        </div>

        <Wheel onSpinComplete={handleSpinComplete} />

        <div className="info-card">
          <h3>🧧 Quy tắc chương trình:</h3>
          <ul>
            <li>Mỗi nhân viên được quay 1 lần</li>
            <li>Giải thưởng có giá trị từ 100,000 đến 500,000 VND</li>
            <li>Số lượng giải có hạn - hết giải sẽ bị loại khỏi vòng quay</li>
            <li>Chúc bạn may mắn và năm mới phát tài! 🍀</li>
          </ul>
        </div>
      </div>

      {showResult && result && (
        <div className="result-modal-overlay" onClick={handleCloseResult}>
          <div className="result-modal" onClick={(e) => e.stopPropagation()}>
            <div className="result-content">
              {result.value > 0 ? (
                <>
                  <div className="result-icon">🎉</div>
                  <h2 className="result-title">Chúc Mừng!</h2>
                  <div
                    className="result-amount"
                    style={{ color: result.color }}
                  >
                    {result.value.toLocaleString("vi-VN")} VND
                  </div>
                  <p className="result-message"></p>
                  <div className="tet-wishes">
                    <p> {result.message}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="result-icon">🍀</div>
                  <h2 className="result-title">Chúc May Mắn Lần Sau!</h2>
                  <div className="tet-wishes">{result.message}</div>
                </>
              )}
            </div>
            <button className="close-button" onClick={handleCloseResult}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinPage;
