const fetch = require("node-fetch");

async function fetch_data(UID){
    let url = "https://enka.network/u/"+UID+"/__data.json"
    const response = await fetch(url).then(r => r.text())
    return JSON.parse(response)
}

async function fetch_base_info(data, option){
    let response = ""
    switch (option){
        case "nickname":
            response = await data.playerInfo.nickname;
            break;
        case "ar_level":
            response = await data.playerInfo.level;
            break;
        case "world_level":
            response = await data.playerInfo.worldLevel;
            break;
        case "namecard_id":
            response = await data.playerInfo.namecardId;
            break;
        case "achievements":
            response = await data.playerInfo.finishAchievementNum;
            break;
        case "abyss_floor":
            response = await data.playerInfo.towerFloorIndex;
            break;
        case "abyss_chamber":
            response = await data.playerInfo.towerLevelIndex;
            break;
        default:
            response = "Info not found"
    }
    return response
}

async function fetch_displayed_chars(data){
    const response = await data.playerInfo.showAvatarInfoList
    return response
}

module.exports = {
    fetch_data,
    fetch_base_info,
    fetch_displayed_chars
}

/*
fetch_data(700378769).then(r => {
    console.log(r)
    fetch_base_info(r, option="nickname").then(r2 => {
        console.log(r2)
    });
    fetch_displayed_chars(r).then(r2 => {
        console.log(r2)
    });
})
*/