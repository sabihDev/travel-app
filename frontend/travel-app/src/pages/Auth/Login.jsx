import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [passsord, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = () => {};
  return (
    <div className="h-screen bg-cyan-100 overflow-hidden relative">
      <div className="login-ui-box right-10 -top-40" />
      <div className="login-ui-box bg-cyan-200 right-1/2 -bottom-40" />

      <div className="container h-screen flex items-center justify-center mx-auto">
        <div className="w-2.5/4 h-[80vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-10 z-50">
          <div>
            <h4 className="text-5xl text-white font-semibold leading-[58px]">
              Every Journey <br /> Tells A Story
            </h4>
            <p className="text-[15px] text-white leading-6 pr-7 mt-4">
              Transform your adventures into timeless memories. <br /> Share
              your world, one destination at a time.
            </p>
          </div>
        </div>

        <div className="w-1.5/4 h-[70vh] bg-white p-16 rounded-r-lg shadow-lg z-10 shadow-cyan-200/20">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold mb-7">Login</h4>

            <input
              type="email"
              value={email}
              onChange={(target) => setEmail(target.value)}
              placeholder="Email"
              className="input-box"
            />

            <PasswordInput
              value={passsord}
              onChange={(target) => setPassword(target.value)}
            />

            <button type="submit" className="btn-primary">
              Login
            </button>

            <p className="text-xs text-slate-500 text-center my-4">Or</p>

            <button
              type="submit"
              className="btn-primary btn-light"
              onClick={() => {
                navigate("/signup");
              }}
            >
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
