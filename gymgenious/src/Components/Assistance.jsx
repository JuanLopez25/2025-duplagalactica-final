import React, { useState, useRef, useEffect } from "react";

const CameraPage = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        setHasPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error al acceder a la cámara:", err);
        setError("No se pudo acceder a la cámara.");
      });

    // Limpiar el stream cuando el componente se desmonta
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!hasPermission) {
    return <div>Esperando permisos para acceder a la cámara...</div>;
  }

  return (
    <div>
      <h1>Usa tu Cámara</h1>
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%" }} />
    </div>
  );
};

export default CameraPage;
