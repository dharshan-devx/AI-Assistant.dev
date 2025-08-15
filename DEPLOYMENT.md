# Vercel Deployment Guide

## Prerequisites
1. Make sure you have a Vercel account
2. Install Vercel CLI: `npm i -g vercel`
3. Have your OpenAI API key ready

## Deployment Steps

### 1. Environment Variables
Before deploying, you need to set up environment variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the following variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your actual OpenAI API key
   - **Environment**: Production (and Preview if you want)

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts to link to your Vercel project
```

#### Option B: Using GitHub Integration
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically deploy on every push

### 3. Build Configuration
The project is configured to:
- Build the React frontend using Vite
- Serve API routes through serverless functions
- Handle static file serving for the SPA

### 4. Troubleshooting

#### Common Issues:

1. **API Key Not Found**
   - Make sure `OPENAI_API_KEY` is set in Vercel environment variables
   - Check that the API key is valid and has sufficient credits

2. **Build Failures**
   - Ensure all dependencies are in `package.json`
   - Check that the build command `npm run build` works locally

3. **API Routes Not Working**
   - Verify the `api/index.js` file exists
   - Check that the routes in `vercel.json` are correct

4. **CORS Issues**
   - The API is configured with CORS enabled
   - If you still have issues, check the CORS configuration in `api/index.js`

### 5. Testing Your Deployment

1. **Health Check**: Visit `https://your-domain.vercel.app/api/health`
2. **Frontend**: Visit `https://your-domain.vercel.app`
3. **API Test**: Try making a POST request to `/api/ai/chat` with:
   ```json
   {
     "input": "[question] What is the capital of France?",
     "taskType": "question"
   }
   ```

### 6. Monitoring
- Check Vercel Function Logs for API errors
- Monitor OpenAI API usage and costs
- Use Vercel Analytics for performance insights

## File Structure for Vercel
```
├── api/
│   └── index.js          # Serverless API function
├── client/               # React frontend
├── dist/                 # Built frontend (generated)
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies and scripts
```

## Notes
- The API uses in-memory storage (data is lost between function invocations)
- For production use, consider adding a database
- The frontend is a Single Page Application (SPA)
- All API routes are prefixed with `/api/`