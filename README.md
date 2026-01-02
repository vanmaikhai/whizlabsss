# AWS Services Lab Platform as Whizlabs

Secure temporary AWS lab environment creation system for students.

## 🚀 Features

- **Create temporary IAM users** with restricted permissions per AWS service
- **Auto cleanup** users after 2 hours
- **Rate limiting** and authentication to protect APIs
- **Restricted permissions** - only allow necessary actions

## 🛠️ Supported Services

- **EC2** - Create/manage instances (t2.micro, t2.small only)
- **S3** - Object storage buckets
- **Lambda** - Serverless functions
- **ECS** - Container orchestration
- **SNS** - Notification service
- **SQS** - Message queuing

## 🔧 Setup

1. **Clone and install:**
```bash
git clone <repo>
cd whizlabsss
npm install
```

2. **Environment variables:**
```bash
cp .env.example .env.local
# Fill in AWS credentials and API key
```

3. **Setup cleanup cron:**
```bash
chmod +x scripts/cleanup-cron.sh
crontab -e
# Add: */30 * * * * /path/to/cleanup-cron.sh
```

4. **Run:**
```bash
npm run dev
```

## 🚀 GitHub Actions Deployment

### Required GitHub Secrets:
```
AWS_ADMIN_ACCESS_KEY=your-admin-access-key
AWS_ADMIN_SECRET_KEY=your-admin-secret-key
API_SECRET_KEY=your-strong-api-secret-key
AWS_ACCESS_KEY_ID=your-deploy-access-key
AWS_SECRET_ACCESS_KEY=your-deploy-secret-key
S3_BUCKET=your-s3-bucket-name
```

### S3 Bucket Setup:
1. Create S3 bucket with static website hosting
2. Enable public read access
3. Set index.html as index document

### Deploy Commands:
```bash
# Build for production
npm run build

# Deploy to S3
aws s3 sync out/ s3://your-bucket --delete
```

## 🔐 Security

- **API Authentication** - Requires x-api-key header
- **Rate Limiting** - 3 requests/minute for user creation
- **IAM Restrictions** - Only allow necessary actions
- **Auto Cleanup** - Users automatically deleted after 2 hours

## 📝 API Usage

```bash
# Create lab user
curl -H "x-api-key: YOUR_KEY" \
  http://localhost:3000/api/create-lab-user-ec2

# Cleanup expired users
curl -X POST -H "x-api-key: YOUR_KEY" \
  http://localhost:3000/api/cleanup-expired
```

## 🏗️ Architecture

```
Frontend (Next.js) → API Routes → AWS IAM → Temporary Users
                                      ↓
                              Auto Cleanup (Cron)
```

## ⚠️ Requirements

- Node.js 18+
- AWS Admin credentials
- Strong API secret key

## ☕ Support This Project

If this project helps you learn AWS, consider buying me a coffee!

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/khaitkdev)

**Other ways to support:**
- ⭐ Star this repository
- 🐛 Report bugs and suggest features
- 📢 Share with fellow AWS learners
- 💝 [PayPal Donation](paypal.me/khaitk)

Your support keeps this free educational resource running! 🚀
