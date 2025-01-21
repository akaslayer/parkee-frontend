const useTickets = () => {
  const fetchTicket = async (formData: any) => {
    const response = await fetch(`http://localhost:8080/api/tickets/check`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data;
  };

  const updateTicket = async (formData: any) => {
    const response = await fetch(`http://localhost:8080/api/tickets`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    return data;
  };

  return {
    fetchTicket,
    updateTicket,
  };
};

export default useTickets;
