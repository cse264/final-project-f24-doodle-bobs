// app/drawingPage/page.js

'use client'; 

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './drawingPage.css';

/**Next steps
 * Undo and Redo: https://www.codicode.com/art/undo_and_redo_to_the_html5_canvas.aspx
 * Pen types and Sizes:
 *      * Fabric.js: https://dev.to/ziqinyeow/step-by-step-on-how-to-setup-fabricjs-in-the-nextjs-app-3hi3
 *      * Event Listeners, drawing logic, drawing functions, etc: https://www.geeksforgeeks.org/build-a-drawing-app-using-javascript/
 * Buttons: Import Image, Save Doodle, Post Doodle, Exit to home
 */

export default function DrawingPage() {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false); // Track if the user is drawing
    const [color, setColor] = useState('#ffffff')    
    const [size, setSize] = useState(1);
    const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
    const [isClient, setIsClient] = useState(false); // Track client rendering
    const router = useRouter();
    let savedImage = null; 

    // Ensure the component is only rendered on the client
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Function to update canvas size based on its container's dimensions
    const updateCanvasSize = () => {
        const canvas = canvasRef.current;
        const container = canvas.parentElement; // Get the canvas container

        // Save the current canvas content
        const ctx = canvas.getContext('2d');
        const currentContent = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Set the canvas resolution based on the container size
        const width = container.offsetWidth;
        const height = container.offsetHeight;

        canvas.width = width;  // Set the actual drawing resolution
        canvas.height = height; // Adjust the height for drawing

        // Restore the saved content
        ctx.putImageData(currentContent, 0, 0);

        // Redraw the saved image
        redrawImage(canvas, savedImage);
    };

    // Run updateCanvasSize on mount and whenever window is resized
    useEffect(() => {
        if(isClient){
            updateCanvasSize(); // Update canvas size when component mounts

            // Add event listener to update size on window resize
            window.addEventListener('resize', updateCanvasSize);
    
            // Cleanup event listener on component unmount
            return () => {
                window.removeEventListener('resize', updateCanvasSize);
            };
        }
    }, [isClient]);

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

        ctx.strokeStyle = color; // Apply the selected color for drawing
        ctx.lineWidth = size; //Apply the selected size for drawing

        ctx.beginPath();
        ctx.moveTo(lastPosition.x, lastPosition.y);
        ctx.lineTo(x, y);
        ctx.stroke();

        setLastPosition({ x, y });
    };

    const handleColorChange = (e) => {
        setColor(e.target.value); // Update the color state when the user selects a new color
    };

    const handleSizeChange = (e) => {
        setSize(parseInt(e.target.value)); // Update the size state when the user selects a new size
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

    // Function to redraw the image on the canvas
    const redrawImage = (canvas, img) => {
        if (!img) return; // If there's no image to redraw, exit early

        const ctx = canvas.getContext('2d');

        // Maintain aspect ratio while resizing image to fit canvas
        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = img.width / img.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        // Compare the aspect ratios to decide how to fit the image on the canvas
        if (imgAspect > canvasAspect) {
            // If the image is wider than the canvas:
            drawWidth = canvas.width; // Fit the image width to the canvas width
            drawHeight = canvas.width / imgAspect; // Scale the height to maintain aspect ratio
            offsetX = 0; // No horizontal offset
            offsetY = (canvas.height - drawHeight) / 2; //center image vertically
        } else {
            // If the image is taller than or the same aspect ratio as the canvas:
            drawHeight = canvas.height; // Fit the image height to the canvas height
            drawWidth = canvas.height * imgAspect; // Scale the width to maintain aspect ratio
            offsetX = (canvas.width - drawWidth) / 2; // Center the image horizontally
            offsetY = 0; // No vertical offset
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight); // Draw the image
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0]; // Get the selected file
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']; // Allowed file types

        if (file && allowedTypes.includes(file.type)) {
            const reader = new FileReader(); // Create a new FileReader
            reader.onload = () => {
                const img = new window.Image(); // Create a new Image object
                img.src = reader.result; // Set the source of the Image to the file content
                img.onload = () => {
                    savedImage = img; // Save the uploaded image object
                    const canvas = canvasRef.current;
                    redrawImage(canvas, img); // Call redrawImage to draw the image
                };
            };
            reader.readAsDataURL(file); // Convert the file to a Data URL (base64)
        } else {
            alert('Only JPEG and PNG images are allowed. Please select a valid image.');
        }
    };

    const saveToLocal = () => {
        const canvas = canvasRef.current; // Reference the canvas element
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob); // Create a URL for the Blob
    
            // Create a temp link element
            const link = document.createElement('a');
            link.href = url; // Set the link href to the Blob URL
    
            // Prompt the user for a file name
            const fileName = prompt('Enter a file name for your doodle:', 'doodle.png');
            if (!fileName) {
                alert('File name is required to save the file.');
                return;
            }
            link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`; // Add .png if not provided
    
            // Add the link to the document and trigger a click event
            document.body.appendChild(link);
            link.click();
    
            // Clean up
            document.body.removeChild(link);
            URL.revokeObjectURL(url); // Free up memory
        }, 'image/png');
    };    

    const postDoodle = async () => {
        try {
            const canvas = canvasRef.current;
            const imageData = canvas.toDataURL('image/png'); // Get canvas content as Base64
            const title = prompt('Enter a title for your doodle:'); // Prompt the user for a title
    
            if (!title) {
                alert('Title is required to post a doodle.'); // If no title is provided
                return;
            }
    
            const userId = localStorage.getItem('user_id'); // Retrieve user_id from localStorage
            if (!userId) {
                alert('You must be logged in to post a doodle.');
                return;
            }
    
            // Fetch to the route with userId included
            const response = await fetch('http://localhost:3000/api/drawingPage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, imageData, userId }), // Include userId in the payload
            });
    
            if (response.ok) {
                alert('Doodle posted successfully!');
            } else {
                const errorData = await response.json();
                alert(`Failed to post doodle: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error posting doodle:', error);
            alert('An error occurred while posting the doodle.');
        }
    };    

    if (!isClient) {
        return null; // Avoid rendering on the server
    }

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
                    </div>   
                    <div className="size-picker">
                        <span>{size}</span> {/* Display the selected size */}
                        <input 
                            type="range" 
                            id="sizeInput" 
                            min="1" 
                            max="20" 
                            value={size} 
                            onChange={handleSizeChange} 
                            step="1"
                        />
                    </div> 
                </div>             
                <div className='sidebar-button-container'>
                    {/* Import Image Button */}
                    <label htmlFor="fileUpload" className="sidebar-button">
                        Import Image
                    </label>
                    <input
                        type="file"
                        id="fileUpload"
                        name="fileUpload"
                        className="hidden-file-input"
                        onChange={handleFileUpload}
                    />
                    <button onClick={postDoodle} className='sidebar-button'> Post Doodle </button>
                    <button onClick={saveToLocal} className='sidebar-button'> Save To Local System </button>
                </div>
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