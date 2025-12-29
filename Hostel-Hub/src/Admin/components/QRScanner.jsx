import React, { useState, useEffect, useRef } from 'react';
import { QrCode, X, Camera, CameraOff } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = ({ onClose, onScanSuccess }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState('');
    const [cameraStarted, setCameraStarted] = useState(false);
    const html5QrCodeRef = useRef(null);

    useEffect(() => {
        // Auto-start scanner when component mounts
        startScanner();
        return () => {
            stopScanner();
        };
    }, []);

    const handleClose = () => {
        stopScanner();
        onClose();
    };

    const startScanner = async () => {
        try {
            setIsScanning(true);
            setError('');

            const html5QrCode = new Html5Qrcode("qr-reader");
            html5QrCodeRef.current = html5QrCode;

            // Start camera with environment-facing camera (back camera)
            await html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                },
                (decodedText, decodedResult) => {
                    // Success callback
                    console.log(`QR Code detected: ${decodedText}`, decodedResult);
                    onScanSuccess(decodedText);
                    stopScanner();
                },
                (errorMessage) => {
                    // Failure callback - don't show error for every scan attempt
                    console.warn('QR scan failure:', errorMessage);
                }
            );

            setCameraStarted(true);
        } catch (err) {
            console.error('Scanner error:', err);
            setError('Failed to start camera. Please ensure camera permissions are granted and no other app is using the camera.');
            setIsScanning(false);
            setCameraStarted(false);
        }
    };

    const stopScanner = async () => {
        setIsScanning(false);
        setCameraStarted(false);

        if (html5QrCodeRef.current) {
            try {
                // Stop the camera stream first
                await html5QrCodeRef.current.stop();
                // Then clear the scanner
                await html5QrCodeRef.current.clear();
            } catch (err) {
                console.error('Error stopping scanner:', err);
            }
            html5QrCodeRef.current = null;
        }

        // Also stop any media tracks that might be active
        const videoElements = document.querySelectorAll('#qr-reader video');
        videoElements.forEach(video => {
            if (video.srcObject) {
                const tracks = video.srcObject.getTracks();
                tracks.forEach(track => track.stop());
                video.srcObject = null;
            }
        });
    };

    const onScanFailure = (errorMessage) => {
        // Don't show error for every scan failure, only log it
        console.warn('QR scan failure:', errorMessage);
    };

    // const handleManualScan = () => {
    //     // For manual testing or fallback
    //     const testToken = '3b082941-f513-4b9c-8d3f-c2d05a342bae';
    //     onScanSuccess(testToken);
    // };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="qr-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '90%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Scan QR Code</h3>
                    <button
                        className="btn btn-ghost"
                        onClick={handleClose}
                        style={{ padding: '0.5rem', borderRadius: '0.375rem' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {error && (
                    <div style={{
                        background: '#fef2f2',
                        border: '1px solid #fee2e2',
                        borderRadius: '0.5rem',
                        padding: '0.75rem',
                        marginBottom: '1rem',
                        color: '#dc2626',
                        fontSize: '0.875rem'
                    }}>
                        {error}
                    </div>
                )}

                <div style={{ textAlign: 'center' }}>
                    {!cameraStarted && !error && (
                        <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                                <div className="loading-spinner" style={{
                                    width: '40px',
                                    height: '40px',
                                    border: '4px solid #e2e8f0',
                                    borderTop: '4px solid #3b82f6',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                            </div>
                            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                                Starting camera...
                            </p>
                        </div>
                    )}

                    <div style={{ marginBottom: '1rem' }}>
                        <div id="qr-reader" style={{
                            borderRadius: '0.5rem',
                            overflow: 'hidden',
                            minHeight: '300px',
                            display: cameraStarted ? 'block' : 'none'
                        }}></div>
                    </div>

                    {cameraStarted && (
                        <button
                            className="btn btn-danger"
                            onClick={stopScanner}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                margin: '0 auto'
                            }}
                        >
                            <CameraOff size={20} />
                            Stop Scanner
                        </button>
                    )}
                </div>

                <div style={{
                    marginTop: '1.5rem',
                    padding: '0.75rem',
                    background: '#f1f5f9',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#64748b'
                }}>
                    <strong>Instructions:</strong> Position the QR code within the frame to scan. The scanner will automatically detect and process the QR code.
                </div>
            </div>
        </div>
    );
};

export default QRScanner;
