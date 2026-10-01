import React from "react";
import { FaPlus } from "react-icons/fa";
import "../../styles/Especialistas.css";

const EspecialidadesHeader = ({ onAgregar }) => {
    return (
        <div className="especialidades-header">
            <div className="d-flex align-items-center gap-3">
                <div className="especialidades-header-icon">
                    <FaPlus />
                </div>
                <div>
                    <h2 className="mb-1">Especialidades</h2>
                    <p className="mb-0">Gestión de especialidades médicas</p>
                </div>
            </div>
            
            <button
                className="btn btn-primary"
                onClick={onAgregar} 
            >
                <FaPlus /> Agregar Especialidad
            </button>
        </div>
    );
}
export default EspecialidadesHeader;