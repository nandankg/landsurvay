# Bihar Land Survey - NIC/Government Server Deployment Guide

This guide provides step-by-step instructions for deploying the Bihar Land Survey application to NIC (National Informatics Centre) or Bihar Government servers with GitHub-based CI/CD for easy maintenance.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Server Requirements](#server-requirements)
3. [Pre-Deployment Checklist](#pre-deployment-checklist)
4. [Step 1: Server Preparation](#step-1-server-preparation)
5. [Step 2: Install Required Software](#step-2-install-required-software)
6. [Step 3: PostgreSQL Database Setup](#step-3-postgresql-database-setup)
7. [Step 4: Backend API Deployment](#step-4-backend-api-deployment)
8. [Step 5: Admin Web App Deployment](#step-5-admin-web-app-deployment)
9. [Step 6: Nginx Configuration](#step-6-nginx-configuration)
10. [Step 7: SSL/HTTPS Setup](#step-7-sslhttps-setup)
11. [Step 8: GitHub CI/CD Setup](#step-8-github-cicd-setup)
12. [Step 9: Process Management with PM2](#step-9-process-management-with-pm2)
13. [Step 10: Firewall & Security](#step-10-firewall--security)
14. [Maintenance & Updates](#maintenance--updates)
15. [Backup & Recovery](#backup--recovery)
16. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        NIC/Government Server                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                         Nginx                                │ │
│  │         (Reverse Proxy + SSL + Static Files)                │ │
│  └─────────────────┬───────────────────┬───────────────────────┘ │
│                    │                   │                          │
│         ┌──────────▼──────────┐ ┌──────▼──────────┐              │
│         │   Admin Portal      │ │   Backend API   │              │
│         │   (Static Files)    │ │   (Node.js)     │              │
│         │   Port: 80/443      │ │   Port: 3000    │              │
│         └─────────────────────┘ └────────┬────────┘              │
│                                          │                        │
│                               ┌──────────▼──────────┐            │
│                               │    PostgreSQL       │            │
│                               │    Database         │            │
│                               │    Port: 5432       │            │
│                               └─────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ GitHub Webhook
                                    ▼
                    ┌───────────────────────────────┐
                    │         GitHub Repository      │
                    │    (Source Code + CI/CD)      │
                    └───────────────────────────────┘
```

---

## Server Requirements

### Minimum Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 vCPU | 4 vCPU |
| RAM | 4 GB | 8 GB |
| Storage | 50 GB SSD | 100 GB SSD |
| Network | 100 Mbps | 1 Gbps |

### Software Requirements

| Software | Version | Purpose |
|----------|---------|---------|
| OS | Ubuntu 20.04/22.04 LTS or RHEL 8/9 | Server Operating System |
| Node.js | 18.x LTS or 20.x LTS | Backend Runtime |
| PostgreSQL | 14 or 15 | Database |
| Nginx | 1.18+ | Reverse Proxy & Web Server |
| Git | 2.x | Version Control |
| PM2 | Latest | Process Manager |

---

## Pre-Deployment Checklist

- [ ] Server access credentials (SSH)
- [ ] Domain name configured (e.g., `biharland.gov.in`)
- [ ] SSL certificate (or use Let's Encrypt)
- [ ] GitHub repository created
- [ ] GitHub SSH key for server
- [ ] Firewall ports: 22 (SSH), 80 (HTTP), 443 (HTTPS), 5432 (PostgreSQL - internal only)
- [ ] NIC network team approval for required ports

---

## Step 1: Server Preparation

### 1.1 Connect to Server

```bash
# SSH into the server
ssh username@server-ip-address

# Or using key-based authentication
ssh -i /path/to/private-key.pem username@server-ip-address
```

### 1.2 Update System

**For Ubuntu/Debian:**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git vim htop unzip
```

**For RHEL/CentOS:**
```bash
sudo yum update -y
sudo yum install -y curl wget git vim htop unzip
```

### 1.3 Create Application User

```bash
# Create dedicated user for the application
sudo useradd -m -s /bin/bash biharland
sudo usermod -aG sudo biharland  # Ubuntu
# sudo usermod -aG wheel biharland  # RHEL/CentOS

# Set password
sudo passwd biharland

# Switch to application user
sudo su - biharland
```

### 1.4 Create Directory Structure

```bash
# Create application directories
mkdir -p ~/apps/bihar-land
mkdir -p ~/apps/bihar-land/backend
mkdir -p ~/apps/bihar-land/admin
mkdir -p ~/apps/bihar-land/uploads
mkdir -p ~/apps/bihar-land/logs
mkdir -p ~/apps/bihar-land/backups
```

---

## Step 2: Install Required Software

### 2.1 Install Node.js (Using NVM - Recommended)

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node.js LTS
nvm install 20
nvm use 20
nvm alias default 20

# Verify installation
node --version  # Should show v20.x.x
npm --version
```

### 2.2 Install PostgreSQL

**For Ubuntu:**
```bash
# Add PostgreSQL repository
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update

# Install PostgreSQL 15
sudo apt install -y postgresql-15 postgresql-contrib-15

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**For RHEL/CentOS:**
```bash
# Add PostgreSQL repository
sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm
sudo dnf -qy module disable postgresql

# Install PostgreSQL 15
sudo dnf install -y postgresql15-server postgresql15-contrib

# Initialize and start
sudo /usr/pgsql-15/bin/postgresql-15-setup initdb
sudo systemctl start postgresql-15
sudo systemctl enable postgresql-15
```

### 2.3 Install Nginx

**For Ubuntu:**
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

**For RHEL/CentOS:**
```bash
sudo dnf install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2.4 Install PM2 (Process Manager)

```bash
npm install -g pm2

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions shown
```

---

## Step 3: PostgreSQL Database Setup

### 3.1 Configure PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql
```

```sql
-- Create database user
CREATE USER bihar_land_user WITH PASSWORD 'your_secure_password_here';

-- Create database with UTF-8 encoding (required for Hindi support)
CREATE DATABASE bihar_land_db
  WITH ENCODING 'UTF8'
  LC_COLLATE='en_US.UTF-8'
  LC_CTYPE='en_US.UTF-8'
  TEMPLATE=template0
  OWNER bihar_land_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE bihar_land_db TO bihar_land_user;

-- Connect to the database and grant schema privileges
\c bihar_land_db
GRANT ALL ON SCHEMA public TO bihar_land_user;

-- Exit
\q
```

### 3.2 Configure PostgreSQL Authentication

```bash
# Edit pg_hba.conf
sudo vim /etc/postgresql/15/main/pg_hba.conf  # Ubuntu
# sudo vim /var/lib/pgsql/15/data/pg_hba.conf  # RHEL

# Add this line (for local connections):
# local   bihar_land_db   bihar_land_user                 md5
# host    bihar_land_db   bihar_land_user   127.0.0.1/32  md5

# Restart PostgreSQL
sudo systemctl restart postgresql  # Ubuntu
# sudo systemctl restart postgresql-15  # RHEL
```

### 3.3 Test Database Connection

```bash
psql -U bihar_land_user -d bihar_land_db -h localhost
# Enter password when prompted
# \q to exit
```

---

## Step 4: Backend API Deployment

### 4.1 Clone Repository

```bash
cd ~/apps/bihar-land

# Clone from GitHub (replace with your repository URL)
git clone https://github.com/YOUR_ORG/bihar-land-survey.git repo

# Or if private repository, setup SSH key first
ssh-keygen -t ed25519 -C "biharland-server"
cat ~/.ssh/id_ed25519.pub
# Add this key to GitHub repository as deploy key
```

### 4.2 Setup Backend

```bash
cd ~/apps/bihar-land/repo/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
vim .env
```

### 4.3 Configure Environment Variables

Edit `.env` file:

```env
# Database
DATABASE_URL="postgresql://bihar_land_user:your_secure_password_here@localhost:5432/bihar_land_db"

# JWT Secret (generate a secure random string)
JWT_SECRET="generate-a-very-long-random-string-here-minimum-32-characters"

# Server Configuration
NODE_ENV=production
PORT=3000

# File Upload
MAX_FILES=7
UPLOAD_DIR=uploads

# CORS - Add your domain
CORS_ORIGINS=https://admin.biharland.gov.in,https://biharland.gov.in
```

### 4.4 Generate JWT Secret

```bash
# Generate secure random string
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4.5 Setup Database Schema

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data (admin user)
npx prisma db seed
```

### 4.6 Create Uploads Directory with Proper Permissions

```bash
mkdir -p ~/apps/bihar-land/repo/backend/uploads
chmod 755 ~/apps/bihar-land/repo/backend/uploads
```

### 4.7 Test Backend Locally

```bash
# Start backend temporarily to test
npm start

# In another terminal, test the API
curl http://localhost:3000/api/health
# Should return: {"success":true,"message":"Bihar Land API is running"...}

# Stop with Ctrl+C after testing
```

---

## Step 5: Admin Web App Deployment

### 5.1 Build Admin Portal

```bash
cd ~/apps/bihar-land/repo/admin

# Install dependencies
npm install

# Create production environment file
echo "VITE_API_URL=https://api.biharland.gov.in/api" > .env.production

# Build for production
npm run build

# The built files are in 'dist' folder
ls -la dist/
```

### 5.2 Copy Build to Web Server Directory

```bash
# Create web directory
sudo mkdir -p /var/www/bihar-land-admin

# Copy built files
sudo cp -r dist/* /var/www/bihar-land-admin/

# Set permissions
sudo chown -R www-data:www-data /var/www/bihar-land-admin  # Ubuntu
# sudo chown -R nginx:nginx /var/www/bihar-land-admin  # RHEL
```

---

## Step 6: Nginx Configuration

### 6.1 Create Nginx Configuration for Admin Portal

```bash
sudo vim /etc/nginx/sites-available/bihar-land-admin
```

Add the following configuration:

```nginx
# Admin Portal - Static Site
server {
    listen 80;
    server_name admin.biharland.gov.in;

    root /var/www/bihar-land-admin;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # SPA routing - all routes go to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

### 6.2 Create Nginx Configuration for Backend API

```bash
sudo vim /etc/nginx/sites-available/bihar-land-api
```

Add the following configuration:

```nginx
# Backend API - Reverse Proxy
server {
    listen 80;
    server_name api.biharland.gov.in;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Max upload size (for documents)
    client_max_body_size 50M;

    # API proxy
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Health check endpoint (no caching)
    location /api/health {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }
}
```

### 6.3 Enable Sites

**For Ubuntu (sites-available/sites-enabled structure):**
```bash
# Enable sites
sudo ln -s /etc/nginx/sites-available/bihar-land-admin /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/bihar-land-api /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

**For RHEL/CentOS (conf.d structure):**
```bash
# Copy to conf.d
sudo cp /etc/nginx/sites-available/bihar-land-admin /etc/nginx/conf.d/bihar-land-admin.conf
sudo cp /etc/nginx/sites-available/bihar-land-api /etc/nginx/conf.d/bihar-land-api.conf

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 7: SSL/HTTPS Setup

### Option A: Using Let's Encrypt (Recommended for Testing)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx  # Ubuntu
# sudo dnf install -y certbot python3-certbot-nginx  # RHEL

# Obtain certificates
sudo certbot --nginx -d admin.biharland.gov.in -d api.biharland.gov.in

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

### Option B: Using NIC/Government SSL Certificate

```bash
# Create SSL directory
sudo mkdir -p /etc/nginx/ssl

# Copy your SSL certificate files (provided by NIC)
sudo cp your_certificate.crt /etc/nginx/ssl/biharland.crt
sudo cp your_private_key.key /etc/nginx/ssl/biharland.key
sudo cp your_ca_bundle.crt /etc/nginx/ssl/ca-bundle.crt

# Set permissions
sudo chmod 600 /etc/nginx/ssl/*.key
sudo chmod 644 /etc/nginx/ssl/*.crt
```

Update Nginx configurations to use SSL:

```nginx
# Add to both server blocks
server {
    listen 80;
    server_name admin.biharland.gov.in;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.biharland.gov.in;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/biharland.crt;
    ssl_certificate_key /etc/nginx/ssl/biharland.key;
    ssl_trusted_certificate /etc/nginx/ssl/ca-bundle.crt;

    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # HSTS (optional - be careful in government networks)
    # add_header Strict-Transport-Security "max-age=31536000" always;

    # ... rest of your configuration
}
```

---

## Step 8: GitHub CI/CD Setup

### 8.1 Create Deployment Script on Server

```bash
vim ~/apps/bihar-land/deploy.sh
```

```bash
#!/bin/bash
# Bihar Land Survey - Deployment Script

set -e

APP_DIR=~/apps/bihar-land/repo
LOG_FILE=~/apps/bihar-land/logs/deploy.log

echo "$(date): Starting deployment..." >> $LOG_FILE

cd $APP_DIR

# Pull latest changes
echo "Pulling latest changes..."
git fetch origin main
git reset --hard origin/main

# Deploy Backend
echo "Deploying Backend..."
cd $APP_DIR/backend
npm install --production
npx prisma generate
npx prisma db push --accept-data-loss

# Restart backend with PM2
pm2 restart bihar-land-api || pm2 start npm --name "bihar-land-api" -- start

# Deploy Admin Portal
echo "Deploying Admin Portal..."
cd $APP_DIR/admin
npm install
npm run build

# Copy built files to web server
sudo cp -r dist/* /var/www/bihar-land-admin/

echo "$(date): Deployment completed successfully!" >> $LOG_FILE
echo "Deployment completed!"
```

```bash
chmod +x ~/apps/bihar-land/deploy.sh
```

### 8.2 Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy to NIC Server

on:
  push:
    branches:
      - main
  workflow_dispatch:  # Allow manual trigger

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USERNAME }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          port: ${{ secrets.SERVER_PORT }}
          script: |
            cd ~/apps/bihar-land
            ./deploy.sh
```

### 8.3 Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

| Secret Name | Value |
|-------------|-------|
| `SERVER_HOST` | Your server IP or hostname |
| `SERVER_USERNAME` | `biharland` (or your deployment user) |
| `SERVER_SSH_KEY` | Private SSH key content |
| `SERVER_PORT` | `22` (or your SSH port) |

### 8.4 Generate SSH Key for GitHub Actions

```bash
# On your local machine
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy_key

# Copy private key content for GitHub secret
cat ~/.ssh/github_deploy_key

# Copy public key to server
ssh-copy-id -i ~/.ssh/github_deploy_key.pub biharland@server-ip

# Or manually add to server
# On server:
echo "PUBLIC_KEY_CONTENT" >> ~/.ssh/authorized_keys
```

### 8.5 Alternative: Webhook-based Deployment

If GitHub Actions is not allowed, use webhook:

```bash
# Install webhook listener
npm install -g github-webhook-handler

# Create webhook server
vim ~/apps/bihar-land/webhook-server.js
```

```javascript
const http = require('http');
const crypto = require('crypto');
const { exec } = require('child_process');

const SECRET = 'your-webhook-secret';
const PORT = 9000;

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const signature = req.headers['x-hub-signature-256'];
      const hash = 'sha256=' + crypto.createHmac('sha256', SECRET).update(body).digest('hex');

      if (signature === hash) {
        console.log('Valid webhook received, deploying...');
        exec('~/apps/bihar-land/deploy.sh', (error, stdout, stderr) => {
          console.log(stdout);
          if (error) console.error(stderr);
        });
        res.writeHead(200);
        res.end('Deployment triggered');
      } else {
        res.writeHead(401);
        res.end('Unauthorized');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(PORT, () => console.log(`Webhook server running on port ${PORT}`));
```

```bash
# Start webhook server with PM2
pm2 start ~/apps/bihar-land/webhook-server.js --name "webhook-server"
```

---

## Step 9: Process Management with PM2

### 9.1 Start Backend with PM2

```bash
cd ~/apps/bihar-land/repo/backend

# Create PM2 ecosystem file
vim ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'bihar-land-api',
    script: 'src/index.js',
    instances: 'max',  // Use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '~/apps/bihar-land/logs/error.log',
    out_file: '~/apps/bihar-land/logs/out.log',
    log_file: '~/apps/bihar-land/logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    exp_backoff_restart_delay: 100
  }]
};
```

```bash
# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 process list
pm2 save

# Setup startup script
pm2 startup
# Run the command it outputs
```

### 9.2 PM2 Commands Reference

```bash
# View status
pm2 status

# View logs
pm2 logs bihar-land-api

# Restart
pm2 restart bihar-land-api

# Stop
pm2 stop bihar-land-api

# Monitor
pm2 monit
```

---

## Step 10: Firewall & Security

### 10.1 Configure UFW Firewall (Ubuntu)

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

### 10.2 Configure firewalld (RHEL/CentOS)

```bash
# Start firewalld
sudo systemctl start firewalld
sudo systemctl enable firewalld

# Allow services
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh

# Reload
sudo firewall-cmd --reload

# Check status
sudo firewall-cmd --list-all
```

### 10.3 Security Best Practices

```bash
# 1. Disable root SSH login
sudo vim /etc/ssh/sshd_config
# Set: PermitRootLogin no
# Set: PasswordAuthentication no (after setting up SSH keys)
sudo systemctl restart sshd

# 2. Install fail2ban
sudo apt install -y fail2ban  # Ubuntu
# sudo dnf install -y fail2ban  # RHEL

sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# 3. Configure automatic security updates (Ubuntu)
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## Maintenance & Updates

### Regular Update Procedure

**Option 1: Automatic (via GitHub CI/CD)**
- Push changes to `main` branch
- GitHub Actions automatically deploys

**Option 2: Manual**
```bash
# SSH to server
ssh biharland@server-ip

# Run deployment script
~/apps/bihar-land/deploy.sh
```

### Database Migrations

```bash
cd ~/apps/bihar-land/repo/backend

# Create migration
npx prisma migrate dev --name your_migration_name

# Apply migration in production
npx prisma migrate deploy
```

### Log Rotation

```bash
# Create logrotate config
sudo vim /etc/logrotate.d/bihar-land
```

```
/home/biharland/apps/bihar-land/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 biharland biharland
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

---

## Backup & Recovery

### Database Backup Script

```bash
vim ~/apps/bihar-land/backup.sh
```

```bash
#!/bin/bash
# Database Backup Script

BACKUP_DIR=~/apps/bihar-land/backups
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE=$BACKUP_DIR/bihar_land_db_$DATE.sql

# Create backup
pg_dump -U bihar_land_user -h localhost bihar_land_db > $BACKUP_FILE

# Compress
gzip $BACKUP_FILE

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: ${BACKUP_FILE}.gz"
```

```bash
chmod +x ~/apps/bihar-land/backup.sh

# Add to crontab for daily backup at 2 AM
crontab -e
# Add: 0 2 * * * ~/apps/bihar-land/backup.sh >> ~/apps/bihar-land/logs/backup.log 2>&1
```

### Restore Database

```bash
# Restore from backup
gunzip -c ~/apps/bihar-land/backups/bihar_land_db_YYYYMMDD_HHMMSS.sql.gz | psql -U bihar_land_user -h localhost bihar_land_db
```

### Document Files Backup

```bash
# Backup uploads directory
tar -czvf ~/apps/bihar-land/backups/uploads_$(date +%Y%m%d).tar.gz ~/apps/bihar-land/repo/backend/uploads
```

---

## Troubleshooting

### Common Issues

#### 1. Backend not starting
```bash
# Check PM2 logs
pm2 logs bihar-land-api --lines 100

# Check if port is in use
sudo lsof -i :3000

# Check Node.js version
node --version
```

#### 2. Database connection failed
```bash
# Test PostgreSQL connection
psql -U bihar_land_user -h localhost -d bihar_land_db

# Check PostgreSQL status
sudo systemctl status postgresql

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

#### 3. Nginx errors
```bash
# Test configuration
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log

# Check access logs
sudo tail -f /var/log/nginx/access.log
```

#### 4. Permission issues
```bash
# Fix upload directory permissions
sudo chown -R biharland:biharland ~/apps/bihar-land/repo/backend/uploads
chmod -R 755 ~/apps/bihar-land/repo/backend/uploads

# Fix admin portal permissions
sudo chown -R www-data:www-data /var/www/bihar-land-admin
```

#### 5. SSL certificate issues
```bash
# Check certificate expiry
sudo certbot certificates

# Renew certificates
sudo certbot renew

# Test SSL
curl -vI https://admin.biharland.gov.in
```

---

## Quick Reference Commands

```bash
# Deployment
~/apps/bihar-land/deploy.sh

# Backend
pm2 status
pm2 restart bihar-land-api
pm2 logs bihar-land-api

# Nginx
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl restart nginx

# PostgreSQL
sudo systemctl status postgresql
psql -U bihar_land_user -d bihar_land_db

# Logs
tail -f ~/apps/bihar-land/logs/combined.log
sudo tail -f /var/log/nginx/error.log

# Backup
~/apps/bihar-land/backup.sh
```

---

## Contact & Support

For deployment support:
- **NIC Helpdesk**: Contact your assigned NIC coordinator
- **Technical Issues**: Create issue on GitHub repository
- **Emergency**: Contact system administrator

---

## URLs (After Deployment)

| Service | URL |
|---------|-----|
| Admin Portal | `https://admin.biharland.gov.in` |
| Backend API | `https://api.biharland.gov.in/api` |
| Health Check | `https://api.biharland.gov.in/api/health` |

**Default Admin Login**: `admin` / `admin123` (Change immediately after first login!)

---

*Deployment guide created for Bihar Land Survey & Revenue application*
*Last updated: December 2024*
