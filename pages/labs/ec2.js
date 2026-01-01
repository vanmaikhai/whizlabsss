import { useState } from 'react';
import Link from 'next/link';

export default function EC2Lab() {
    const [step, setStep] = useState(1);
    const [tempCredentials, setTempCredentials] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');

    const getCredentials = async () => {
        setLoading(true);
        try {
            console.log('Making request to /api/create-lab-user-ec2');
            const response = await fetch('/api/create-lab-user-ec2', {
                headers: {
                    'x-api-key': 'x-api-key'
                }
            });
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);
            if (data.success) {
                setTempCredentials(data.credentials);
                setStep(2);
            } else {
                setResult(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Fetch error:', error);
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
                🖥️ EC2 Lab - Step by Step
            </h1>

            {step === 1 && (
                <div style={{ padding: '20px' }}>
                    <h2>Step 1: Get Your AWS Credentials</h2>
                    <p>
                        Click below to generate temporary AWS credentials for
                        this lab:
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
                        <li>Navigate to EC2 service</li>
                        <li>Click "Launch Instance"</li>
                    </ol>

                    <h3>Step 4: Create EC2 Instance</h3>
                    <ul>
                        <li>
                            Name: <code>my-lab-instance</code>
                        </li>
                        <li>AMI: Amazon Linux 2023</li>
                        <li>Instance type: t2.micro</li>
                        <li>Key pair: Proceed without key pair</li>
                        <li>Security group: Default</li>
                        <li>
                            <strong>User data</strong> (Advanced details → User data):
                            <div
                                style={{
                                    backgroundColor: '#f8f9fa',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    fontFamily: 'monospace',
                                    fontSize: '12px',
                                    margin: '10px 0',
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                            {`#!/bin/bash
                            # get admin privileges
                            sudo su

                            # install httpd (Linux 2 version)
                            yum update -y
                            yum install -y httpd.x86_64
                            systemctl start httpd.service
                            systemctl enable httpd.service
                            echo "Hello World from $(hostname -f)" > /var/www/html/index.html`}
                            </div>
                        </li>
                        <li>Click "Launch instance"</li>
                    </ul>

                    <h3>Step 5: Test Your Web Server</h3>
                    <ul>
                        <li>Wait for instance to be "Running"</li>
                        <li>Copy the Public IPv4 address</li>
                        <li>Open in browser: <code>http://YOUR_PUBLIC_IP</code></li>
                        <li>You should see "Hello World from..." message</li>
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
                        Great job! You've learned how to create EC2 instances
                        manually.
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
