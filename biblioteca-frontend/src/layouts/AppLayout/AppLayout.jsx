// Estructura principal de navegacion para pantallas autenticadas.
import { Outlet} from "react-router-dom";
import styles from "./AppLayout.module.css"
import {Navbar} from "../Navbar/Navbar";
import {Sidebar} from "../Sidebar/Sidebar"; 

// Componente que renderiza esta parte de la interfaz.
export function AppLayout() {
  return (
    <div className={styles.shell}>
        <Navbar/>
        <div className={styles.body}>
            <Sidebar />
            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    </div>
  );
}



