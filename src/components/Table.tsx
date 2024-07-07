// src/components/Table.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface TableProps {
  tableName: string;
}

const Table: React.FC<TableProps> = ({ tableName }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Fetching data from table: ${tableName}`);
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('id', { ascending: false })
          .limit(100);

        if (error) throw error;

        console.log(`Data fetched:`, data);
        setData(data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`Failed to fetch data from ${tableName}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName]);

  if (loading) return <p>Loading data from {tableName}...</p>;
  if (error) return <p>Error: {error}</p>;
  if (data.length === 0) return <p>No data available in {tableName}</p>;

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <h2>{tableName} Data</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key} style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value: any, cellIndex) => (
                <td key={cellIndex} style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;