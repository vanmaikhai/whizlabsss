import AWS from 'aws-sdk';
import { requireAuth, rateLimit } from '../../middleware/auth';

async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const iam = new AWS.IAM({
            accessKeyId: process.env.AWS_ADMIN_ACCESS_KEY,
            secretAccessKey: process.env.AWS_ADMIN_SECRET_KEY,
            region: 'us-east-1',
        });

        const sts = new AWS.STS({
            accessKeyId: process.env.AWS_ADMIN_ACCESS_KEY,
            secretAccessKey: process.env.AWS_ADMIN_SECRET_KEY,
            region: 'us-east-1',
        });

        const userName = `ec2-lab-user-${Date.now()}`;
        const password = generatePassword();

        // Create IAM user
        await iam
            .createUser({
                UserName: userName,
                Path: '/lab-users/',
            })
            .promise();

        // Set login password
        await iam
            .createLoginProfile({
                UserName: userName,
                Password: password,
                PasswordResetRequired: false,
            })
            .promise();

        // Attach restricted EC2 policy with VPC permissions
        const restrictedPolicy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Action: [
                        'ec2:DescribeInstances',
                        'ec2:DescribeImages',
                        'ec2:DescribeKeyPairs',
                        'ec2:DescribeSecurityGroups',
                        'ec2:DescribeVpcs',
                        'ec2:DescribeSubnets',
                        'ec2:DescribeAvailabilityZones',
                        'ec2:DescribeInstanceTypes',
                        'ec2:DescribeNetworkInterfaces',
                        'ec2:DescribeRouteTables',
                        'ec2:DescribeInternetGateways',
                        'ec2:CreateSecurityGroup',
                        'ec2:AuthorizeSecurityGroupIngress',
                        'ec2:AuthorizeSecurityGroupEgress',
                        'ec2:RevokeSecurityGroupIngress',
                        'ec2:RevokeSecurityGroupEgress',
                        'ec2:DeleteSecurityGroup',
                        'ec2:CreateTags',
                        'ec2:DeleteTags',
                    ],
                    Resource: '*'
                },
                {
                    Effect: 'Allow',
                    Action: [
                        'ec2:RunInstances',
                        'ec2:TerminateInstances'
                    ],
                    Resource: '*',
                    Condition: {
                        StringEquals: {
                            'ec2:InstanceType': ['t2.micro', 't2.small']
                        }
                    }
                }
            ],
        };

        const policyName = `EC2LabPolicy-${userName}`;
        await iam
            .createPolicy({
                PolicyName: policyName,
                PolicyDocument: JSON.stringify(restrictedPolicy),
                Path: '/lab-policies/',
            })
            .promise();

        const accountId = (await sts.getCallerIdentity().promise()).Account;
        await iam
            .attachUserPolicy({
                UserName: userName,
                PolicyArn: `arn:aws:iam::${accountId}:policy/lab-policies/${policyName}`,
            })
            .promise();

        // Remove setTimeout - use proper cleanup job instead
        const credentials = {
            username: userName,
            password: password,
            accountId: accountId,
            consoleUrl: `https://${accountId}.signin.aws.amazon.com/console`,
            expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        };

        res.status(200).json({ success: true, credentials });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

function generatePassword() {
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

export default handler;
