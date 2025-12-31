# EC2 Creation Lab

Simple Next.js lab for creating AWS EC2 instances with user credentials.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Usage

1. Enter your AWS Access Key and Secret Key
2. Click "Create EC2" button
3. View the created instance ID or error message

## Features

- Creates t2.micro EC2 instance with Amazon Linux 2
- Uses us-east-1 region by default
- Tags instance as "Lab-EC2-Instance"

## Environment Variables

Copy `.env.example` to `.env.local` and modify if needed:

```
AWS_REGION=us-east-1
AWS_DEFAULT_INSTANCE_TYPE=t2.micro
AWS_DEFAULT_AMI=ami-0c02fb55956c7d316
```

## Security Note

Never commit AWS credentials to version control. This lab accepts credentials via form input for educational purposes only.
