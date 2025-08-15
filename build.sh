echo "🚀 Building AI Assistant for production..."
mkdir -p dist
echo "📦 Building client..."
npx vite build --outDir dist/public --emptyOutDir
echo "🔧 Preparing server for Vercel..."
cp -r server dist/
cp -r shared dist/
cat > dist/index.js << 'EOF'
// Vercel-compatible entry point
import { createServer } from 'http';
import app from './server/index.js';

const server = createServer(app);
export default server;
EOF

echo "✅ Build completed successfully!"
echo "📁 Output:"
echo "  - Client: dist/public/"
echo "  - Server: dist/index.js"