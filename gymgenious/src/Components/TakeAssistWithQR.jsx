import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

const MarkAttendance = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error al acceder a la cámara:", err);
        setError("No se pudo acceder a la cámara.");
      }
    };

    startCamera();
  }, []);

  const scanQRCode = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext("2d");

      // Dibujar el video en el canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Extraer los datos de imagen del canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        setQrData(code.data); // El contenido del QR
        setError(null);
        processAttendance(code.data); // Llamar al backend con el token del QR
      }
    }
  };

  const processAttendance = async (token) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://two025-duplagalactica-final.onrender.com/attendance?token=${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      setLoading(false);
    } catch (err) {
      console.error("Error al procesar la asistencia:", err);
      setError("Error al registrar la asistencia.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      scanQRCode(); // Escanea el QR cada 500ms
    }, 500);

    return () => clearInterval(interval); // Limpiar el intervalo cuando se desmonte
  }, []);

  return (
    <div className="full-screen-image-login">
      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          <video ref={videoRef} style={{ width: "100%" }} />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          {qrData && <p>QR Detectado: {qrData}</p>}
          {error && <Alert severity="error">{error}</Alert>}
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;
