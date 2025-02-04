import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScanner = () => {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(
      (decodedText) => {
        if (isValidURL(decodedText)) {
          window.location.href = decodedText;
        } else {
          alert("El código escaneado no es un enlace válido: " + decodedText);
        }
        scanner.clear();
      },
      (error) => {
        console.log(error);
      }
    );

    scannerRef.current = scanner;

    return () => {
      scanner.clear();
    };
  }, []);

  const isValidURL = (text) => {
    try {
      new URL(text);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className='App' style={styles.container}>
      <h2 style={styles.title}>QR Scanner</h2>
      <div id="reader" style={styles.scanner}></div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#121212",
  },
  title: {
    color: "white",
    marginBottom: "20px",
  },
  scanner: {
    filter: "invert(1)",
  },
};

export default QRScanner;
