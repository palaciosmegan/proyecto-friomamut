export const Sidebar = () => {
    return (
        <aside className="w-64 h-screen bg-gray-800 p-4 shadow-lg">
            <ul>
                <li>
                    <a href="/" className="flex inline-flex items-center space-x-10">
                        <img src="/logo_friomamut.png" alt="Logo" className="h-10" />
                        Friomamut
                    </a>
                </li>
                <li>
                    <a href="/">Layout</a>
                </li>
                <li>
                    <a href="/overview">Overview</a>
                </li>
                <li>
                    <a href="/procesos">Procesos</a>
                </li>
                <li>
                    <a href="/reportes">Reportes</a>
                </li>
            </ul>
        </aside>
    )
}