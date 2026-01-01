import { useState } from 'react';
import Link from 'next/link';

export default function S3Lab() {
    const [step, setStep] = useState(1);
    const [tempCredentials, setTempCredentials] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');

    const getCredentials = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/create-lab-user-s3');
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
                🪣 S3 Lab - Step by Step
            </h1>

            {step === 1 && (
                <div style={{ padding: '20px' }}>
                    <h2>Step 1: Get Your AWS Credentials</h2>
                    <p>
                        Click below to generate temporary AWS credentials for S3
                        lab:
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
                            <strong>Account ID:</strong>
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
                                    {tempCredentials.accountId}
                                </code>
                                <button
                                    onClick={() =>
                                        copyToClipboard(
                                            tempCredentials.accountId
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
                            <strong>Username:</strong>
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
                                    {tempCredentials.username}
                                </code>
                                <button
                                    onClick={() =>
                                        copyToClipboard(
                                            tempCredentials.username
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
                            <strong>Password:</strong>
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
                                    {tempCredentials.password}
                                </code>
                                <button
                                    onClick={() =>
                                        copyToClipboard(
                                            tempCredentials.password
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
                            <strong>Console URL:</strong>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}
                            >
                                <a
                                    href={tempCredentials.consoleUrl}
                                    target="_blank"
                                    style={{
                                        backgroundColor: '#e9ecef',
                                        padding: '5px',
                                        borderRadius: '3px',
                                        flex: 1,
                                        textDecoration: 'none',
                                        color: '#007bff',
                                    }}
                                >
                                    {tempCredentials.consoleUrl}
                                </a>
                                <button
                                    onClick={() =>
                                        copyToClipboard(
                                            tempCredentials.consoleUrl
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
                            Click the Console URL above (or open{' '}
                            <a
                                href={tempCredentials.consoleUrl}
                                target="_blank"
                                style={{ color: '#007bff' }}
                            >
                                this link
                            </a>
                            )
                        </li>
                        <li>
                            Enter Account ID:{' '}
                            <code>{tempCredentials.accountId}</code>
                        </li>
                        <li>
                            Enter Username:{' '}
                            <code>{tempCredentials.username}</code>
                        </li>
                        <li>
                            Enter Password:{' '}
                            <code>{tempCredentials.password}</code>
                        </li>
                        <li>Navigate to S3 service</li>
                        <li>Click "Create bucket"</li>
                    </ol>

                    <h3>Step 4: Create S3 Bucket</h3>
                    <ul>
                        <li>
                            Bucket name: <code>my-lab-bucket-{Date.now()}</code>{' '}
                            (must be unique)
                        </li>
                        <li>Region: US East (N. Virginia) us-east-1</li>
                        <li>Block all public access: ✅ Keep checked</li>
                        <li>Bucket versioning: Disable</li>
                        <li>Default encryption: Disable</li>
                        <li>Click "Create bucket"</li>
                    </ul>

                    <h3>Step 5: Upload a File</h3>
                    <ul>
                        <li>Click on your bucket name</li>
                        <li>Click "Upload"</li>
                        <li>Add a test file</li>
                        <li>Click "Upload"</li>
                    </ul>

                    <div
                        style={{
                            backgroundColor: '#fff3cd',
                            padding: '15px',
                            borderRadius: '5px',
                            marginTop: '20px',
                        }}
                    >
                        <strong>⏰ Note:</strong> This user account will be
                        automatically deleted after 2 hours
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
                        Great job! You've learned how to create S3 buckets and
                        upload files.
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
