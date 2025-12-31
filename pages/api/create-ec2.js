import AWS from 'aws-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { accessKey, secretKey } = req.body;

  if (!accessKey || !secretKey) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  try {
    const ec2 = new AWS.EC2({
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
      region: 'us-east-1'
    });

    const params = {
      ImageId: 'ami-0c02fb55956c7d316', // Amazon Linux 2
      InstanceType: 't2.micro',
      MinCount: 1,
      MaxCount: 1,
      TagSpecifications: [{
        ResourceType: 'instance',
        Tags: [{ Key: 'Name', Value: 'Lab-EC2-Instance' }]
      }]
    };

    const result = await ec2.runInstances(params).promise();
    const instanceId = result.Instances[0].InstanceId;

    res.status(200).json({ success: true, instanceId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
