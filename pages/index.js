import { useState } from 'react';

export default function Home() {
  const [credentials, setCredentials] = useState({ accessKey: '', secretKey: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/create-ec2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      setResult(data.success ? `EC2 Created: ${data.instanceId}` : `Error: ${data.error}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>EC2 Creation Lab</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Access Key"
            value={credentials.accessKey}
            onChange={(e) => setCredentials({...credentials, accessKey: e.target.value})}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            placeholder="Secret Key"
            value={credentials.secretKey}
            onChange={(e) => setCredentials({...credentials, secretKey: e.target.value})}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Creating...' : 'Create EC2'}
        </button>
      </form>
      {result && <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>{result}</div>}
    </div>
  );
}
