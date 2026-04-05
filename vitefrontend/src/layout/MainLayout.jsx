// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/layout/Sidebar";
// import Navbar from "../components/layout/Navbar";

// export default function MainLayout() {
//     return (
//         <div className="flex min-h-screen bg-gray-50">
//             <Sidebar />

//             <div className="flex-1 flex flex-col">
//                 <Navbar />
//                 <main className="p-6">
//                     <Outlet />
//                 </main>
//             </div>
//         </div>
//     );
// }




import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function MainLayout() {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Sidebar */}
            <Sidebar open={open} setOpen={setOpen} />

            {/* Main */}
            <div className="flex-1 flex flex-col w-full">
                <Navbar setOpen={setOpen} />
                <main className="p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}