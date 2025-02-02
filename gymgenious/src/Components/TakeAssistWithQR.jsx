import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

const MarkAttendance = () => {
  const videoRef = useRef(null);
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReader
      .decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
        if (result) {
          setQrData(result.getText());
          setError(null);
          processAttendance(result.getText());
        }
        if (err) {
          console.error(err);
        }
      })
      .catch((err) => {
        console.error("Error al acceder a la cámara:", err);
        setError("No se pudo acceder a la cámara.");
      });

    return () => codeReader.reset();
  }, []);

  const processAttendance = async (token) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://two025-duplagalactica-final.onrender.com/attendance?token=${token}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
    } catch (err) {
      console.error("Error al registrar la asistencia:", err);
      setError("Error al registrar la asistencia.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="full-screen-image-login">
      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          <video ref={videoRef} style={{ width: "100%" }} />
          {qrData && <p>QR Detectado: {qrData}</p>}
          {error && <Alert severity="error">{error}</Alert>}
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;
