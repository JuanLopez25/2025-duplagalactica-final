import React, { useState } from "react";
import { ReactQRScanner } from "react-qr-scanner";
import { useNavigate } from "react-router-dom";

const QrScanner = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleScan = (data) => {
    if (data) {
      navigate(data); // Usar el contenido del QR para redirigir
    }
  };

  const handleError = (err) => {
    console.error("Error al escanear QR:", err);
    setError("No se pudo leer el código QR.");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Lector de QR</h1>
      <ReactQRScanner
        delay={300}
        style={{ width: "100%" }}
        onError={handleError}
        onScan={handleScan}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default QrScanner;
