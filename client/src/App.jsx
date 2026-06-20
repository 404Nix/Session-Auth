import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const App = () => {
    const user = useSelector((state) => state.auth);
    console.log(user);

    return (
        <>
            <Outlet />
        </>
    );
};

export default App;
