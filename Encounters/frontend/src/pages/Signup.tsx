import { useState } from "react";

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      // Send signup data to your FastAPI backend
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to create user");
      }

      const data = await res.json();
      console.log("User created:", data);

      setSuccess(true);
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-slate-800 text-white rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Create Account</h2>
      <form onSubmit={handleSignup} className="space-y-3">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 rounded text-black"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded text-black"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded text-black"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-500 w-full"
        >
          Sign Up
        </button>
      </form>

      {error && <p className="text-red-400 mt-3">{error}</p>}
      {success && (
        <p className="text-green-400 mt-3">
          Signup successful!
        </p>
      )}
    </div>
  );
}