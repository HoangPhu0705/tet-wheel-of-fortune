# 🧧 Tet Lucky Spin - Wheel of Fortune

A festive web application for distributing Tet (Lunar New Year) lucky money (Lì Xì) to employees through an interactive spinning wheel game.

## 🎯 Features

### User Features

- **Interactive Spin Wheel**: Beautiful animated wheel with customizable prize sectors
- **Prize Distribution**: Multiple prize tiers (100K to 500K VND)
- **Result Display**: Animated result modals with custom New Year wishes
- **Fair Play**: Each employee gets one spin opportunity

### Admin Features

- **Settings Page**:
  - Configure prize quantities for each tier
  - Customize wheel colors for each prize
  - Edit custom messages for each prize
  - Set conditional logic for high-value prizes
  - System reset functionality

- **Dashboard**:
  - Real-time budget tracking (total, spent, remaining)
  - Prize inventory overview
  - Spin history and statistics
  - Success rate analytics
  - Visual progress indicators

### Smart Features

- **Budget Management**: Automatically tracks spending and prevents exceeding budget
- **Conditional Prize Logic**: Configure minimum spins before high-value prizes (500K) can appear
- **Weighted Random Selection**: Lower value prizes have higher probability
- **Local Storage**: All data persists in browser localStorage
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Start the development server:**

```bash
npm run dev
```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready to deploy to any static hosting service.

## 📁 Project Structure

```
tet-wheel-of-fortune/
├── src/
│   ├── components/
│   │   ├── Wheel.jsx          # Spinning wheel component
│   │   └── Wheel.css
│   ├── context/
│   │   └── PrizeContext.jsx   # State management
│   ├── pages/
│   │   ├── SpinPage.jsx       # Main spin page
│   │   ├── SpinPage.css
│   │   ├── SettingsPage.jsx   # Admin settings
│   │   ├── SettingsPage.css
│   │   ├── DashboardPage.jsx  # Admin dashboard
│   │   └── DashboardPage.css
│   ├── App.jsx                # Main app component
│   ├── App.css
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── index.html
├── vite.config.js
└── package.json
```

## 🎨 Default Configuration

### Total Budget

- **20,000,000 VND** (~100 employees)

### Prize Tiers

| Prize | Quantity | Total Value |
| ----- | -------- | ----------- |
| 500K  | 1        | 500,000     |
| 400K  | 2        | 800,000     |
| 300K  | 3        | 900,000     |
| 250K  | 5        | 1,250,000   |
| 200K  | 8        | 1,600,000   |
| 150K  | 12       | 1,800,000   |
| 100K  | 20       | 2,000,000   |

### High-Value Prize Logic

- 500K prize only appears after **10-20 spins**
- Counter resets after each high-value win
- Can be disabled in settings

## 🛠️ Customization

### Modify Prize Configuration

1. Navigate to **Settings** page
2. Adjust quantities for each prize tier
3. Change colors using the color picker
4. Edit custom messages for each prize
5. Configure high-value prize conditions

### Reset System

1. Go to **Settings** page
2. Scroll to "Danger Zone"
3. Click "Reset System"
4. Confirm the action

⚠️ **Warning**: This will reset all data including spin history and custom configurations!

## 📊 Usage Tips

### For Admins

1. **Before Event**: Configure prizes and check budget in Settings
2. **During Event**: Monitor Dashboard for real-time statistics
3. **After Event**: Review spin history and final budget usage

### For Users

1. Visit the main page (Spin page)
2. Click "QUAY THƯỞNG" button
3. Wait for the wheel to stop
4. View your result and New Year wishes!

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 💾 Data Storage

All data is stored in browser's **localStorage**:

- Prize configurations
- Spin history
- Budget tracking
- High-value spin counter

**Note**: Clearing browser data will reset the application.

## 🎨 Color Scheme

The app features a festive Tet theme with:

- Red (#FF3B3F) - Primary color, symbolizing luck
- Gold (#FFD700) - Prosperity and wealth
- Orange (#FF8C00) - Warmth and happiness
- Custom colors for each prize tier

## 🔒 Security Notes

This is a **client-side only** application. For production use:

- Consider adding authentication
- Implement server-side validation
- Add database for persistent storage
- Implement one-spin-per-employee enforcement

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest features
- Submit pull requests

## 🎊 Happy Lunar New Year!

Chúc mừng năm mới! 🧧
An khang thịnh vượng! 🌸
Vạn sự như ý! 💰
