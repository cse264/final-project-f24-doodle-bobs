// app/drawingPage/page.js

'use client'; // Make sure this is at the top to enable client-side rendering

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './drawingPage.css';

/**Next steps
 * Undo and Redo: https://www.codicode.com/art/undo_and_redo_to_the_html5_canvas.aspx
 * Color Wheel: 
 * Pen types and Sizes:
 *      * Fabric.js: https://dev.to/ziqinyeow/step-by-step-on-how-to-setup-fabricjs-in-the-nextjs-app-3hi3
 *      * Event Listeners, drawing logic, drawing functions, etc: https://www.geeksforgeeks.org/build-a-drawing-app-using-javascript/
 * Buttons: Import Image, Save Doodle, Post Doodle, Exit to home
 */

export default function DrawingPage() {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false); // Track if the user is drawing
    const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
    const [image, setImage] = useState();
    const router = useRouter();

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

    // Handle drawing logic on the canvas
    const startDrawing = (e) => {
        setDrawing(true);
        setLastPosition(getCoordinates(e));
    };

    const stopDrawing = () => {
        setDrawing(false);
    };

    const draw = (e) => {
        if (!drawing) return;
        const ctx = canvasRef.current.getContext('2d');
        const { x, y } = getCoordinates(e);

        ctx.beginPath();
        ctx.moveTo(lastPosition.x, lastPosition.y);
        ctx.lineTo(x, y);
        ctx.stroke();

        setLastPosition({ x, y });
    };

    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect(); // Get the canvas position on the page
        const x = e.clientX - rect.left;  // Calculate the x-coordinate relative to the canvas
        const y = e.clientY - rect.top;   // Calculate the y-coordinate relative to the canvas
        return { x, y };
    };

    const handleClick = () => {
        alert('Button clicked!');
    };
    const goHome = () => {
        router.push('/homePage');
    };
    const handlePhotoUpload = (event) => {
        event.preventDefault();
        const file = event.target.fileUpload.files[0];
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (allowedTypes.includes((file.type))) {
            setImage(file);
        }
        else{
            alert('Only allowed to upload jpeg and png. Please select a valid image.')
        }
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
                    onClick={goHome}
                />
                <h1 className='header-title'> Doodlebob </h1>
            </header>
            {/* Sidebar Content */}
            <div className='sidebar'>
                <div className='sidebar-button-container'>
                    <form action={handlePhotoUpload} method="post" enctype="multipart/form-data">
                        <label for="fileUpload">Choose a file:</label>
                        <input type="file" id="fileUpload" name="fileUpload" />
                        {/* add content saying if file not specific type then cannot upload*/}
                        <br></br>
                        <button onClick={handlePhotoUpload} type="submit">Upload</button>
                    </form>
                    <button onClick={handleClick} className='sidebar-button'> Placeholder 1 </button>
                    <button onClick={handleClick} className='sidebar-button'> Placeholder 2 </button>
                    <button onClick={handleClick} className='sidebar-button'> Placeholder 3 </button>
                    <button onClick={handleClick} className='sidebar-button'> Import Image </button>
                    <button onClick={handleClick} className='sidebar-button'> Post Doodle </button>
                    <button onClick={handleClick} className='sidebar-button'> Save To Local System </button>
                </div>
                <button onClick={handleClick} className='share-button'> Exit </button>
            </div>
            {/* Main Content */}
            <div className='main-content'>
                {/* Drawing Canvas */}
                <div className='canvas-container'>
                    <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseUp={stopDrawing}
                        onMouseMove={draw}
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
