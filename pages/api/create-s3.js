import AWS from 'aws-sdk';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { accessKey, secretKey, sessionToken, bucketName } = req.body;

    if (!accessKey || !secretKey || !sessionToken || !bucketName) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const s3 = new AWS.S3({
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
            sessionToken: sessionToken,
            region: 'us-east-1',
        });

        const params = {
            Bucket: bucketName,
            CreateBucketConfiguration: {
                LocationConstraint: 'us-east-1',
            },
        };

        await s3.createBucket(params).promise();

        res.status(200).json({
            success: true,
            bucketName: bucketName,
            message: 'S3 bucket created successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}
