const fetch = require("node-fetch");

async function fetch_data(UID){
    let url = "https://enka.network/u/"+UID+"/__data.json"
    const response = await fetch(url).then(r => r.text())
    return JSON.parse(response)
}

async function fetch_nickname(data){
    const response = await data.playerInfo.nickname
    return response
}

async function fetch_AR_level(data){
    const response = await data.playerInfo.level
    return response
}

async function fetch_displayed_chars(data){
    const response = await data.playerInfo.showAvatarInfoList
    return response
}


fetch_data(700378769).then(r => {
    fetch_nickname(r).then(r2 => {
        console.log(r2)
    });
    fetch_displayed_chars(r).then(r2 => {
        console.log(r2)
    });
})
