import Constants from '../../components/common/Constants.js';

const resource = Constants.API_URL + '/watchlist/portfolio';

const watchlist_portfolio = {
    get: (callback, current_day,tagId) => {
        let accessToken = localStorage.getItem("accessToken");
        fetch(resource + "?" + "tag_id="+tagId+"&current_day="+current_day, {
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        })
            .then((response) => {
                return response.json()
            })
            .then((json) => {
                callback(json, current_day,json)
            })
    },
}

export default watchlist_portfolio
