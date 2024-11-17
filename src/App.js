import React from "react";
import './App.css'
import Sidebar from "./Components/Sidebar/Sidebar";
import Header1 from "./Components/Header1/Header1";
import ProductList from "./Components/ProductList/ProductList";

const App = () => {
  return (
    <div className="container">
      <div className="left-side">
        <Sidebar />
      </div>
      <div className="right-side">
        <Header1 />
        <ProductList/>
      </div>
    </div>
  );
};

export default App;
