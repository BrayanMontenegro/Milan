import React from "react";
import { FaCalendarAlt, FaPlus } from "react-icons/fa";
import "../../styles/Citas.css";

const CitasHeader = ({ onNuevaCita }) => {
    return (
        <div className="citas-header">
            <div className="container-fluid px-3 px-md-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">   

                    <div>
                        <div className="d-flex align-items-center gap-3">
                            <div className="citas-header-icon">
                                <FaCalendarAlt />
                            </div>

                            <div>
                                <h2 className="mb-1">Citas</h2>
                                <p className="mb-0">
                                    Gestión de citas médicas y profesionales de la clínica
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn btn-milan-primary"
                        onClick={onNuevaCita}
                    >
                        <FaPlus className="me-2" />
                        Nueva cita
                    </button>
                </div>
            </div>
        </div>
    );
}
export default CitasHeader;