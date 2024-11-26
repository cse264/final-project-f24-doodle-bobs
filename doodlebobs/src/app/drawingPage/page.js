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
    const uploadRef = useRef(null);
    const [drawing, setDrawing] = useState(false); // Track if the user is drawing
    const [color, setColor] = useState('#ffffff');
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

    const handleColorChange = (e) => {
        setColor(e.target.value); // Update the color state when the user selects a new color
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
        const file = uploadRef.current.files[0]; // Access the file input via the ref
    
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (allowedTypes.includes(file.type)) {
            setImage(file); // Store the file in state
        } else {
            alert('Only allowed to upload jpeg and png. Please select a valid image.');
        }
    };

    // Draw the uploaded image on the canvas if it's available
    const drawImageOnCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
    
        if (image) {
            const imgUrl = URL.createObjectURL(image); // Create a URL from the uploaded file
            const img = new window.Image();  // Use the native Image constructor
            img.src = imgUrl;
            img.onload = () => {
                // Clear the canvas before drawing
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // Draw the image on the canvas
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
        }
    };

    // Run drawImageOnCanvas whenever the image state changes
    useEffect(() => {
        drawImageOnCanvas();
    }, [image]);





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
                <div className='sidebar-tool-container'>
                    <div className="color-picker">
                    <input type="color" id="colorInput" value={color} onChange={handleColorChange}/>
                        <div className="color-info"></div>
                    </div>   
                </div>             
                <div className='sidebar-button-container'>
                    <form
                        className='upload-form-container'
                        onSubmit={handlePhotoUpload}
                    >
                        <label htmlFor="fileUpload">Choose a file:</label>
                        <input type="file" id="fileUpload" name="fileUpload" ref={uploadRef} />
                        <button className='sidebar-button' type="submit">Upload Image</button>
                    </form>
                    <button onClick={handleClick} className='sidebar-button'> Post Doodle </button>
                    <button onClick={handleClick} className='sidebar-button'> Save To Local System </button>
                </div>
                <button onClick={handleClick} className='sidebar-button'> Exit </button>
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
