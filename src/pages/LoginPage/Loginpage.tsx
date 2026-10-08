import "./LoginPage.css";

import { FaUser, FaLock } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "../../validations/loginSchema";
import { loginUser } from "../../services/authService";

import { z } from "zod";

import illustration from "../../assets/illustration.jpg";

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await loginUser(
        data.email,
        data.password
      );

      if (result.success) {
        localStorage.setItem(
          "user",
          JSON.stringify(result.data)
        );

        navigate("/dashboard");
      } else {
        alert(
          result.data.message ||
            "Invalid Email or Password"
        );
      }
    } catch (error) {
      console.error("Login Error:", error);

      alert("Unable to connect to server.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">

        {/* LEFT SIDE */}

        <div className="login-left">
          <div className="logo">
            <MdGroups size={35}  className="logo-icon" />
            <span style={{ color: "#222252" }}>EMS</span>
          </div>

          <div className="left-content">
            <h1>
              Employee <br />
              <span>Management</span> <br />
              System
            </h1>

            <p>
              Manage your employees, track performance,
              monitor departments, and grow your
              organization efficiently.
            </p>

            <img
              src={illustration}
              alt="Employee Management"
              className="illustration"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="login-right">

          <div className="login-box">

            <h2>Welcome Back 👋</h2>

            <p className="subtitle">
              Sign in to your account to continue
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
            >

              <label>Email Address</label>

              <div className="input-group">
                <FaUser className="input-icon" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                />
              </div>

              {errors.email && (
                <p className="error">
                  {errors.email.message}
                </p>
              )}

              <label>Password</label>

              <div className="input-group">
                <FaLock className="input-icon" />

                <input
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />
              </div>

              {errors.password && (
                <p className="error">
                  {errors.password.message}
                </p>
              )}

              <div className="login-options">

                <label className="remember">
                  <input type="checkbox" />
                  Remember Me
                </label>

                <a href="#">
                  Forgot Password?
                </a>

              </div>

              <button
                type="submit"
                className="signin-btn"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Signing In..."
                  : "Sign In"}
              </button>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;