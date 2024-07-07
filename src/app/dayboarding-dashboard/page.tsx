// src/app/dayboarding-dashboard/page.tsx
"use client";

import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../../components/Navbar';
import Table from '../../components/Table';

export default function DayboardingDashboard() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  const classOptions = ['XII', 'XI'];
  const sectionOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  const downloadCSV = async () => {
    if (!selectedDate) {
      alert('Please select a date before downloading.');
      return;
    }

    setIsDownloading(true);
    try {
      // Start with the date filter
      let query = supabase
        .from('dayboarding-new')
        .select('*')
        .gte('timest', `${selectedDate}T00:00:00`)
        .lt('timest', `${selectedDate}T23:59:59`);

      // Add class-section filter if both are selected
      if (selectedClass && selectedSection) {
        const class_sec = `${selectedClass}-${selectedSection}`;
        query = query.eq('class_sec', class_sec);
      }

      // Execute the query
      const { data, error } = await query.order('id', { ascending: true });

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
          const fileName = selectedClass && selectedSection 
            ? `dayboarding_${selectedDate}_${selectedClass}-${selectedSection}.csv`
            : `dayboarding_${selectedDate}.csv`;
          link.setAttribute('download', fileName);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        alert(`No data available for the selected criteria`);
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
          DAYBOARDING-DASHBOARD
        </h1>
        <div style={{ width: '100%', maxWidth: '1000px', marginBottom: '1rem' }}>
          <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={inputStyle}
          />
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            style={selectStyle}
          >
            <option value="">All Classes</option>
            {classOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <select 
            value={selectedSection} 
            onChange={(e) => setSelectedSection(e.target.value)}
            style={selectStyle}
          >
            <option value="">All Sections</option>
            {sectionOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <button 
            onClick={downloadCSV} 
            disabled={isDownloading || !selectedDate}
            style={{
              ...buttonStyle,
              opacity: (isDownloading || !selectedDate) ? 0.5 : 1
            }}
          >
            {isDownloading ? 'Downloading...' : 'Download CSV'}
          </button>
        </div>
        <div style={{ width: '100%', maxWidth: '1000px' }}>
          <Table tableName="dayboarding-new" />
        </div>
      </main>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '0.5rem',
  fontSize: '1rem',
  marginRight: '1rem',
  marginBottom: '1rem',
};

const selectStyle: React.CSSProperties = {
  padding: '0.5rem',
  fontSize: '1rem',
  marginRight: '1rem',
  marginBottom: '1rem',
};

const buttonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  fontSize: '1rem',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};