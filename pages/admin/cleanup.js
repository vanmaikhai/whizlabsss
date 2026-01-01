import { useState, useEffect } from 'react';

export default function AdminCleanup() {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const runCleanup = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/cleanup-users', {
                method: 'POST',
            });
            const data = await response.json();
            setResult(
                data.success ? `✅ ${data.message}` : `❌ Error: ${data.error}`
            );
        } catch (error) {
            setResult(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Auto cleanup every hour
    useEffect(() => {
        const interval = setInterval(runCleanup, 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            style={{
                padding: '20px',
                maxWidth: '600px',
                margin: '0 auto',
                fontFamily: 'Arial, sans-serif',
            }}
        >
            <h1>🧹 Admin Cleanup</h1>
            <p>Manage expired lab users (older than 2 hours)</p>

            <button
                onClick={runCleanup}
                disabled={loading}
                style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '15px 30px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                }}
            >
                {loading ? 'Cleaning up...' : 'Run Cleanup Now'}
            </button>

            {result && (
                <div
                    style={{
                        marginTop: '20px',
                        padding: '15px',
                        borderRadius: '5px',
                        backgroundColor: result.includes('✅')
                            ? '#d4edda'
                            : '#f8d7da',
                        color: result.includes('✅') ? '#155724' : '#721c24',
                    }}
                >
                    {result}
                </div>
            )}

            <div
                style={{
                    marginTop: '30px',
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '5px',
                }}
            >
                <h3>Auto Cleanup Info:</h3>
                <ul>
                    <li>Runs automatically every hour</li>
                    <li>Deletes users older than 2 hours</li>
                    <li>Removes all policies and login profiles</li>
                    <li>Only affects users in /lab-users/ path</li>
                </ul>
            </div>
        </div>
    );
}
