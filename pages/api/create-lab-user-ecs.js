import AWS from 'aws-sdk';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const iam = new AWS.IAM({
            accessKeyId: process.env.AWS_ADMIN_ACCESS_KEY,
            secretAccessKey: process.env.AWS_ADMIN_SECRET_KEY,
            region: 'us-east-1',
        });

        const userName = `ecs-lab-user-${Date.now()}`;
        const password = generatePassword();

        await iam
            .createUser({
                UserName: userName,
                Path: '/lab-users/',
            })
            .promise();

        await iam
            .createLoginProfile({
                UserName: userName,
                Password: password,
                PasswordResetRequired: false,
            })
            .promise();

        await iam
            .attachUserPolicy({
                UserName: userName,
                PolicyArn: 'arn:aws:iam::aws:policy/AmazonECS_FullAccess',
            })
            .promise();

        await iam
            .attachUserPolicy({
                UserName: userName,
                PolicyArn: 'arn:aws:iam::aws:policy/IAMFullAccess',
            })
            .promise();

        const sts = new AWS.STS({
            accessKeyId: process.env.AWS_ADMIN_ACCESS_KEY,
            secretAccessKey: process.env.AWS_ADMIN_SECRET_KEY,
            region: 'us-east-1',
        });
        const identity = await sts.getCallerIdentity().promise();
        const accountId = identity.Account;

        setTimeout(
            async () => {
                try {
                    await fetch(
                        `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/cleanup-users`,
                        {
                            method: 'POST',
                        }
                    );
                } catch (e) {
                    console.error('Cleanup failed:', e);
                }
            },
            2 * 60 * 60 * 1000
        );

        const credentials = {
            username: userName,
            password: password,
            accountId: accountId,
            consoleUrl: `https://${accountId}.signin.aws.amazon.com/console`,
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
