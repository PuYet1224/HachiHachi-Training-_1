import React from "react";
import './App.css'
import Sidebar from "./Components/Sidebar/Sidebar";
import HeaderWide from "./Components/Header/HeaderWide";
import Toolbar from "./Components/Toolbar/Toolbar";
import FilterHeader from "./Components/FilterHeader/FilterHeader";
import ProductList from "./Components/ProductList/ProductList";

const App = () => {
  return (
    <div className="container">
      <div className="left-side">
        <Sidebar />
      </div>
      <div className="right-side">
        <HeaderWide />
        {/* <Toolbar/> */}
        {/* <FilterHeader/> */}
        <ProductList/>
      </div>
    </div>
  );
};

export default App;
