import { Outlet } from "react-router-dom";
import { Nav } from "./Nav";
import { Sidebar } from "./Sidebar";

export const Layout = () => {
    return (
        <div className="grid grid-cols-[16rem_auto]">
            <Sidebar />
            <div>
                <Nav />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}