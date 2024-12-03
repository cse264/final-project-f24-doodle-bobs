'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import router for navigation
import Image from 'next/image'; // Next.js optimized image component
import './homePage.css'; // Import the CSS for styling

export default function HomePage() {
    // State variables
    const [drawings, setDrawings] = useState([]); // Store fetched drawings data
    const [loading, setLoading] = useState(true); // Track loading state
    const [userId, setUserId] = useState(null); // Store the logged-in user's ID
    const router = useRouter(); // Router instance for navigation

    // Fetch the user_id from localStorage on component mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('user_id');
            setUserId(storedUserId); // Save the user_id to state
        }
    }, []);

    // Effect to fetch drawings from the backend API
    useEffect(() => {
        const fetchDrawings = async () => {
            try {
                const response = await fetch('/api/homePage'); // Fetch data from API endpoint
                if (response.ok) {
                    const data = await response.json(); // Parse JSON data
                    setDrawings(data); // Store fetched data in state
                } else {
                    console.error('Failed to fetch drawings'); // Log an error if the response is not OK
                }
            } catch (error) {
                console.error('Error fetching drawings:', error); // Log any error during the fetch
            } finally {
                setLoading(false); // Set loading state to false after the fetch is complete
            }
        };

        fetchDrawings(); // Trigger the data fetching
    }, []); // Dependency array ensures this runs only on mount

    // Function to handle the "Create" button click and navigate to the drawing page
    const handleCreateClick = () => {
        router.push('/drawingPage'); // Navigate to /drawingPage
    };

    // Function to handle the "Posts" button click and navigate to the user page
    const goToUserPage = () => {
        router.push('/userPage'); // Navigate to /userPage
    };

    const handleDownload = async (url, title) => {
        try {
            // Fetch the image data from the URL
            const response = await fetch(url);
            const blob = await response.blob(); // Convert the response into a Blob

            // Create a temporary URL for the Blob
            const blobUrl = URL.createObjectURL(blob);

            // Prompt the user for a file name
            const fileName = prompt(
                'Enter a file name for your drawing:',
                `${title || 'drawing'}.png`
            );
            if (!fileName) {
                alert('File name is required to save the file.');
                return;
            }

            // Create a temporary anchor element for downloading
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`; // Ensure .png extension
            document.body.appendChild(link);
            link.click();

            // Clean up by removing the anchor and revoking the Blob URL
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error downloading the file:', error);
            alert('An error occurred while downloading the file.');
        }
    };

    const handleDelete = async (id) => {
        const userId = localStorage.getItem('user_id'); // get user_id from localStorage
        if (!userId) {
            alert('You must be logged in to delete a doodle.');
            return;
        }
    
        try {
            // Send DELETE request with userId included in the query
            const response = await fetch(`/api/homePage?id=${id}&user_id=${userId}`, {
                method: 'DELETE',
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert('Doodle deleted successfully!');
                // Remove the deleted doodle from the UI
                setDrawings((prev) => prev.filter((doodle) => doodle.id !== id));
            } else {
                alert(`Failed to delete doodle: ${data.error}`);
            }
        } catch (error) {
            console.error('Error deleting doodle:', error);
            alert('An error occurred while deleting the doodle.');
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
                />
                <h1 className="header-title">Doodlebob</h1>
            </header>

            {/* Sidebar Section */}
            <div className="sidebar">
                <div className="sidebar-button-container">
                    {/* Create Button */}
                    <button onClick={handleCreateClick} className="sidebar-button">
                        Create
                    </button>

                    {/* Conditionally render the Posts button (not shown for user_id = 1) */}
                    {userId !== '1' && (
                        <button onClick={goToUserPage} className="sidebar-button">
                            Posts
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Section */}
            <div className="main-content">
                {loading ? (
                    // Placeholder for loading state
                    <div>Loading...</div>
                ) : (
                    // Render grid of drawings when data is available
                    <div className="grid-container">
                        {drawings.map((drawing) => (
                            <div key={drawing.id} className="grid-item">
                                <img
                                    src={drawing.imageUrl} // Display drawing image
                                    alt={drawing.title} // Set image alt text
                                    className="doodle-image"
                                />
                                <div className="doodle-title-container">
                                    <div className="doodle-title">{drawing.title}</div>
                                    {/* Download Button */}
                                    <button
                                        className="button download-button"
                                        onClick={() => handleDownload(drawing.imageUrl, drawing.title)}
                                    >
                                        Download
                                    </button>

                                    {/* Conditionally render the Delete button for user_id = 1 */}
                                    {userId === '1' && (
                                        <button
                                            className="button delete-button"
                                            onClick={() => handleDelete(drawing.id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
