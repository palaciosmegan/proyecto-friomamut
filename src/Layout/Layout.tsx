import { Outlet } from "react-router-dom";
import { Nav } from "./Nav";

export const Layout = () => {
    return (
        <div>
            <div>
                <Nav />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}