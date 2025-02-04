import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(
      (decodedText) => {
        setScanResult(decodedText);
        scanner.clear()
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

  return (
    <div className='App' style={styles.container}>
      <h2 style={styles.title}>QR Scanner</h2>
      {!scanResult ? <div id="reader" style={styles.scanner}></div> : <h3 style={styles.result}>Resultado: {scanResult}</h3>}
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
  result: {
    color: "white",
    fontSize: "20px",
  },
};

export default QRScanner;
