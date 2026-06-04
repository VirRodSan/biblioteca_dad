import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UsuariosListPage.module.css";

import { Card } from "../../ui/Card/Card";
import { Button } from "../../ui/Button/Button";
import { Modal } from "../../ui/Modal/Modal";
import { Select } from "../../ui/Select/Select";
import { ROLES } from "../../auth/roles";

import { UsuarioTable } from "../../features/usuarios/components/UsuarioTable";
import { useUsuarios } from "../../features/usuarios/hooks/useUsuarios";

export function UsuariosListPage() {
  const navigate = useNavigate();
  const { usuarios, isLoading, error, loadUsuarios, removeUsuario, changeRol } = useUsuarios();

  const [usuarioToDelete, setUsuarioToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [usuarioToRol, setUsuarioToRol] = useState(null);
  const [nextRol, setNextRol] = useState(ROLES.ALUMNO);
  const [isChangingRol, setIsChangingRol] = useState(false);

  useEffect(() => {
    loadUsuarios();
  }, [loadUsuarios]);

  async function handleDeleteConfirm() {
    if (!usuarioToDelete) return;
    setIsDeleting(true);
    try {
      await removeUsuario(usuarioToDelete.id);
      setUsuarioToDelete(null);
      await loadUsuarios();
    } finally {
      setIsDeleting(false);
    }
  }

  function openChangeRol(usuario) {
    setUsuarioToRol(usuario);
    setNextRol(usuario.rol || usuario.tipo || ROLES.ALUMNO);
  }

  async function handleChangeRolConfirm() {
    if (!usuarioToRol) return;

    setIsChangingRol(true);
    try {
      await changeRol(usuarioToRol.id, nextRol);
      setUsuarioToRol(null);
      await loadUsuarios();
    } finally {
      setIsChangingRol(false);
    }
  }

  return (
    <div className={styles.page}>
      <header className="pageHeader">
        <div>
          <p className="pageKicker">Administracion</p>
          <h1 className="pageTitle">Usuarios</h1>
          <p className="pageDescription">
            Gestiona datos personales, perfiles y permisos de acceso.
          </p>
        </div>
        <Button onClick={() => navigate("/usuarios/crear")}>Nuevo usuario</Button>
      </header>

      <Card title="Usuarios registrados">
        {isLoading && <p className="statusMessage">Cargando...</p>}
        {error && <p className={styles.error}>{error}</p>}

        <UsuarioTable
          usuarios={usuarios}
          onEdit={(u) => navigate(`/usuarios/${u.id}/editar`)}
          onDelete={(u) => setUsuarioToDelete(u)}
          onChangeRol={openChangeRol}
        />
      </Card>

      <Modal
        title="Confirmar eliminacion"
        isOpen={Boolean(usuarioToDelete)}
        onClose={() => setUsuarioToDelete(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setUsuarioToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" isLoading={isDeleting} onClick={handleDeleteConfirm}>
              Eliminar
            </Button>
          </>
        }
      >
        Seguro que deseas eliminar este usuario?
      </Modal>

      <Modal
        title="Cambiar rol"
        isOpen={Boolean(usuarioToRol)}
        onClose={() => setUsuarioToRol(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setUsuarioToRol(null)}>
              Cancelar
            </Button>
            <Button variant="primary" isLoading={isChangingRol} onClick={handleChangeRolConfirm}>
              Guardar
            </Button>
          </>
        }
      >
        <p>Selecciona el nuevo rol:</p>
        <Select
          value={nextRol}
          onChange={(e) => setNextRol(e.target.value)}
          options={[
            { value: ROLES.BIBLIOTECARIO, label: "Bibliotecario" },
            { value: ROLES.DOCENTE, label: "Docente" },
            { value: ROLES.ALUMNO, label: "Alumno" },
          ]}
        />
      </Modal>
    </div>
  );
}
