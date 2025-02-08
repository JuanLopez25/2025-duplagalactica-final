
const fetchUser = async (setType,setOpenCircularProgress,userMail,navigate,setWarningConnection) => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
          console.error('Token not available in localStorage');
          return;
      }
      const encodedEmail = encodeURIComponent(userMail);
      const response = await fetch(`https://two025-duplagalactica-final.onrender.com/get_unique_user_by_email?mail=${encodedEmail}`, {
          method: 'GET', 
          headers: {
              'Authorization': `Bearer ${authToken}`
          }
      });

      if (!response.ok) {
          throw new Error('Error fetching user data: ' + response.statusText);
      }

      const userData = await response.json();
      setType(userData.type);

    } catch (error) {
        console.error("Error fetching user:", error);
        setOpenCircularProgress(false)
        setWarningConnection(true);
        setTimeout(() => {
            setWarningConnection(false);
            //localStorage.removeItem('authToken');
            navigate('/')
        }, 3000);
    } finally {
      setOpenCircularProgress(false)
    }
};

export default fetchUser