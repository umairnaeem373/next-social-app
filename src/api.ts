const fetchTasks = async (scheduleId: string): Promise<any> => {
  const token = localStorage.getItem('accessToken')
  const res = await fetch(`http://localhost:8000/api/v1/task/${scheduleId}`,{
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
          'Host': 'api.producthunt.com'
        }
      });
  return res.json(); 
}

export default fetchTasks