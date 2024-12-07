'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './loginPage.css';

export default function LoginSignupPage() {
    // State variables for username, password, and login/signup toggle
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Tracks if the form is submitting
    const router = useRouter();

    // Function to handle login/signup submission
    const handleSubmit = async () => {
        if (isLoading) return; // Prevent multiple submissions

        setIsLoading(true); // Indicate that the request is in progress
        const apiEndpoint = isSignup ? '/api/signupPage' : '/api/loginPage';

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const { user_id, username } = await response.json();
                localStorage.setItem('user_id', user_id); // Save the user ID locally                
                localStorage.setItem('username', username); // Save username locally
                alert(isSignup ? 'Sign-Up successful!' : 'Login successful!');
                router.push('/homePage'); // Redirect to the homepage
            } else {
                const { error } = await response.json();
                alert(`Failed: ${error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred.');
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    // Toggle between login and signup modes
    const handleToggle = () => {
        if (isLoading) return; // Prevent toggle during submission
        setIsSignup(!isSignup);
    };

    return (
        <div className="login-page">
            {/* Header section with logo */}
            <header className="header">
                <Image
                    className="login-logo"
                    src="/logo.png"
                    alt="App Logo"
                    width={100}
                    height={100}
                />
            </header>

            {/* Main container for login/signup form */}
            <div className="login-container">
                <h1 className="login-title">{isSignup ? 'Sign Up' : 'Log In'}</h1>

                {/* Input for username */}
                <input
                    type="text"
                    className="input-field"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading} // Disable input during loading
                />

                {/* Input for password */}
                <input
                    type="password"
                    className="input-field"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading} // Disable input during loading
                />

                {/* Submit button */}
                <button
                    className="submit-button"
                    onClick={handleSubmit}
                    disabled={isLoading} // Disable button during loading
                >
                    {isLoading ? 'Processing...' : isSignup ? 'Sign Up' : 'Log In'}
                </button>

                {/* Toggle link to switch between login and sign-up */}
                <p className="toggle-link">
                    {isSignup
                        ? 'Already have an account? '
                        : "Don't have an account? "}
                    <span onClick={handleToggle}>
                        {isSignup ? 'Log In' : 'Sign Up'}
                    </span>
                </p>
            </div>
        </div>
    );
}
