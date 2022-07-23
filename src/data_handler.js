const { get_char_info , get_base_info, fetch_data} = require("./data_fetcher");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

const char_map = require("../resources/character_mapping.json");
const names_map = require("../resources/names_mapping.json");

async function create_player_embed(data){
    //Somehow + is faster for combining strings than concat so...
    let arwr = ("AR: " + await get_base_info(data, option="ar_level") + " --- WR: " + await get_base_info(data, option="world_level"));
    let signature = await get_base_info(data, option="signature")
    //In the case of no signatures
    if (signature == undefined){
        signature = "*no signature"
    }
    let nickname = await get_base_info(data, option="nickname")
    let spiral = await get_base_info(data, option="abyss_floor") + "-" + await get_base_info(data, option="abyss_chamber")
    let achievements = await get_base_info(data, option="achievements")

    let prof_pic = char_map[await get_base_info(data, option="prof_pic")].IconName
    let prof_pic_url = "https://enka.network/ui/" + prof_pic + ".png"

    const playerEmbed = new EmbedBuilder()
    .setColor('#29cf84')
    .setTitle(nickname)
    .setDescription(signature)
    .setThumbnail(prof_pic_url)
    .addFields([
        { name: "Adventure Rank --- WR", value: `${arwr}` || "Error",},
        { name: "Highest Spiral Abyss (Version 2.8)", value: `${spiral}` || "Error" },
        { name: "Number of Achievements", value: `${achievements}` || "Error" },
    ]);
    
    return playerEmbed
}

async function calculate_CM(data){
    let crit_rate = await data["20"];
    let crit_dmg = await data["22"];

    return await 1 + crit_rate * crit_dmg;
}

async function create_character_embed(data, index=1){

    let player_name = await get_base_info(data, option="nickname")
    let name = names_map[char_map[await get_char_info(data, index, option="char_id")].NameTextMapHash]
    let title = (`${player_name}'s ${name}`)

    let char_pic = char_map[await get_char_info(data, index, option="char_id")].IconName
    let char_pic_url = "https://enka.network/ui/" + char_pic + ".png"

    const characterEmbed = new EmbedBuilder()
        .setColor('#29cf84')
        .setTitle(title)
        .setDescription('pending')
        .setThumbnail(char_pic_url)
    
    return characterEmbed
}

module.exports = {
    create_player_embed,
    create_character_embed
}

/*
fetch_data(700378769).then(r => {
    
    create_character_embed(r).then(r2 => {
        console.log(r2)
    })
    
})


const fs = require('fs');

for (let i = 10000002; i<10000066; i++){
    try{
        char_img_map[i].CharName = char_img_map[i].SideIconName.replace('UI_AvatarIcon_Side_','')
    } catch (e) {
        //console.log(i)
    }
}

fs.writeFile("../resources/character_mapping.json", JSON.stringify(char_img_map, null, 4), 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }

    console.log(char_img_map)
    console.log("JSON file has been saved.");
})
*/