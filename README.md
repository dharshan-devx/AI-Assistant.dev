# AI Assistant

A modern AI assistant web application built with React, TypeScript, and OpenAI API. Features include question answering, text summarization, creative content generation, and advice giving.

## 🚀 Quick Deploy to Vercel

### Prerequisites
- Node.js 18+ installed
- OpenAI API key
- Vercel account

### Deployment Steps

1. **Clone and Setup**
   ```bash
   git clone <your-repo-url>
   cd AI-Assistant.dev-fix-cleanup
   npm install
   ```

2. **Deploy to Vercel**
   
   **Option A: Using the deployment script (Windows)**
   ```bash
   deploy.bat
   ```
   
   **Option B: Using the deployment script (Mac/Linux)**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```
   
   **Option C: Manual deployment**
   ```bash
   npm run build
   vercel --prod
   ```

3. **Set Environment Variables**
   - Go to your Vercel dashboard
   - Navigate to Settings > Environment Variables
   - Add: `OPENAI_API_KEY` = your OpenAI API key

4. **Test Your Deployment**
   - Visit your Vercel URL
   - Try asking a question: `[question] What is the capital of France?`

## 🛠️ Local Development

### Setup
```bash
# Install dependencies
npm install

# Create .env file
echo "OPENAI_API_KEY=your-api-key-here" > .env

# Start development server
npm run dev
```

### Development Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run check` - Type checking
- `npm start` - Start production server

## 📁 Project Structure

```
├── api/
│   └── index.js              # Vercel serverless API function
├── client/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and configurations
│   │   └── pages/           # Page components
│   └── index.html           # HTML template
├── server/                  # Backend server (for local development)
├── shared/                  # Shared schemas and types
├── dist/                    # Built frontend (generated)
├── vercel.json             # Vercel configuration
└── package.json            # Dependencies and scripts
```

## 🔧 Features

### AI Task Types
- **[question]** - Answer factual questions
- **[summary]** - Summarize text content
- **[creative]** - Generate creative content
- **[advice]** - Provide helpful advice

### Example Usage
```
[question] What is the capital of France?
[summary] Summarize this: Artificial Intelligence is transforming industries...
[creative] Write a short story about a lonely robot.
[advice] How to improve focus while studying?
```

## 🚨 Troubleshooting

### Common Issues

1. **"OpenAI API key is required"**
   - Make sure `OPENAI_API_KEY` is set in Vercel environment variables
   - Verify the API key is valid and has sufficient credits

2. **Build failures**
   - Run `npm install` to ensure all dependencies are installed
   - Check that Node.js version is 18+
   - Verify all import paths are correct

3. **API routes not working**
   - Check Vercel Function Logs for errors
   - Verify the `api/index.js` file exists
   - Test the health endpoint: `/api/health`

4. **CORS errors**
   - The API is configured with CORS enabled
   - Check browser console for specific error messages

### Debug Commands
```bash
# Test build locally
npm run build

# Test API locally (if running server)
curl http://localhost:5000/api/health

# Check Vercel deployment
vercel ls
```

## 🔒 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | OpenAI API access key | Yes | `sk-...` |
| `NODE_ENV` | Environment mode | Yes | `production` |

## 📊 Monitoring

- **Vercel Function Logs**: Check for API errors
- **OpenAI Usage**: Monitor API costs and usage
- **Vercel Analytics**: Track performance and errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review Vercel Function Logs
3. Verify environment variables are set correctly
4. Test with a simple API call to `/api/health`

## 🔄 Updates

To update your deployment:
1. Pull the latest changes: `git pull`
2. Rebuild: `npm run build`
3. Redeploy: `vercel --prod`

---

**Note**: This application uses in-memory storage for development. For production use, consider implementing a database for persistent data storage.
