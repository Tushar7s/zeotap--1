import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Eligibility from "./components/Eligibility";
import AddRuleForm from "./components/AddRuleForm";
import CombineRulesForm from "./components/CombineRulesForm";
import RuleManager from "./components/RuleManager";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
const AppLayout = () => {
  return(
    <div className="app">
      <Navbar/>
      <Outlet />
    </div>
  )
}

const appRouter = createBrowserRouter([
  {
    path:'/',
    element: <AppLayout/>,
    children:[
      {
        path:'/',
        element:<HomePage/>
      },
      {
        path:'/eligibility',
        element: <Eligibility/>
      },
      {
      path:'/addrule',
      element: <AddRuleForm/>
      },
      {
      path:'/combinerules',
      element: <CombineRulesForm/>
      },
      {
        path:'/rules',
        element: <RuleManager/>
      }
    ],
  }
])

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />); 