import React from "react";

import "./index.css";
import ToDoListing from "./pages/ToDoListing";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="">
      <ToDoListing />
      <ToastContainer />
    </div>

    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<TempListing />} />
    //     <Route path="/task" element={<ToDoListing />} />
    //   </Routes>
    // </BrowserRouter>
  );
}

export default App;
