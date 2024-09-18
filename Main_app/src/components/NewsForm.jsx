import React, { useState } from 'react';

// Form component
const NewsForm = () => {
    // State to manage form inputs
    const [formData, setFormData] = useState({
        username: '',
        newsTitle: '',
        state: '',
        city: '',
        periodicity: ''
    });

    // Days of the week for dropdown
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Handle form data change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const [message, setMessage] = useState('')

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Do something with formData

        try {
            const response = await fetch('http://localhost:3000/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();   //! what response come from the express app

            if (response.ok) {
                setMessage(data.message);
            }else{
                setMessage("failed by some reason don't know what's happen ");
            }

        } catch (error) {
            console.log(error);
            setMessage(error);
        }

    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Submit News Information</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label style={styles.label}>Username:</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    style={styles.input}
                />
                 

                <label style={styles.label}>News Title Name:</label>
                <input
                    type="text"
                    name="newsTitle"
                    value={formData.newsTitle}
                    onChange={handleChange}
                    style={styles.input}
                />

                <label style={styles.label}>State:</label>
                <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    style={styles.input}
                />

                <label style={styles.label}>City:</label>
                <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    style={styles.input}
                />

                <label style={styles.label}>Periodicity:</label>
                <select
                    name="periodicity"
                    value={formData.periodicity}
                    onChange={handleChange}
                    style={styles.dropdown}
                >
                    <option value="" disabled>Select a day</option>
                    {daysOfWeek.map((day) => (
                        <option key={day} value={day}>{day}</option>
                    ))}
                </select>

                <button type="submit" style={styles.button}>Submit</button>
            </form>

            {message && <p style={styles.message}>{message}</p>}
        </div>
    );
};

// Styles for the form
const styles = {
    message: {
        color: '#f39c12',
        textAlign: 'center',
        marginTop: '15px',
    },
    container: {
        backgroundColor: '#1c1c1e',  // Dark background
        color: '#fff',  // White text
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    header: {
        textAlign: 'center',
        fontFamily: '"Roboto", sans-serif',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#f39c12', // Gold color for header
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '8px',
        fontSize: '20px',
        fontFamily: '"Roboto", sans-serif',
    },
    input: {
        marginBottom: '15px',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #333',
        backgroundColor: '#2c2c2e',  // Dark input background
        color: '#fff',
        fontFamily: '"Roboto", sans-serif',
    },
    dropdown: {
        marginBottom: '15px',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        backgroundColor: '#2c2c2e',
        color: '#fff',
        border: '1px solid #333',
        fontFamily: '"Roboto", sans-serif',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#f39c12', // Gold color for the button
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        fontFamily: '"Roboto", sans-serif',
        textAlign: 'center',
    },
};

export default NewsForm;
