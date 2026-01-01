import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
    const services = [
        {
            name: 'EC2',
            path: '/labs/ec2',
            desc: 'Create virtual servers',
            icon: '🖥️',
        },
        {
            name: 'S3',
            path: '/labs/s3',
            desc: 'Object storage buckets',
            icon: '🪣',
        },
        {
            name: 'Lambda',
            path: '/labs/lambda',
            desc: 'Serverless functions',
            icon: '⚡',
        },
        {
            name: 'ECS',
            path: '/labs/ecs',
            desc: 'Container orchestration',
            icon: '🐳',
        },
        {
            name: 'SNS',
            path: '/labs/sns',
            desc: 'Notification service',
            icon: '📢',
        },
        { name: 'SQS', path: '/labs/sqs', desc: 'Message queuing', icon: '📬' },
    ];

    return (
        <div
            style={{
                padding: '20px',
                maxWidth: '1000px',
                margin: '0 auto',
                fontFamily: 'Arial, sans-serif',
            }}
        >
            <h1
                style={{
                    textAlign: 'center',
                    color: '#232F3E',
                    marginBottom: '10px',
                }}
            >
                🚀 AWS Services Lab
            </h1>
            <p
                style={{
                    textAlign: 'center',
                    color: '#666',
                    marginBottom: '40px',
                }}
            >
                Choose a service to start your hands-on lab
            </p>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                }}
            >
                {services.map((service) => (
                    <Link
                        key={service.name}
                        href={service.path}
                        style={{ textDecoration: 'none' }}
                    >
                        <div
                            style={{
                                border: '2px solid #e9ecef',
                                borderRadius: '10px',
                                padding: '30px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                backgroundColor: 'white',
                            }}
                            onMouseOver={(e) => {
                                e.target.style.borderColor = '#007bff';
                                e.target.style.transform = 'translateY(-5px)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.borderColor = '#e9ecef';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '48px',
                                    marginBottom: '15px',
                                }}
                            >
                                {service.icon}
                            </div>
                            <h3
                                style={{
                                    color: '#232F3E',
                                    marginBottom: '10px',
                                }}
                            >
                                {service.name}
                            </h3>
                            <p style={{ color: '#666', margin: 0 }}>
                                {service.desc}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Link
                    href="/admin/cleanup"
                    style={{
                        color: '#6c757d',
                        fontSize: '14px',
                        textDecoration: 'none',
                    }}
                >
                    🔧 Admin Cleanup
                </Link>
            </div>
        </div>
    );
}
