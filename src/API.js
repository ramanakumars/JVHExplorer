export const API_query_vortices = (query) => (
    fetch(
        "/vortices/vortices.json/?_shape=objects&" + query, {
        method: 'GET'
    }
    ).then((data) => (data.json()))
)

export const API_query_extracts = (query) => (
    fetch(
        "/vortices/ellipses.json/?_shape=objects&" + query, {
        method: 'GET'
    }
    ).then((data) => (data.json()))
)

export const API_query_subjects = (query) => (
    fetch(
        "/vortices/subjects.json/?_shape=array&" + query, {
        method: 'GET'
    }
    ).then((data) => (data.json()))
)

