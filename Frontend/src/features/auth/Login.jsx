import React, { useState, useEffect } from 'react'; // Added useState
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { loginUser } from '../../features/auth/authSlice';



// Define validation schema with Zod
const loginSchema = z.object({
    email: z.string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
    password: z.string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
            message: "Password must contain at least one uppercase, lowercase, number, and special character"
        })
});

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Assuming 'loding' might be a typo and intended to be 'loading'
    // If 'loding' is correct in your authSlice, keep it as is.
    const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

    const [showPassword, setShowPassword] = useState(false); // State for password visibility

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema)
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = (data) => {
        const backendData = {
            emailId: data.email,
            password: data.password
            // add other fields if needed
        };
        dispatch(loginUser(backendData));
        console.log(backendData);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1672009190560-12e7bade8d09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
            <div className="card w-full max-w-md bg-base-100/10 backdrop-blur-lg shadow-2xl border border-white/20 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary rounded-full opacity-10 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary rounded-full opacity-10 animate-blob animation-delay-4000"></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent rounded-full opacity-10 animate-blob"></div>

                <div className="card-body p-8 relative z-10">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-white mb-2 animate-fade-in-down">
                            Welcome Back
                        </h2>
                        <p className="text-white/80 text-lg animate-fade-in-down animate-delay-100">
                            Sign in to your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="form-control animate-fade-in-up animate-delay-200">
                            <label className="label">
                                <span className="label-text text-white/80">Email</span>
                            </label>
                            <input
                                type="email"
                                {...register('email')}
                                className={`input input-bordered w-full bg-white/5 backdrop-blur-sm ${errors.email ? 'input-error' : 'border-white/20'} text-white placeholder-white/40`}
                                placeholder="mostakin@example.com"
                            />
                            {errors.email && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        {errors.email.message}
                                    </span>
                                </label>
                            )}
                        </div>

                        <div className="form-control animate-fade-in-up animate-delay-300">
                            <label className="label">
                                <span className="label-text text-white/80">Password</span>
                            </label>
                            <div className="relative"> {/* Wrapper for input and icon */}
                                <input
                                    type={showPassword ? "text" : "password"} // Dynamic type
                                    {...register('password')}
                                    className={`input input-bordered w-full bg-white/5 backdrop-blur-sm pr-10 ${errors.password ? 'input-error' : 'border-white/20'} text-white placeholder-white/40`} // Added pr-10 for icon space
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button" // Prevent form submission
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-white/70 hover:text-primary focus:outline-none"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        // Eye Slash Icon (when password is visible)
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.575M5.121 5.121A15.085 15.085 0 0112 12a15.082 15.082 0 015.879-1.121M12 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15" />
                                        </svg>
                                    ) : (
                                        // Eye Icon (when password is hidden)
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        {errors.password.message}
                                    </span>
                                </label>
                            )}
                        </div>

                        <div className="flex justify-between items-center animate-fade-in-up animate-delay-400">
                            <label className="label cursor-pointer justify-start gap-3">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary bg-white/5 border-white/20"
                                />
                                <span className="label-text text-white/80">Remember me</span>
                            </label>
                            <a
                                href="#" // Consider using Link from react-router-dom if it's an internal route
                                className="text-sm text-white/80 hover:text-primary hover:underline transition-colors duration-200"
                            >
                                Forgot password?
                            </a>
                        </div>

                        <div className="mt-6 animate-fade-in-up animate-delay-500">
                            <button
                                type="submit"
                                className="btn btn-block relative overflow-hidden group"
                                disabled={loading} // Optionally disable button when loading
                            >
                                {/* Base gradient */}
                                <span className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90 group-hover:from-primary group-hover:to-secondary transition-all duration-500"></span>
                                {/* Glass overlay effect */}
                                <span className="absolute inset-0 bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300"></span>
                                {/* Animated border */}
                                <span className="absolute inset-0 border border-white/20 group-hover:border-white/40 transition-all duration-300 rounded-lg"></span>
                                {/* Shine effect on hover */}
                                <span className="absolute top-0 left-1/2 w-1/2 h-full bg-white/10 transform -translate-x-1/2 -skew-x-12 group-hover:left-full group-hover:-translate-x-0 transition-all duration-700"></span>

                                {/* Button content */}
                                <span className="relative z-10 flex items-center justify-center">
                                    {loading ? (
                                        <span className="loading loading-spinner loading-xs"></span>
                                    ) : (
                                        <>
                                            <span className="group-hover:scale-105 transition-transform duration-300">
                                                Sign In
                                            </span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 ml-2 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </>
                                    )}
                                </span>
                            </button>
                             {/* Display API errors */}
                            {/* {error && (
                                <label className="label mt-2">
                                    <span className="label-text-alt text-error text-center w-full">{typeof error === 'string' ? error : 'Login failed. Please try again.'}</span>
                                </label>
                            )} */}
                        </div>
                    </form>

                    <div className="divider text-white/50 my-6 animate-fade-in-up animate-delay-600">
                        OR
                    </div>

                    <div className="flex justify-center gap-4 animate-fade-in-up animate-delay-700">
                        {/* Google */}
                        <button className="btn btn-outline btn-circle btn-sm text-white border-white/20 hover:bg-white/10 hover:border-white/30">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 48 48"
                            >
                                <path
                                    fill="#FFC107"
                                    d="M43.6 20.5H42V20H24v8h11.3C34.2 33.3 29.6 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.7 2.9l5.7-5.7C33.3 6.2 28.9 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"
                                />
                                <path
                                    fill="#FF3D00"
                                    d="M6.3 14.7l6.6 4.8C14.3 16.2 18.8 13 24 13c3 0 5.7 1.1 7.7 2.9l5.7-5.7C33.3 6.2 28.9 4 24 4 15.5 4 8.4 9.1 6.3 14.7z"
                                />
                                <path
                                    fill="#4CAF50"
                                    d="M24 44c5.3 0 10.2-1.8 14-4.9l-6.5-5.3C29.5 35.2 26.9 36 24 36c-5.6 0-10.2-3.6-11.8-8.5l-6.6 5.1C9.9 39.5 16.4 44 24 44z"
                                />
                                <path
                                    fill="#1976D2"
                                    d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.4-4.2 6-7.7 7.1l.1.1 6.5 5.3c-.5.3 9.8-6.9 9.8-20z"
                                />
                            </svg>
                        </button>

                        {/* GitHub */}
                        <button className="btn btn-outline btn-circle btn-sm text-white border-white/20 hover:bg-white/10 hover:border-white/30">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12 0a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.17c-3.34.73-4.04-1.61-4.04-1.61a3.18 3.18 0 0 0-1.34-1.77c-1.1-.75.09-.74.09-.74a2.52 2.52 0 0 1 1.84 1.24 2.54 2.54 0 0 0 3.47 1 2.54 2.54 0 0 1 .76-1.6c-2.67-.3-5.47-1.34-5.47-5.95a4.64 4.64 0 0 1 1.24-3.22 4.3 4.3 0 0 1 .12-3.17s1-.32 3.3 1.23a11.38 11.38 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23a4.3 4.3 0 0 1 .12 3.17 4.64 4.64 0 0 1 1.24 3.22c0 4.61-2.8 5.64-5.47 5.94a2.85 2.85 0 0 1 .81 2.21v3.29c0 .32.21.69.82.58A12 12 0 0 0 12 0z" />
                            </svg>
                        </button>

                        {/* Facebook */}
                        <button className="btn btn-outline btn-circle btn-sm text-white border-white/20 hover:bg-white/10 hover:border-white/30">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M15 3h-2.5C11.1 3 10 4.1 10 5.5V8H8v3h2v10h3V11h2.6l.4-3H13V5.5c0-.3.2-.5.5-.5H15V3z" />
                            </svg>
                        </button>
                    </div>

                    <div className="text-center mt-6 animate-fade-in-up animate-delay-800">
                        <p className="text-white/70">
                            Don't have an account?{' '}
                            <a
                                href="/signup" // Consider using Link from react-router-dom
                                className="font-medium text-white hover:text-primary hover:underline transition-colors duration-200"
                            >
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;