# Photo Organizer Web Application

An advanced web-based photo organizer that automatically sorts your photos by date, type, and content patterns with smart rules and drag-and-drop simplicity.

## 🚀 Features

- **Drag & Drop Interface** - Simply drag photos from your computer
- **Smart Organization** - Auto-detects date patterns, file types, and naming conventions
- **Customizable Rules** - Create and modify organization rules with regex patterns
- **Real-time Preview** - See how photos will be organized before processing
- **Batch Processing** - Handle hundreds of photos with progress tracking
- **Secure & Private** - All processing happens locally in your browser
- **Mobile Friendly** - Responsive design works on all devices
- **Shareable** - Share the tool with others easily

## 🎯 Use Cases

- Organizing camera downloads and mixed photo collections
- Sorting screenshots from regular photos
- Organizing photos by date ranges (2015, 2016, 2017, etc.)
- Separating RAW files from JPEGs
- Batch organizing phone backups

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **File Processing**: HTML5 File API + JSZip
- **Pattern Matching**: Regular expressions with priority-based rules
- **Deployment Ready**: Vercel/Netlify compatible

## 📦 Installation & Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup
```bash
# Clone or download the project
cd photo-organizer-web

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Development Server
The app will be available at `http://localhost:3000`

## 🎨 Customization

### Organization Rules
The app comes with default rules for common photo patterns:
- Date-stamped photos (YYYYMMDD_HHMMSS format)
- Camera/phone numbered photos (IMG_#### format)  
- Screenshots and graphics (PNG files)
- RAW camera files
- Mobile photos

You can customize rules in the Settings panel with:
- Regular expression patterns
- Priority levels (1-20)
- Target folder names
- Descriptions

### Example Rules
```javascript
// 2023 Photos
Pattern: ^2023\d{4}_\d{6}_.*\.(jpg|jpeg|png)$
Folder: 2023 Photos
Priority: 10

// Camera Photos  
Pattern: ^(img|image)_\d+.*\.(jpg|jpeg)$
Folder: Camera Photos
Priority: 5

// Screenshots
Pattern: .*\.(png|gif|bmp|webp)$
Folder: Screenshots
Priority: 1
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Upload `build` folder to Netlify
3. Configure redirects for SPA

### Static Hosting
The built app is a static website that can be hosted anywhere:
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting
- Any web server

## 📱 Browser Support

- Chrome/Chromium (recommended)
- Firefox 
- Safari
- Edge

**Note**: File download functionality requires modern browser support for Blob APIs and JSZip.

## 🔒 Privacy & Security

- **Local Processing**: All file processing happens in your browser
- **No Server Upload**: Photos never leave your device
- **No Data Collection**: No analytics or tracking
- **Client-Side Only**: Pure frontend application

## 🤝 Contributing

This is a complete, production-ready application. Feel free to:
- Fork and customize for your needs
- Add new organization rules
- Improve the UI/UX
- Add new file format support

## 📄 License

MIT License - feel free to use in personal and commercial projects.

## 🆘 Support

For issues or questions:
1. Check the pattern tester in Rules settings
2. Ensure your browser supports modern JavaScript
3. Try with a smaller batch of files first
4. Check browser console for any errors

## 🎉 Acknowledgments

Built with modern web technologies and best practices for performance, accessibility, and user experience.
