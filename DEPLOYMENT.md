# Deployment Guide

## Quick Deploy Options

### Option 1: Netlify (Recommended)

1. **Build the project:**

```bash
npm run build
```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - Or use Netlify CLI:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Option 2: Vercel

1. **Install Vercel CLI:**

```bash
npm install -g vercel
```

2. **Deploy:**

```bash
vercel
```

### Option 3: GitHub Pages

1. **Install gh-pages:**

```bash
npm install --save-dev gh-pages
```

2. **Add to package.json scripts:**

```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

3. **Update vite.config.js:**

```javascript
export default defineConfig({
  plugins: [react()],
  base: "/tet-wheel-of-fortune/",
});
```

4. **Deploy:**

```bash
npm run deploy
```

### Option 4: Simple Web Server

1. **Build:**

```bash
npm run build
```

2. **Serve with any static file server:**

```bash
# Using Python
python -m http.server 8000 --directory dist

# Using Node.js serve
npx serve dist

# Using Apache/Nginx
# Copy dist/ contents to your web root
```

## Configuration Notes

### Base URL

If deploying to a subdirectory, update [vite.config.js](vite.config.js):

```javascript
export default defineConfig({
  plugins: [react()],
  base: "/your-subdirectory/",
});
```

### Environment Variables

This app doesn't require environment variables as it runs entirely client-side.

### Data Persistence

- Data is stored in browser's localStorage
- No backend or database required
- Each browser/device has its own data

## Production Checklist

- [ ] Test all features in production build (`npm run build && npm run preview`)
- [ ] Verify localStorage works in target browser
- [ ] Check mobile responsiveness
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Configure prize quantities appropriately
- [ ] Set correct budget amount
- [ ] Test high-value prize logic
- [ ] Prepare admin credentials (if adding authentication)

## Post-Deployment

### For Event Day

1. Navigate to Settings page
2. Verify all prize configurations
3. Check total budget
4. Test one spin to ensure everything works
5. Reset system if needed
6. Share the URL with employees

### Monitoring

1. Keep Dashboard open during event
2. Monitor remaining budget
3. Track spin statistics
4. Check for any issues

## Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### localStorage Not Working

- Ensure cookies/storage are enabled
- Check browser privacy settings
- Try different browser

### Wheel Not Spinning

- Check browser console for errors
- Verify JavaScript is enabled
- Clear browser cache

## Security Considerations

For production use, consider:

1. **Authentication**: Add login system to prevent unauthorized spins
2. **One-Spin Limit**: Implement server-side tracking
3. **Backend**: Store data in database instead of localStorage
4. **API**: Create backend API for prize distribution
5. **Audit Log**: Track all spins with timestamps and user info

## Support

For issues or questions:

- Check the main README.md
- Review browser console for errors
- Test in different browser
- Verify all dependencies are installed
