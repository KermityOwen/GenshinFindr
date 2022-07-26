const fetch = require("node-fetch");

async function fetch_data(UID, callback){
    let url = "https://enka.network/u/"+UID+"/__data.json"
    const response = await fetch(url).then(r => r.text())
    if (response == "{}"){
        return callback(Error ("Data cannot be fetched"))
    } else {
        return callback(null, JSON.parse(response))
    }
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
            response = await data.avatarInfoList[parseInt(index)].avatarId;
            break;
        case "constellations_id":
            response = await data.avatarInfoList[parseInt(index)].talentIdList;
            if (response == undefined){
                response = []
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
        case "equips":
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

/*
fetch_data(0, function(err, result) {
    if(err){
        console.log('error')
    } else {
        console.log(`no error`)
    }
}).then(r => {
    //console.log(r)
   
    
    get_base_info(r, option="achievements").then(r2 => {
        console.log(r2)
    });
    
    get_char_info(r, 1, "char_id").then(r2 => {
        console.log(r2)
    });
   
})
*/