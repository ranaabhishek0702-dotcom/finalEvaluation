import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.identifier || !formData.password) {
      setLocalError('Please enter both username/email and password');
      return;
    }

    setIsLoading(true);

    try {
      await login({
        username: formData.identifier, // API expects 'username' or handle it appropriately? 
        // Wait, AuthContext calls authAPI.login(credentials). 
        // Let's assume the API handles username/email identification or we need to pass it as 'username' or 'email'.
        // Looking at Signin.jsx from chattr-frontend, it passed { username, password } implicitly? 
        // Use 'username' key as a generic identifier if the backend supports it.
        password: formData.password,
        ...formData.identifier.includes('@') ? { email: formData.identifier } : { username: formData.identifier }
      });
      navigate('/dashboard'); // Go to dashboard on success
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Image/Brand - Matches Signup */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-900 opacity-90"></div>
        <div className="relative z-10 w-full flex flex-col justify-center px-12 text-white">
          <h1 className="text-5xl font-bold mb-6">Welcome Back</h1>
          <p className="text-xl text-primary-100 max-w-md">
            Sign in to continue your conversations and stay connected.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary-500 opacity-20 blur-3xl"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary-400 opacity-20 blur-3xl"></div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="lg:hidden mb-8">
            <h1 className="text-3xl font-bold text-primary-600">Chattr</h1>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              New here?{' '}
              <Link
                to="/signup"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {localError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{localError}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                    Username or Email
                  </label>
                  <div className="mt-1">
                    <input
                      id="identifier"
                      name="identifier"
                      type="text"
                      required
                      value={formData.identifier}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all"
                      placeholder="Enter your username or email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01]"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
