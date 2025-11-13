"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pincode: "",
    farmSize: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          pincode: formData.pincode,
          farmSize: parseFloat(formData.farmSize),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto login after registration
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (loginResponse.ok) {
        router.push("/overview");
        router.refresh();
      } else {
        router.push("/login");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card-surface p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-heading mb-2">
              Create Account
            </h1>
            <p className="text-muted">Sign up to start tracking your farm expenses</p>
          </div>

          {error && (
            <div className="alert-error mb-6">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-heading">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="John Doe"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-heading">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="your.email@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-heading">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="form-input"
                placeholder="At least 6 characters"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-heading">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Re-enter your password"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="pincode" className="block text-sm font-medium mb-2 text-heading">
                Pincode
              </label>
              <input
                id="pincode"
                name="pincode"
                type="text"
                value={formData.pincode}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="560001"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="farmSize" className="block text-sm font-medium mb-2 text-heading">
                Farm Size (acres)
              </label>
              <input
                id="farmSize"
                name="farmSize"
                type="number"
                step="0.1"
                value={formData.farmSize}
                onChange={handleChange}
                required
                min="0.1"
                className="form-input"
                placeholder="5.5"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="primary-button w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

