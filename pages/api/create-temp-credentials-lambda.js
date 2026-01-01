import AWS from 'aws-sdk';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
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

        const roleName = `LambdaLabRole-${Date.now()}`;
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

        await iam
            .createRole({
                RoleName: roleName,
                AssumeRolePolicyDocument: JSON.stringify(policyDocument),
                Description: 'Temporary role for Lambda lab',
            })
            .promise();

        await iam
            .attachRolePolicy({
                RoleName: roleName,
                PolicyArn: 'arn:aws:iam::aws:policy/AWSLambda_FullAccess',
            })
            .promise();

        await iam
            .attachRolePolicy({
                RoleName: roleName,
                PolicyArn: 'arn:aws:iam::aws:policy/IAMFullAccess',
            })
            .promise();

        await new Promise((resolve) => setTimeout(resolve, 10000));

        const assumeRoleParams = {
            RoleArn: `arn:aws:iam::${await getAccountId(sts)}:role/${roleName}`,
            RoleSessionName: `LambdaLabSession-${Date.now()}`,
            DurationSeconds: 3600,
        };

        const assumeRoleResult = await sts
            .assumeRole(assumeRoleParams)
            .promise();

        const credentials = {
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
