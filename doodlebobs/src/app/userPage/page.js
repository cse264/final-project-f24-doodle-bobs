'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import Image from 'next/image'; 
import './userPage.css';

export default function UserPage() { 
    const [drawings, setDrawings] = useState([]); // Store fetched drawings data
    const [loading, setLoading] = useState(true); // Track loading state
    const router = useRouter(); // Router instance for navigation
    const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null;
    

    // Effect to fetch drawings for the specific user (using the `username`)
    useEffect(() => {
        console.log('Username:', username);
        console.log('Fetch URL:', `/api/userPage?username=${username}`);
    
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/userPage?username=${username}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
    
                if (response.ok) {
                    const data = await response.json(); // Parse JSON response
                    setDrawings(data); // Store the parsed data in state
                    setLoading(false); // Set loading to false once data is fetched
                } else {
                    console.error('Failed to fetch drawings');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false); // Ensure loading is false on error
            }
        };
    
        // Call fetchData when username is available
        fetchData();
    
    }, [username]); // Re-run effect when `username` or `router` changes
    

    // Function to handle the "Delete" button click and remove a doodle
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/userPage?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Doodle deleted successfully');
                // Remove the deleted doodle from the UI
                setDrawings((prev) => prev.filter((doodle) => doodle.id !== id));
            } else {
                const data = await response.json();
                alert(`Failed to delete doodle: ${data.error}`);
            }
        } catch (error) {
            console.error('Error deleting doodle:', error);
            alert('An error occurred while deleting the doodle.');
        }
    };

    // Function to handle drawing page navigation
    const navigateToDrawingPage = () => {
        router.push('/drawingPage'); // Navigate to the drawing page
        console.log('Username:', username); // Check if username is correctly passed
    };

    // Function to handle logo click (navigate to homepage)
    const navigateToHomePage = () => {
        router.push('/homePage');
    };

    return (
        <div className="full-screen-container">
            {/* Header Section */}
            <header className="header">
                <Image
                    className="header-logo"
                    src="/logo.png"
                    alt="App Logo"
                    width={100}
                    height={100}
                    onClick={navigateToHomePage} // Make the logo clickable to go to the homepage
                />
                <h1 className="header-title">Your Doodles</h1>
            </header>
    
            {/* Sidebar Section */}
            <div className="sidebar">
                {/* Button to navigate to the drawing page */}
                <button className="sidebar-button" onClick={navigateToDrawingPage}>
                    Create
                </button>
            </div>
    
            {/* Main Content Section */}
            <div className="main-content">
                {loading ? (
                    <div>Loading...</div> // Placeholder for loading state
                ) : (
                    <div className="grid-container">
                        {drawings.length === 0 ? (
                            <div>No doodles available</div> // If no drawings exist
                        ) : (
                            drawings.map((drawing) => (
                                <div key={drawing.doodle_id} className="grid-item">
                                    <img
                                        src={drawing.imgur_link} // Use the correct field for the image URL
                                        alt={drawing.title || 'Doodle'} // Provide fallback for alt text
                                        className="doodle-image"
                                    />
                                    <div className="doodle-title-container">
                                        <div className="doodle-title">{drawing.title || 'Untitled'}</div>
                                        {/* Download button */}
                                        <button
                                            className="download-button"
                                            onClick={() =>
                                                handleDownload(drawing.imgur_link, drawing.title || 'Doodle')
                                            }
                                        >
                                            Download
                                        </button>
                                        {/* Delete button */}
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(drawing.doodle_id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}    