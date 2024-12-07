'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './userPage.css';

export default function UserPage() {
    const [drawings, setDrawings] = useState([]); // Store fetched drawings data
    const [loading, setLoading] = useState(true); // Track loading state
    const router = useRouter(); // Router instance for navigation
    const [userId, setUserId] = useState(null); // State to hold the user ID

    // Retrieve the user ID from localStorage on component mount
    useEffect(() => {
        const storedUserId = localStorage.getItem('user_id');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            alert('No user ID found. Please log in.');
            router.push('/loginPage'); // Redirect to login if no user ID is found
        }
    }, [router]);

    // Function to fetch drawings for the specific user
    const fetchDrawings = async () => {
        if (userId) {
            try {
                const response = await fetch(`/api/userPage?user_id=${userId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    const data = await response.json(); // Parse JSON response
                    setDrawings(data); // Store the parsed data in state
                } else {
                    console.error('Failed to fetch drawings');
                    alert('Failed to load drawings. Please try again later.');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('An error occurred while loading the drawings.');
            } finally {
                setLoading(false); // Ensure loading state is updated
            }
        }
    };

    // Fetch drawings when userId changes
    useEffect(() => {
        fetchDrawings();
    }, [userId]);

    // Function to handle the "Delete" button click and remove a doodle
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/userPage?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Doodle deleted successfully!');
                fetchDrawings(); // Re-fetch the updated list of drawings
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
    };

    // Function to handle logo click (navigate to homepage)
    const navigateToHomePage = () => {
        router.push('/homePage');
    };

    const handleDownload = async (url, title) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();

            const blobUrl = URL.createObjectURL(blob);
            const fileName = prompt(
                'Enter a file name for your drawing:',
                `${title || 'drawing'}.png`
            );
            if (!fileName) {
                alert('File name is required to save the file.');
                return;
            }

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error downloading the file:', error);
            alert('An error occurred while downloading the file.');
        }
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
                    onClick={navigateToHomePage}
                />
                <h1 className="header-title">Your Doodles</h1>
            </header>

            {/* Sidebar Section */}
            <div className="sidebar">
                <button className="sidebar-button" onClick={navigateToDrawingPage}>
                    Create
                </button>
            </div>

            {/* Main Content Section */}
            <div className="main-content">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="grid-container">
                        {drawings.length === 0 ? (
                            <div>No doodles available</div>
                        ) : (
                            drawings.map((drawing) => (
                                <div key={drawing.doodle_id} className="grid-item">
                                    <img
                                        src={drawing.imgur_link}
                                        alt={drawing.title || 'Doodle'}
                                        className="doodle-image"
                                    />
                                    <div className="doodle-title-container">
                                        <div className="doodle-title">{drawing.title || 'Untitled'}</div>
                                        <button
                                            className="download-button"
                                            onClick={() =>
                                                handleDownload(drawing.imgur_link, drawing.title || 'Doodle')
                                            }
                                        >
                                            Download
                                        </button>
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
