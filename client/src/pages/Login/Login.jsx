import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import logo from "../../assets/logo.svg";

function Login() {
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const { username, password } = loginForm;

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { isLoggedIn, setIsLoggedIn } = useAuthContext();

  const handleInputChange = (event) => {
    setLoginForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!username.trim()) errors.username = "username is required";
    if (!password.trim()) errors.password = "Password is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setErrors({});

      const response = await fetch(
        `${import.meta.env.VITE_REACT_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );
      const result = await response.json();

      if (response.status == 400) {
        setErrors((previous) => ({
          ...previous,
          login: "Password is incorrect",
        }));
      }

      if (response.status === 404) {
        setErrors((previous) => ({
          ...previous,
          login: "Username does not exist",
        }));
      }

      if (result.token) {
        sessionStorage.setItem("token", result.token);
        sessionStorage.setItem("userId", result.user.id);
        console.log(result);
        setIsLoggedIn(true);
        navigate("/chat");
      }
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");

    if (token && userId) {
      setIsLoggedIn(true);
      navigate("/chat");
    }
  }, []);

  return (
    <>
      <div className="login dark:bg-slate-700 h-screen">
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img className="mx-auto h-16 w-auto" src={logo} alt="Your Company" />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">Sign in to your account</h2>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors?.login && <div className="flex items-center bg-orange-500 text-white text-sm font-bold px-4 py-3" role="alert">
                <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" /></svg>
                <p>{errors.login}</p>
              </div>}
              <div>
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Username</label>
                <div className="mt-2">
                  <input id="username" name="username" type="username" autoComplete="username" value={username} onChange={handleInputChange} required className="block w-full border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-slate-600 dark:ring-0 dark:text-slate-100" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Password</label>
                <div className="mt-2">
                  <input id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={handleInputChange} required className="block w-full border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-slate-600 dark:ring-0 dark:text-slate-100" />
                </div>
              </div>

              <div>
                <button type="submit" className="flex w-full justify-center bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500 dark:text-slate-100">
              Not a member?
              <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Signup for free</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
