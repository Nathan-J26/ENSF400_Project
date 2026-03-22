import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Homepage";
import MatrixRain from "./MatrixRain";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <MatrixRain />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
