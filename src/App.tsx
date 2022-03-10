import Home from "./views/Home/Home";
import { Navbar } from "./components";
import { Routes, Route, BrowserRouter } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar links={[{ path: "/", title: "Ventas" }]} />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
