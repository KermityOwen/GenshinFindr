const fetch = require("node-fetch");

async function fetch_data(UID){
    let url = "https://enka.network/u/"+UID+"/__data.json"
    const response = await fetch(url).then(r => r.text())
    return JSON.parse(response)
}

async function get_base_info(data, option){
    let response = ""
    switch (option){
        case "nickname":
            response = await data.playerInfo.nickname;
            break;
        case "signature":
            response = await data.playerInfo.signature;
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
        case "prof_pic":
            response = await data.playerInfo.profilePicture.avatarId;
            break;
        default:
            response = await data.playerInfo
    }
    return response
}

async function fetch_displayed_chars(data){
    const response = await data.playerInfo.showAvatarInfoList
    return response
}


async function get_char_info(data, index, option){
    let response = ""
    switch (option){
        case "char_id":
            response = await data.avatarInfoList[parseInt(index)].avatarID;
            break;
        case "constellations_id":
            response = await data.avatarInfoList[parseInt(index)].talentIdList;
            if (response == undefined){
                response = [0]
            }
            break;
        case "char_properties":
            response = await data.avatarInfoList[parseInt(index)].propMap;
            break;
        //{id: value}
        case "fight_properties":
            response = await data.avatarInfoList[parseInt(index)].fightPropMap;
            break;
        //No purpose yet (Just fetch-able values)
        case "skill_set_id":
            response = await data.avatarInfoList[parseInt(index)].skillDepotId;
            break;
        //No purpose yet (Just fetch-able values)
        case "unlocked_skill_id":
            response = await data.avatarInfoList[parseInt(index)].inherentProudSkillList;
            break;
        //(skill_id: level)
        case "skills_lvl":
            response = await data.avatarInfoList[parseInt(index)].skillLevelMap;
            break;
        case "equips_artifacts":
            response = await data.avatarInfoList[parseInt(index)].equipList;
            break;
        case "friendship_lvl":
            response = await data.avatarInfoList[parseInt(index)].fetterInfo.expLevel;
            break;
        default:
            response = await data.avatarInfoList[parseInt(index)];
    }
    
    return response
}

//2-down
async function get_char_equip(data, index){
    const response = await data[parseInt(index)];
    return response;
}


module.exports = {
    fetch_data,
    get_base_info,
    fetch_displayed_chars,
    get_char_info
}


fetch_data(700378769).then(r => {
    //console.log(r)
    /*
    fetch_base_info(r, option="prof_pic").then(r2 => {
        console.log(r2)
    });
    
    get_char_info(r, 1, "equips_artifacts").then(r2 => {
        get_char_equip(r2, 2).then(r3 => {
            console.log(r3)
        })
    });
    */
})
