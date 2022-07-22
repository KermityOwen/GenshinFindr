const { get_char_info , get_base_info, fetch_data} = require("./data_fetcher");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

const char_img_map = require("../resources/character_mapping.json")

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

    let prof_pic = char_img_map[await get_base_info(data, option="prof_pic")].SideIconName
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

module.exports = {
    create_player_embed
}

/*
fetch_data(700378769).then(r => {
    
    create_player_embed(r).then(r2 => {
        console.log(r2)
    })
    
})
*/
