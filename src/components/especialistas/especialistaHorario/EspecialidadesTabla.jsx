import React from "react";
import {
    FaEye,  
    FaEdit,
    FaPowerOff,
    FaUserMd,
} from "react-icons/fa";
import "../../styles/Especialistas.css";

const EspecialidadesTabla = ({
    especialidades,
    onVer, 
    onEditar,
    onCambiarEstado,
}) => {
    if (!especialidades.length) {
        return null;
    }

    return (
        <div className="table-responsive">
            <table className="table especialidades-table align-middle mb-0">
                <thead>
                    <tr>
                        <th>Especialidad</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th className="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {especialidades.map((especialidad) => {
                        return (
                            <tr key={especialidad.id_especialidad}>

                                {/* ESPECIALIDAD */}
                                <td>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="especialidad-avatar">
                                            <FaUserMd />
                                        </div>
                                        <div>
                                            <div className="fw-semibold">
                                                {especialidad.nombre}
                                            </div>
                                            <small className="text-muted">
                                                {especialidad.descripcion || "Sin descripción"}
                                            </small>
                                        </div>
                                    </div>
                                </td>

                                {/* ESTADO */}  
                            
                            <td>
                                <span
                                    className={`badge ${
                                        especialidad.estado === "Activo"
                                            ? "bg-success"
                                            : "bg-danger"
                                    }`} 
                                >
                                    {especialidad.estado}
                                </span>
                            </td>
                            
                                {/* ACCIONES */}
                                <td className="text-end">
                                    <div className="d-flex justify-content-end gap-2">      
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => onVer(especialidad)}
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            className="btn btn-sm btn-warning"
                                            onClick={() => onEditar(especialidad)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            className={`btn btn-sm ${
                                                especialidad.estado === "Activo"
                                                    ? "btn-danger"
                                                    : "btn-success"
                                            }`}
                                            onClick={() => onCambiarEstado(especialidad)}
                                        >
                                            <FaPowerOff />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
export default EspecialidadesTabla;