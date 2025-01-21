import { Route, Routes } from "react-router-dom";
import "./App.css";
import CheckIn from "./pages/CheckIn/page";
import CheckOut from "./pages/CheckOut/page";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<CheckIn/>} />
        <Route path="/check-out" element={<CheckOut/>}/>
      </Routes>
    </>
  );
}

export default App;
