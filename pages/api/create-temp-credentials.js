import AWS from 'aws-sdk';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Use your admin AWS credentials from environment
        const sts = new AWS.STS({
            accessKeyId: process.env.AWS_ADMIN_ACCESS_KEY,
            secretAccessKey: process.env.AWS_ADMIN_SECRET_KEY,
            region: 'us-east-1',
        });

        const iam = new AWS.IAM({
            accessKeyId: process.env.AWS_ADMIN_ACCESS_KEY,
            secretAccessKey: process.env.AWS_ADMIN_SECRET_KEY,
            region: 'us-east-1',
        });

        // Create temporary role for lab user
        const roleName = `EC2LabRole-${Date.now()}`;
        const policyDocument = {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: {
                        AWS: `arn:aws:iam::${await getAccountId(sts)}:root`,
                    },
                    Action: 'sts:AssumeRole',
                },
            ],
        };

        // Create role
        await iam
            .createRole({
                RoleName: roleName,
                AssumeRolePolicyDocument: JSON.stringify(policyDocument),
                Description: 'Temporary role for EC2 lab',
            })
            .promise();

        // Attach EC2 policy
        await iam
            .attachRolePolicy({
                RoleName: roleName,
                PolicyArn: 'arn:aws:iam::aws:policy/AmazonEC2FullAccess',
            })
            .promise();

        // Wait for role to be ready
        await new Promise((resolve) => setTimeout(resolve, 10000));

        // Assume the role to get temporary credentials
        const assumeRoleParams = {
            RoleArn: `arn:aws:iam::${await getAccountId(sts)}:role/${roleName}`,
            RoleSessionName: `EC2LabSession-${Date.now()}`,
            DurationSeconds: 3600, // 1 hour
        };

        const assumeRoleResult = await sts
            .assumeRole(assumeRoleParams)
            .promise();

        const credentials = {
            assumeRoleParams: assumeRoleParams,
            accessKey: assumeRoleResult.Credentials.AccessKeyId,
            secretKey: assumeRoleResult.Credentials.SecretAccessKey,
            sessionToken: assumeRoleResult.Credentials.SessionToken,
        };

        res.status(200).json({ success: true, credentials });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function getAccountId(sts) {
    const identity = await sts.getCallerIdentity().promise();
    return identity.Account;
}
