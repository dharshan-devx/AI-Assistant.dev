@echo off
echo 🚀 Starting AI Assistant deployment to Vercel...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Vercel CLI is not installed. Installing...
    npm install -g vercel
)

REM Check if we're logged in to Vercel
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo 🔐 Please log in to Vercel...
    vercel login
)

REM Build the project
echo 📦 Building the project...
npm run build

REM Check if build was successful
if not exist "dist" (
    echo ❌ Build failed! dist directory not found.
    pause
    exit /b 1
)

echo ✅ Build completed successfully!

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
vercel --prod

echo ✅ Deployment completed!
echo 📝 Don't forget to set your OPENAI_API_KEY in Vercel environment variables!
echo 🔗 You can find this in your Vercel dashboard under Settings ^> Environment Variables
pause
