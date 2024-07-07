// src/components/Navbar.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dayboarding', path: '/dayboarding' },
    { name: 'Lab Attendance', path: '/labattendance' },
    { name: 'Bus Attendance', path: '/busattendance' },
  ];

  return (
    <nav style={{
      backgroundColor: '#333',
      padding: '1rem',
      color: 'white',
      position: 'relative',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>
          TTS App
        </Link>
        {isMobile ? (
          <button onClick={toggleMenu} style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
          }}>
            ☰
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} style={{ color: 'white', textDecoration: 'none' }}>
                {item.name}
              </Link>
            ))}
            <button onClick={handleSignOut} style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
            }}>
              Sign Out
            </button>
          </div>
        )}
      </div>
      {isMobile && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: isMenuOpen ? 0 : '-250px',
          width: '250px',
          height: '100vh',
          backgroundColor: '#333',
          transition: 'right 0.3s ease-in-out',
          padding: '1rem',
          boxShadow: isMenuOpen ? '-5px 0 5px rgba(0,0,0,0.1)' : 'none',
          zIndex: 1000,
        }}>
          <button onClick={toggleMenu} style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            position: 'absolute',
            top: '1rem',
            right: '1rem',
          }}>
            ×
          </button>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginTop: '3rem',
          }}>
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} style={{ color: 'white', textDecoration: 'none' }} onClick={toggleMenu}>
                {item.name}
              </Link>
            ))}
            <button onClick={handleSignOut} style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              textAlign: 'left',
              padding: 0,
              fontSize: '1rem',
            }}>
              Sign Out
            </button>
          </div>
        </div>
      )}
      {isMobile && isMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
          }}
          onClick={toggleMenu}
        />
      )}
    </nav>
  );
};

export default Navbar;