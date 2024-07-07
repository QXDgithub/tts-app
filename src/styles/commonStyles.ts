// src/styles/commonStyles.ts

export const commonStyles = {
    main: {
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      minHeight: 'calc(100vh - 60px)', // Assuming navbar is 60px high
      backgroundColor: '#f0f4f8',
    },
    heading: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      color: '#2c3e50',
      textAlign: 'center' as const,
    },
    inputContainer: {
      width: '100%',
      maxWidth: '400px',
      marginBottom: '1.5rem',
    },
    button: {
      padding: '0.5rem 1rem',
      fontSize: '1rem',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      ':hover': {
        backgroundColor: '#2980b9',
      },
    },
    message: {
      marginTop: '1rem',
      padding: '0.5rem',
      borderRadius: '4px',
      textAlign: 'center' as const,
      fontWeight: 'bold',
    },
    successMessage: {
      backgroundColor: '#d4edda',
      color: '#155724',
    },
    errorMessage: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
    },
  };