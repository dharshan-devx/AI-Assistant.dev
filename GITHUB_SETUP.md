# GitHub & Vercel Setup Guide

## Quick Setup Commands

### 1. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: AI Assistant with prompt engineering"
```

### 2. Create GitHub Repository
1. Go to [github.com](https://github.com) and create a new repository
2. Copy the repository URL
3. Connect your local repository:

```bash
git remote add origin https://github.com/dharshan-devx/AI-Assistant.Dev.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)
1. Visit [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub repository
4. Configure:
   - **Framework Preset**: Other
   - **Build Command**: `./build.sh`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Node.js Version**: 18.x

#### Option B: Vercel CLI
```bash
npm i -g vercel
vercel
```

### 4. Environment Variables
Add in Vercel dashboard under Settings > Environment Variables:
```
OPENAI_API_KEY=your_openai_api_key_here
```

## File Structure for Deployment

```
project/
├── dist/                  # Build output (auto-generated)
│   ├── public/           # Client static files
│   └── index.js          # Server bundle
├── client/               # React frontend source
├── server/               # Express backend source
├── shared/               # Shared types/schemas
├── build.js              # Custom build script
├── start.js              # Production start script
├── vercel.json           # Vercel configuration
├── .gitignore            # Git ignore rules
├── .env.example          # Environment template
└── README.md             # Project documentation
```

## Manual Build Testing

### Local Build Test
```bash
# Build the project
node build.js

# Test production locally
node start.js
```

### Verify Build Output
```bash
# Check files exist
ls -la dist/
ls -la dist/public/

# Test server bundle
node -e "console.log('Server bundle loads successfully')" dist/index.js
```

## Troubleshooting

### Common Issues

1. **Build fails with missing dependencies**
   ```bash
   npm install
   ```

2. **Environment variables not loading**
   - Ensure `.env` file exists locally
   - Verify Vercel environment variables are set

3. **Static files not serving**
   - Check `dist/public/` contains built client files
   - Verify `vercel.json` routing configuration

4. **API routes not working**
   - Ensure `dist/index.js` exists and is executable
   - Check OpenAI API key is valid and has credits

### Build Script Details

The custom build script (`build.js`):
1. Creates `dist` directory
2. Builds React client with Vite to `dist/public/`
3. Bundles Node.js server with esbuild to `dist/index.js`
4. Excludes external dependencies from bundle

### Vercel Configuration

`vercel.json` handles:
- API routes → `dist/index.js`
- Static files → `dist/public/`
- 30-second function timeout
- Node.js environment

## Success Checklist

- [ ] Repository created on GitHub
- [ ] Code pushed to main branch
- [ ] Vercel project connected
- [ ] Environment variables configured
- [ ] Build completes successfully
- [ ] Application loads in browser
- [ ] AI responses working correctly
- [ ] All four task types functional

Your AI Assistant will be available at: `https://your-project.vercel.app`