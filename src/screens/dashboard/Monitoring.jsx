import React from 'react'
import MonitoringView from "../../components/dashboard/monitoring/MonitoringView"; // Importa el componente MonitoringView

const Monitoring = ({ crops }) => {
    return <MonitoringView crops={crops} />; // Pasa crops a MonitoringView
}

export default Monitoring