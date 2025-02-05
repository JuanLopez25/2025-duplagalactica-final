const fetchMembership = async (setMemberships,setOpenCircularProgress,setClassPrice, setMonthlyPrice, setYearlyPrice) => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
          console.error('Token not available in localStorage');
          return;
      }
      const response = await fetch('https://two025-duplagalactica-final.onrender.com/get_membership_template', {
        method: 'GET', 
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Error fetching memberships: ' + response.statusText);
    }

    const membershipsData = await response.json();


    setClassPrice(membershipsData.find(membership => membership.type === 'Class')?.price);
    setMonthlyPrice(membershipsData.find(membership => membership.type === 'Monthly')?.price);
    setYearlyPrice(membershipsData.find(membership => membership.type === 'Yearly')?.price);
    setMemberships(membershipsData)
    setOpenCircularProgress(false);
    } catch (error) {
      console.error("Error fetching memberships:", error);
    }
}

export default fetchMembership