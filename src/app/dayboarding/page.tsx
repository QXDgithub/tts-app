// src/app/dayboarding/page.tsx
"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../../components/Navbar';
import TextInput from '../../components/TextInput';
import { Html5Qrcode } from 'html5-qrcode';

const styles = {
  main: {
    minHeight: 'calc(100vh - 60px)',
    backgroundColor: '#f0f4f8',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '1.5rem',
    width: '100%',
    maxWidth: '400px',
  },
  heading: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '1rem',
    textAlign: 'center' as const,
  },
  inputContainer: {
    marginBottom: '1rem',
  },
  message: {
    padding: '0.75rem',
    borderRadius: '4px',
    textAlign: 'center' as const,
    fontWeight: 'bold',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  scannerContainer: {
    position: 'relative' as const,
    width: '100%',
    maxWidth: '300px',
    marginBottom: '1rem',
  },
  scannerOverlay: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    height: '50px',
    border: '2px solid #ff0000',
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  scannerText: {
    marginTop: '0.5rem',
    textAlign: 'center' as const,
    fontSize: '0.8rem',
  },
};

export default function DayBoarding() {
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [clearInput, setClearInput] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isInspectElement, setIsInspectElement] = useState<boolean>(false);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const checkDevice = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
      setIsInspectElement(!isMobileDevice && window.innerWidth <= 768);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const handleSubmit = useCallback(async (admNo: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setClearInput(false);
    setMessage('');
    setMessageType('');

    try {
      const { data: existingData, error: existingError } = await supabase
        .from('dayboarding-exist')
        .select('adm_no, name, class_sec, group')
        .eq('adm_no', admNo)
        .single();

      if (existingError) {
        if (existingError.code === 'PGRST116') {
          setMessage("Not a TTS student");
          setMessageType('error');
        } else {
          throw existingError;
        }
      } else if (existingData) {
        const { error: insertError } = await supabase
          .from('dayboarding-new')
          .insert({
            adm_no: existingData.adm_no,
            name: existingData.name,
            class_sec: existingData.class_sec,
            group: existingData.group,
          });

        if (insertError) throw insertError;

        setMessage(`Added ${existingData.name}`);
        setMessageType('success');
      } else {
        setMessage("Student found, but data is incomplete.");
        setMessageType('error');
      }
    } catch (error) {
      console.error('Detailed error:', error);
      setMessage('An error occurred. Please try again.');
      setMessageType('error');
    } finally {
      setClearInput(true);
      setTimeout(() => {
        setIsProcessing(false);
        setClearInput(false);
      }, 1500);
    }
  }, [isProcessing]);

  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;
    
    const startScanner = async () => {
      if (isMobile || isInspectElement) {
        html5QrCode = new Html5Qrcode("reader");
        const qrCodeSuccessCallback = (decodedText: string) => {
          if (/^\d{8}$/.test(decodedText)) {
            handleSubmit(decodedText);
            html5QrCode?.pause();
            setTimeout(() => html5QrCode?.resume(), 3000);
          }
        };

        const qrCodeErrorCallback = (error: any) => {
          // Handle errors here if needed
          console.error("QR Code scanning error:", error);
        };
        
        const config = {
          fps: 10,
          qrbox: { width: 200, height: 50 },
          aspectRatio: 1.0,
        };

        try {
          if (isInspectElement) {
            await html5QrCode.start({ facingMode: "user" }, config, qrCodeSuccessCallback, qrCodeErrorCallback);
            if (videoRef.current) {
              videoRef.current.style.transform = 'scaleX(-1)';
            }
          } else {
            await html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback, qrCodeErrorCallback);
          }
        } catch (err) {
          console.error("Error starting scanner:", err);
          if (isInspectElement) {
            try {
              await html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback, qrCodeErrorCallback);
            } catch (fallbackErr) {
              console.error("Error starting fallback scanner:", fallbackErr);
            }
          }
        }
      }
    };

    startScanner();

    return () => {
      if (html5QrCode) {
        html5QrCode.stop().catch(err => console.error("Error stopping scanner:", err));
      }
    };
  }, [isMobile, isInspectElement, handleSubmit]);

  const navigateToDashboard = () => {
    router.push('/dayboarding-dashboard');
  };

  return (
    <div>
      <Navbar />
      <main style={styles.main}>
        <div style={styles.card}>
          <h1 style={styles.heading}>DAYBOARDING</h1>
          <div style={styles.inputContainer}>
            {(isMobile || isInspectElement) ? (
              <div style={styles.scannerContainer}>
                <div id="reader" style={{ width: '100%' }}>
                  <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
                </div>
                <div style={styles.scannerOverlay}></div>
                <p style={styles.scannerText}>Align barcode within the red box</p>
              </div>
            ) : (
              <TextInput onSubmit={handleSubmit} clearInput={clearInput} isDisabled={isProcessing} />
            )}
          </div>
          {message && (
            <p style={{
              ...styles.message,
              ...(messageType === 'success' ? styles.successMessage : styles.errorMessage)
            }}>{message}</p>
          )}
          <button 
            onClick={navigateToDashboard}
            style={styles.button}
          >
            Go to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}
