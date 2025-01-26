
import { jwtDecode } from "jwt-decode";

const verifyToken = async (token,setOpenCircularProgress,setUserMail,setErrorToken) => {
    setOpenCircularProgress(true);
    try {
      const decodedToken = jwtDecode(token);
      setUserMail(decodedToken.email);
      setOpenCircularProgress(false);
    } catch (error) {
      console.error('Error al verificar el token:', error);
      setOpenCircularProgress(false);
      setErrorToken(true);
      setTimeout(() => {
        setErrorToken(false);
      }, 3000);
      throw error;
    }
};

export default verifyToken