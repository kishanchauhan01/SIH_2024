import React, { useState } from 'react';
import 'tailwindcss/tailwind.css'; // Ensure Tailwind CSS is imported

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
            const response = await fetch('http://localhost:5000/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();   // What response comes from the Express app

            if (response.ok) {
                setMessage(data.message);
            } else {
                setMessage("Submission failed for unknown reasons.");
            }

        } catch (error) {
            console.log(error);
            setMessage(error.message);
        }
    };

    return (
        <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg max-w-5xl w-full mx-auto mt-10">
            <h2 className="text-3xl font-bold text-center text-yellow-500 mb-6">Submit News Information</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <label className="text-lg font-semibold">Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="p-3 text-lg rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-lg font-semibold">News Title Name:</label>
                    <input
                        type="text"
                        name="newsTitle"
                        value={formData.newsTitle}
                        onChange={handleChange}
                        className="p-3 text-lg rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-lg font-semibold">State:</label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="p-3 text-lg rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-lg font-semibold">City:</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="p-3 text-lg rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-lg font-semibold">Periodicity:</label>
                    <select
                        name="periodicity"
                        value={formData.periodicity}
                        onChange={handleChange}
                        className="p-3 text-lg rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-500"
                    >
                        <option value="" disabled>Select a day</option>
                        {daysOfWeek.map((day) => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                </div>

                <div className="col-span-2 flex justify-center">
                    <button
                        type="submit"
                        className="bg-yellow-500 text-lg font-semibold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-all duration-300"
                    >
                        Submit
                    </button>
                </div>
            </form>

            {message && <p className="text-center text-yellow-500 mt-4">{message}</p>}
        </div>
    );
};

export default NewsForm;
