


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
                <button onClick={handleClick} className='sidebar-button'> Placeholder 1 </button>
                <button onClick={handleClick} className='sidebar-button'> Placeholder 2 </button>
                <button onClick={handleClick} className='sidebar-button'> Placeholder 3 </button>
            </div>
            <button onClick={handleClick} className='share-button'> Post Doodle</button>
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


/*
Color codes we can use for a scheme:
Darkest Blue: #2C2A4A
Darkest Blue/Purple: #4F518C
Medium Purple: #907AD6
Lightest Purple: #DABFFF
Lightest Blue: #7FDEFF
White and Black as well, of course
*/
