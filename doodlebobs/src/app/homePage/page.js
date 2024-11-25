// app/drawingPage/page.js

'use client'; // Make sure this is at the top to enable client-side rendering

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './homePage.css';

/**Next steps
 * Undo and Redo: https://www.codicode.com/art/undo_and_redo_to_the_html5_canvas.aspx
 * Color Wheel: https://www.codicode.com/art/undo_and_redo_to_the_html5_canvas.aspx
 * Pen types and Sizes:
 *      * Fabric.js: https://dev.to/ziqinyeow/step-by-step-on-how-to-setup-fabricjs-in-the-nextjs-app-3hi3
 *      * Event Listeners, drawing logic, drawing functions, etc: https://www.geeksforgeeks.org/build-a-drawing-app-using-javascript/
 * Buttons: Import Image, Save Doodle, Post Doodle, Exit to home
 */

export default function HomePage() {
    const canvasRef = useRef(null);


    // Function to update canvas size based on its container's dimensions
    const updateCanvasSize = () => {
        const canvas = canvasRef.current;
        const container = canvas.parentElement; // Get the canvas container

        // Set the canvas resolution based on the container size
        const width = container.offsetWidth;
        const height = container.offsetHeight;

        canvas.width = width;  // Set the actual drawing resolution
        canvas.height = height; // Adjust the height for drawing
    };

    // Run updateCanvasSize on mount and whenever window is resized
    useEffect(() => {
        updateCanvasSize(); // Update canvas size when component mounts
        
        // Add event listener to update size on window resize
        window.addEventListener('resize', updateCanvasSize);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, []);
    
    
    const handleClick = () => {
        alert('Button clicked!');
    };
    
    
    

    return (
        <div className='full-screen-container'>
            {/* Header */}
            <header className='header'>
                <Image
                    className='header-logo'
                    src='/logo.png'
                    alt='App Logo'
                    width={100}
                    height={100}
                />
                <h1 className='header-title'> Doodlebob </h1>
            </header>
            {/* Sidebar Content */}
            <div className='sidebar'>
                <div className='sidebar-button-container'>
                    <button onClick={handleClick} className='sidebar-button'> Create </button>
                </div>
            </div>
            {/* Main Content */}
            <div className='main-content'>
                {/* Drawing Canvas */}
                <div className='canvas-container'>
                    <canvas
                        ref={canvasRef}

                    />
                </div>
            </div>
        </div>
    );
}

/*
Color codes we can use for a scheme:
Darkest Blue: #2C2A4A
Darkest Blue/Purple: #4F518C
Medium Purple: #907AD6
Lightest Purple: #DABFFF
Lightest Blue: #7FDEFF
White and Black as well, of course
*/
