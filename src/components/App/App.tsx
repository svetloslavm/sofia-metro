import { useState } from "react";
import { ReactComponent as ReactLogo } from "assets/svg/react.svg";
import { ReactComponent as ViteLogo } from "assets/svg/vite.svg";
import "./App.css";

export const App = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" className="logo" target="_blank">
          <ViteLogo />
        </a>
        <a href="https://react.dev" className="logo" target="_blank">
          <ReactLogo />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
};
