// src/app/lab-dashboard/page.tsx
"use client";

import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../../components/Navbar';
import Table from '../../components/Table';

export default function LabDashboard() {
  const [selectedDate, setSelectedDate] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadCSV = async () => {
    if (!selectedDate) {
      alert('Please select a date before downloading.');
      return;
    }

    setIsDownloading(true);
    try {
      const { data, error } = await supabase
        .from('lab-new')
        .select('*')
        .gte('timest', `${selectedDate}T00:00:00`)
        .lt('timest', `${selectedDate}T23:59:59`)
        .order('id', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Convert data to CSV
        const headers = Object.keys(data[0]).join(',');
        const csvData = data.map(row => 
          Object.values(row).map(value => 
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
          ).join(',')
        );
        const csvContent = [headers, ...csvData].join('\n');

        // Create and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', `lab_attendance_${selectedDate}.csv`);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        alert(`No data available for the selected date`);
      }
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Failed to download CSV. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main style={{ 
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 'calc(100vh - 80px)'
      }}>
        <h1 style={{ 
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          LAB ATTENDANCE DASHBOARD
        </h1>
        <div style={{ width: '100%', maxWidth: '1000px', marginBottom: '1rem' }}>
          <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '0.5rem',
              fontSize: '1rem',
              marginRight: '1rem',
            }}
          />
          <button 
            onClick={downloadCSV} 
            disabled={isDownloading || !selectedDate}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: (isDownloading || !selectedDate) ? 0.5 : 1,
            }}
          >
            {isDownloading ? 'Downloading...' : 'Download CSV'}
          </button>
        </div>
        <div style={{ width: '100%', maxWidth: '1000px' }}>
          <Table tableName="lab-new" />
        </div>
      </main>
    </div>
  );
}