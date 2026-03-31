# Deployment Guide

**Copyright (c) 2026. All Rights Reserved.**

---

## Production Deployment Options

### Option 1: Single VPS (Recommended)

Deploy both backend and frontend on one server.

#### Requirements
- Ubuntu 22.04+ or similar
- Node.js 18+
- Nginx (for frontend static serving)
- SSL certificate (Let's Encrypt)

#### Steps

1. **Clone to server**
```bash
# On your VPS
cd /opt
git clone <your-private-repo> dna-fingerprint
cd dna-fingerprint
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Configure environment**
```bash
cd backend
cp .env.example .env
nano .env  # Set your ANTHROPIC_API_KEY
```

4. **Build frontend**
```bash
cd ../frontend
npm run build
# Creates frontend/dist/
```

5. **Install PM2 for backend**
```bash
npm install -g pm2
cd ../backend
pm2 start server.js --name dna-backend
pm2 save
pm2 startup  # Follow instructions to enable auto-start
```

6. **Configure Nginx**
```nginx
# /etc/nginx/sites-available/dna-fingerprint
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # Frontend static files
    root /opt/dna-fingerprint/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Health check
    location /health {
        proxy_pass http://localhost:3001/health;
    }
}
```

7. **Enable site and reload Nginx**
```bash
sudo ln -s /etc/nginx/sites-available/dna-fingerprint /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

8. **Get SSL certificate**
```bash
sudo certbot --nginx -d your-domain.com
```

#### Verify Deployment
```bash
# Check backend
curl http://localhost:3001/health

# Check frontend serves
curl https://your-domain.com

# Check API proxying
curl https://your-domain.com/api/dimensions
```

---

### Option 2: Separate Services

Deploy backend and frontend separately (e.g., Railway + Vercel).

#### Backend (Railway/Render/DigitalOcean App Platform)

1. Push `backend/` to Git
2. Set environment variable: `ANTHROPIC_API_KEY`
3. Set start command: `node server.js`
4. Set port: `3001` (or use `$PORT`)
5. Deploy

#### Frontend (Vercel/Netlify)

1. Build command: `npm run build`
2. Output directory: `dist`
3. Set environment variable: `VITE_API_URL=https://your-backend.com`
4. Deploy

**Important:** Update `frontend/vite.config.js` to use environment variable for API URL:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
```

---

### Option 3: Docker Compose

Use Docker for containerized deployment.

#### Create `Dockerfile.backend`
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ ./
COPY shared/ ../shared/

EXPOSE 3001

CMD ["node", "server.js"]
```

#### Create `Dockerfile.frontend`
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
```

#### Create `docker-compose.yml`
```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "3001:3001"
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    restart: unless-stopped
  
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

#### Deploy
```bash
docker-compose up -d
```

---

## Security Checklist

- [ ] API key stored in environment variables (never committed)
- [ ] `.env` file in `.gitignore`
- [ ] HTTPS enabled (SSL certificate)
- [ ] Firewall configured (allow only 80, 443, 22)
- [ ] Nginx rate limiting enabled
- [ ] CORS configured properly (restrict origins in production)
- [ ] PM2 running as non-root user
- [ ] Regular security updates (`apt update && apt upgrade`)
- [ ] Backup `.env` file securely
- [ ] Monitor API usage (Anthropic dashboard)

---

## Performance Optimization

### Backend
- Enable gzip compression in Nginx
- Add Redis caching for DNA extractions (optional)
- Rate limit API endpoints
- Log rotation with PM2

### Frontend
- Build with `npm run build` (minified production bundle)
- Enable Nginx caching for static assets
- Use CDN for Chart.js (optional)
- Lazy load components

### Database (Future Enhancement)
If you add user accounts or profile storage:
- Use PostgreSQL or MongoDB
- Index dimension values for fast comparison queries
- Cache frequently accessed DNA profiles

---

## Monitoring

### PM2 Dashboard
```bash
pm2 monit
pm2 logs dna-backend --lines 100
```

### Nginx Logs
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Health Check Endpoint
```bash
curl http://localhost:3001/health
```

Response:
```json
{
  "status": "ok",
  "apiKeyConfigured": true
}
```

---

## Backup & Recovery

### What to Backup
- `backend/.env` (API key)
- Custom tolerance profiles (if saved to disk)
- Any user-generated DNA profiles

### Backup Script
```bash
#!/bin/bash
tar -czf backup-$(date +%Y%m%d).tar.gz backend/.env
# Upload to S3, Backblaze, etc.
```

---

## Scaling Considerations

### Horizontal Scaling (Multiple Instances)

If traffic grows:

1. **Load Balancer**
   - Use Nginx load balancing
   - Round-robin across multiple backend instances

2. **Shared API Key Store**
   - Store API key in environment or secrets manager
   - All instances read from same source

3. **Stateless Backend**
   - Current design is already stateless
   - No session storage required

### Rate Limiting

Protect against abuse:

```nginx
# In nginx.conf
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/m;

location /api/rewrite {
    limit_req zone=api burst=5;
    proxy_pass http://localhost:3001;
}
```

---

## Troubleshooting Deployment

### Backend won't start
```bash
cd backend
pm2 logs dna-backend
# Check for missing dependencies or env vars
```

### Frontend shows blank page
- Check browser console for errors
- Verify API URL in network tab
- Ensure `dist/` was built correctly

### API calls fail with CORS errors
Add to `backend/server.js`:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

### SSL certificate issues
```bash
sudo certbot renew --dry-run
sudo systemctl status nginx
```

---

## Cost Estimation

### Anthropic API Costs

- **Model:** Claude Sonnet 4
- **Average tokens per rewrite:** ~3000 (input + output)
- **Max iterations per rewrite:** 8
- **Worst case per article:** 8 × 3000 = 24,000 tokens

Check current pricing: https://www.anthropic.com/pricing

### Server Costs

**Basic VPS (DigitalOcean, Linode, Vultr):**
- 2 GB RAM, 1 vCPU: ~$12/month
- 4 GB RAM, 2 vCPU: ~$24/month

**Managed Platform (Railway, Render):**
- Free tier: Limited usage
- Paid: ~$5-20/month depending on usage

---

## Update Process

### Update Code
```bash
cd /opt/dna-fingerprint
git pull origin main
npm run install:all
cd frontend && npm run build
pm2 restart dna-backend
```

### Update Dependencies
```bash
npm update
cd backend && npm update
cd ../frontend && npm update
npm run build
pm2 restart dna-backend
```

---

**Copyright (c) 2026. All Rights Reserved.**
