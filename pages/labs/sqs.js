import { useState } from 'react';
import Link from 'next/link';

export default function SQSLab() {
    const [step, setStep] = useState(1);
    const [tempCredentials, setTempCredentials] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');

    const getCredentials = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/create-lab-user-sqs');
            const data = await response.json();
            if (data.success) {
                setTempCredentials(data.credentials);
                setStep(2);
            } else {
                setResult(`Error: ${data.error}`);
            }
        } catch (error) {
            setResult(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setResult('✅ Copied to clipboard!');
    };

    return (
        <div
            style={{
                padding: '20px',
                maxWidth: '800px',
                margin: '0 auto',
                fontFamily: 'Arial, sans-serif',
            }}
        >
            <Link href="/" style={{ color: '#007bff', textDecoration: 'none' }}>
                ← Back to Labs
            </Link>
            <h1 style={{ textAlign: 'center', color: '#232F3E' }}>
                📬 SQS Lab - Step by Step
            </h1>

            {step === 1 && (
                <div style={{ padding: '20px' }}>
                    <h2>Step 1: Get Your AWS Credentials</h2>
                    <p>
                        Click below to generate temporary AWS credentials for
                        SQS lab:
                    </p>
                    <button
                        onClick={getCredentials}
                        disabled={loading}
                        style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '15px 30px',
                            fontSize: '16px',
                            borderRadius: '5px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? 'Generating...' : 'Get Credentials'}
                    </button>
                </div>
            )}

            {step === 2 && tempCredentials && (
                <div style={{ padding: '20px' }}>
                    <h2>Step 2: Your AWS Credentials</h2>
                    <p>Use these credentials to login to AWS Console:</p>

                    <div
                        style={{
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '5px',
                            marginBottom: '20px',
                        }}
                    >
                        <div style={{ marginBottom: '15px' }}>
                            <strong>Access Key ID:</strong>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}
                            >
                                <code
                                    style={{
                                        backgroundColor: '#e9ecef',
                                        padding: '5px',
                                        borderRadius: '3px',
                                        flex: 1,
                                    }}
                                >
                                    {tempCredentials.accessKey}
                                </code>
                                <button
                                    onClick={() =>
                                        copyToClipboard(
                                            tempCredentials.accessKey
                                        )
                                    }
                                    style={{
                                        padding: '5px 10px',
                                        fontSize: '12px',
                                    }}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <strong>Secret Access Key:</strong>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}
                            >
                                <code
                                    style={{
                                        backgroundColor: '#e9ecef',
                                        padding: '5px',
                                        borderRadius: '3px',
                                        flex: 1,
                                    }}
                                >
                                    {tempCredentials.secretKey}
                                </code>
                                <button
                                    onClick={() =>
                                        copyToClipboard(
                                            tempCredentials.secretKey
                                        )
                                    }
                                    style={{
                                        padding: '5px 10px',
                                        fontSize: '12px',
                                    }}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <strong>Session Token:</strong>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}
                            >
                                <code
                                    style={{
                                        backgroundColor: '#e9ecef',
                                        padding: '5px',
                                        borderRadius: '3px',
                                        flex: 1,
                                        fontSize: '10px',
                                    }}
                                >
                                    {tempCredentials.sessionToken}
                                </code>
                                <button
                                    onClick={() =>
                                        copyToClipboard(
                                            tempCredentials.sessionToken
                                        )
                                    }
                                    style={{
                                        padding: '5px 10px',
                                        fontSize: '12px',
                                    }}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>

                    <h3>Step 3: Login to AWS Console</h3>
                    <ol>
                        <li>
                            Open{' '}
                            <a
                                href="https://console.aws.amazon.com"
                                target="_blank"
                                style={{ color: '#007bff' }}
                            >
                                AWS Console
                            </a>
                        </li>
                        <li>Choose "Sign in with access keys"</li>
                        <li>Enter the credentials above</li>
                        <li>Navigate to SQS (Simple Queue Service)</li>
                        <li>Click "Create queue"</li>
                    </ol>

                    <h3>Step 4: Create SQS Queue</h3>
                    <ul>
                        <li>Type: Standard</li>
                        <li>
                            Name: <code>my-lab-queue</code>
                        </li>
                        <li>Visibility timeout: 30 seconds</li>
                        <li>Message retention period: 4 days</li>
                        <li>Delivery delay: 0 seconds</li>
                        <li>Maximum message size: 256 KB</li>
                        <li>Click "Create queue"</li>
                    </ul>

                    <h3>Step 5: Send Message</h3>
                    <ul>
                        <li>Click on your queue name</li>
                        <li>Click "Send and receive messages"</li>
                        <li>
                            Message body: <code>Hello from SQS Lab!</code>
                        </li>
                        <li>Click "Send message"</li>
                    </ul>

                    <h3>Step 6: Receive Message</h3>
                    <ul>
                        <li>Click "Poll for messages"</li>
                        <li>View the received message</li>
                        <li>Click on message to see details</li>
                        <li>Click "Delete" to remove message from queue</li>
                    </ul>

                    <div
                        style={{
                            backgroundColor: '#fff3cd',
                            padding: '15px',
                            borderRadius: '5px',
                            marginTop: '20px',
                        }}
                    >
                        <strong>⏰ Note:</strong> These credentials expire in 1
                        hour
                    </div>

                    <button
                        onClick={() => setStep(3)}
                        style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '15px 30px',
                            fontSize: '16px',
                            borderRadius: '5px',
                            marginTop: '20px',
                        }}
                    >
                        I've completed the lab ✅
                    </button>
                </div>
            )}

            {step === 3 && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <h2>🎉 Lab Complete!</h2>
                    <p>
                        Great job! You've learned how to create SQS queues and
                        send/receive messages.
                    </p>
                    <Link href="/" style={{ color: '#007bff' }}>
                        Try Another Lab
                    </Link>
                </div>
            )}

            {result && (
                <div
                    style={{
                        marginTop: '20px',
                        padding: '15px',
                        borderRadius: '5px',
                        backgroundColor: result.includes('✅')
                            ? '#d4edda'
                            : '#f8d7da',
                    }}
                >
                    {result}
                </div>
            )}
        </div>
    );
}
