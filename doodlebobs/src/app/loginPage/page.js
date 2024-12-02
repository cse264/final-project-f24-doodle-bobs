'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import router for navigation
import './loginPage.css'; // Import CSS for styling

function LoginSignupPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false); // Toggle between login and sign-up
    const router = useRouter();

    const handleSubmit = async () => {
        const apiEndpoint = isSignup
            ? 'http://localhost:3000/api/signupPage' // Use sign-up route
            : 'http://localhost:3000/api/loginPage'; // Use login route

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const { user_id } = await response.json();
                localStorage.setItem('user_id', user_id); // Save user_id to localStorage
                alert(isSignup ? 'Sign-Up successful!' : 'Login successful!');
                router.push('/homePage'); // Redirect to homepage
            } else {
                const { error } = await response.json();
                alert(`Failed: ${error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred.');
        }
    };

    return (
        <div>
            <h1>{isSignup ? 'Sign Up' : 'Log In'}</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSubmit}>{isSignup ? 'Sign Up' : 'Log In'}</button>
            <div>
                <p>
                    {isSignup
                        ? 'Already have an account? '
                        : "Don't have an account? "}
                    <span
                        onClick={() => setIsSignup(!isSignup)}
                        style={{ color: 'blue', cursor: 'pointer' }}
                    >
                        {isSignup ? 'Log In' : 'Sign Up'}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default LoginSignupPage;
