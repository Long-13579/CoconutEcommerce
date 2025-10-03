import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import ImageLight from '../assets/img/login-office.jpeg'
import ImageDark from '../assets/img/login-office-dark.jpeg'
// import { GithubIcon, TwitterIcon } from '../icons'
import { Label, Input, Button } from '@windmill/react-ui'

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      if (res.ok && data.access) {
        localStorage.setItem("token", data.access);
        localStorage.setItem("role", data.role);
        window.location.href = "/app";
      } else {
        setError(data.detail || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };
  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Login</h1>
              <form onSubmit={handleLogin}>
                <Label>
                  <span>Email</span>
                  <Input className="mt-1" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="john@doe.com" />
                </Label>
                <Label className="mt-4">
                  <span>Password</span>
                  <Input className="mt-1" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="***************" />
                </Label>
                {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
                <Button className="mt-4" block type="submit">
                  Log in
                </Button>
              </form>
              <hr className="my-8" />
              <Button block layout="outline">
                {/* Thay icon Google nếu có */}
                <span className="w-4 h-4 mr-2 inline-block" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.72 1.22 9.22 3.22l6.9-6.9C36.44 2.34 30.6 0 24 0 14.82 0 6.73 5.48 2.69 13.44l8.48 6.6C13.13 13.13 18.13 9.5 24 9.5z" /><path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.5c-.54 2.9-2.16 5.36-4.6 7.04l7.18 5.59C43.98 37.13 46.1 31.3 46.1 24.5z" /><path fill="#FBBC05" d="M11.17 28.04c-1.04-3.13-1.04-6.47 0-9.6l-8.48-6.6C.9 15.7 0 19.74 0 24c0 4.26.9 8.3 2.69 12.16l8.48-6.6z" /><path fill="#EA4335" d="M24 48c6.6 0 12.14-2.18 16.18-5.96l-7.18-5.59c-2.01 1.35-4.6 2.15-7.5 2.15-5.87 0-10.87-3.63-12.83-8.74l-8.48 6.6C6.73 42.52 14.82 48 24 48z" /></g></svg>
                </span>
                Google
              </Button>
              <Button className="mt-4" block layout="outline">
                {/* Thay icon Facebook nếu có */}
                <span className="w-4 h-4 mr-2 inline-block" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20"><path fill="#1877F2" d="M24 48c13.25 0 24-10.75 24-24S37.25 0 24 0 0 10.75 0 24c0 12.02 9.36 21.87 21.25 23.75V31.13h-6.4v-7.13h6.4v-5.44c0-6.34 3.8-9.84 9.62-9.84 2.79 0 5.7.5 5.7.5v6.27h-3.21c-3.17 0-4.16 1.97-4.16 4v4.51h7.09l-1.13 7.13h-5.96v16.62C38.64 45.87 48 36.02 48 24c0-13.25-10.75-24-24-24z" /><path fill="#FFF" d="M32.25 31.13l1.13-7.13h-7.09v-4.51c0-2.03.99-4 4.16-4h3.21v-6.27s-2.91-.5-5.7-.5c-5.82 0-9.62 3.5-9.62 9.84v5.44h-6.4v7.13h6.4v16.62c2.02.32 4.09.5 6.25.5s4.23-.18 6.25-.5V31.13h5.96z" /></svg>
                </span>
                Facebook
              </Button>
              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to="/forgot-password"
                >
                  Forgot your password?
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Login
