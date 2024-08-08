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

export const API_query_subject_image = (subject_id) => (
    fetch('https://www.zooniverse.org/api/subjects/' + subject_id, {
        method: "GET",
        headers: {
            Accept: "application/vnd.api+json; version=1",
            "Content-Type": "application/json",
        }
    }).then((result) => (
        result.json().then((data) => (data.subjects[0].locations[0]['image/png']))
    ))
)
