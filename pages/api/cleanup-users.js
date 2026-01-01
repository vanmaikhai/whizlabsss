import AWS from 'aws-sdk';
import { requireAuth, rateLimit } from '../../middleware/auth';

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const iam = new AWS.IAM({
            accessKeyId: process.env.AWS_ADMIN_ACCESS_KEY,
            secretAccessKey: process.env.AWS_ADMIN_SECRET_KEY,
            region: 'us-east-1',
        });

        // List all lab users (older than 2 hours)
        const users = await iam
            .listUsers({ PathPrefix: '/lab-users/' })
            .promise();
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

        let deletedCount = 0;

        for (const user of users.Users) {
            if (user.CreateDate < twoHoursAgo) {
                try {
                    // Detach all policies
                    const attachedPolicies = await iam
                        .listAttachedUserPolicies({
                            UserName: user.UserName,
                        })
                        .promise();

                    for (const policy of attachedPolicies.AttachedPolicies) {
                        await iam
                            .detachUserPolicy({
                                UserName: user.UserName,
                                PolicyArn: policy.PolicyArn,
                            })
                            .promise();
                    }

                    // Delete login profile
                    try {
                        await iam
                            .deleteLoginProfile({
                                UserName: user.UserName,
                            })
                            .promise();
                    } catch (e) {
                        // Login profile might not exist
                    }

                    // Delete user
                    await iam
                        .deleteUser({
                            UserName: user.UserName,
                        })
                        .promise();

                    deletedCount++;
                } catch (error) {
                    console.error(
                        `Failed to delete user ${user.UserName}:`,
                        error
                    );
                }
            }
        }

        res.status(200).json({
            success: true,
            message: `Cleaned up ${deletedCount} expired lab users`,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export default handler;
