export const API_query = (query) => (
  fetch(
    "/vortices/vortices.json/?_shape=objects&" + query, {
      method: 'GET'
    }
  ).then((data) => (data.json()))
)
  
