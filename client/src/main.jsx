import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./redux/store.js";
import { Provider } from "react-redux";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";
// import Dashboard from "./pages/dashboard/Dashboard";
// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<App />}>
                <Route index element={<Dashboard />} />
            </Route>
            <Route path="*" element={<h1>go to localhost:5173/</h1>} />
        </>,
    ),
);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <Suspense fallback={<h1>Loading...</h1>}>
                <RouterProvider router={router} />
            </Suspense>
        </Provider>
    </StrictMode>,
);
