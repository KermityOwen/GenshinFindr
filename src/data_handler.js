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

    return 1 + crit_rate * crit_dmg;
}

function gen_rarity_stars(rarity){
    if (rarity == "QUALITY_ORANGE"){
        return (":star:".repeat(5))
    } else {
        return (":star:".repeat(4))
    }
}

function gen_constellation(const_arr){
    let amount = const_arr.length
    let max_lvl = ""
    return (":small_blue_diamond:".repeat(amount) + ":white_small_square:".repeat(6-amount))
}

function gen_element(char_id){
    let element = char_map[char_id].Element
    switch (element){
        case "Ice":
            return "<:ICE_ADD_HURT:971462863384367114> Cryo <:ICE_ADD_HURT:971462863384367114>";
            break;
        case "Electric":
            return "<:ELEC_ADD_HURT:971462863241773056> Electro <:ELEC_ADD_HURT:971462863241773056>";
            break;
        case "Fire":
            return "<:FIRE_ADD_HURT:971462863354986546> Pyro <:FIRE_ADD_HURT:971462863354986546>";
            break;
        case "Rock":
            return "<:ROCK_ADD_HURT:971462863623454730> Geo <:ROCK_ADD_HURT:971462863623454730>";
            break;
        case "Water":
            return "<:WATER_ADD_HURT:971462863392751707> Hydro <:WATER_ADD_HURT:971462863392751707>";
            break;
        case "Wind":
            return "<:WIND_ADD_HURT:971462863011065877> Anemo <:WIND_ADD_HURT:971462863011065877>";
            break;
        default:
            return "<:GRASS_ADD_HURT:971462863287906354> Dendro <:GRASS_ADD_HURT:971462863287906354>";
    }
}

function get_max_lvl(ascension){
    if (ascension <= 1){
        return ascension*20
    } else {
        return 40 + (ascension-1)*10
    }
}

async function create_character_embed(data, index=1){
    let player_name = await get_base_info(data, option="nickname")
    let char_id = await get_char_info(data, index, option="char_id")

    let fight_props = await get_char_info(data, index, option="fight_properties")
    let props = await get_char_info(data, index, option="char_properties")

    let name = names_map[char_map[char_id].NameTextMapHash]
    let title = (`${player_name}'s ${name}`)

    let char_pic = char_map[char_id].IconName
    let char_pic_url = "https://enka.network/ui/" + char_pic + ".png"

    let rarity = gen_rarity_stars(char_map[char_id].QualityType)
    let constellation = gen_constellation(await get_char_info(data, index, option="constellations_id"))

    let description = rarity +
    "\n\nLevel: " + props["4001"].val + "/" + get_max_lvl(props["1002"].val) + " (Ascension: " + props["1002"].val + "/6)" +
    "\nXP: " + props["1001"].ival +
    "\nConstellation: " + constellation +
    "\nElement: " + gen_element(char_id) +
    "\n<:space:840539867322777630>";

    const characterEmbed = new EmbedBuilder()
        .setColor('#29cf84')
        .setTitle(title)
        .setDescription(description)
        .setThumbnail(char_pic_url)
        .addFields([
            
            { name: "**__Max HP__**", value: `**<:HP:971462863359180900> ${Math.round(fight_props["2000"])}**
            *(${Math.round(fight_props["1"])}+${Math.round(fight_props["2000"])-Math.round(fight_props["1"])})*`, inline: true},

            { name: "**__Attack__**", value: `**<:ATTACK:971462863346597958> ${Math.round(fight_props["2001"])}**
            *(${Math.round(fight_props["4"])}+${Math.round(fight_props["2001"])-Math.round(fight_props["4"])})*`, inline: true},

            { name: "**__Defense__**", value: `**<:DEFENSE:971462863300477008> ${Math.round(fight_props["2002"])}**
            *(${Math.round(fight_props["7"])}+${Math.round(fight_props["2002"])-Math.round(fight_props["7"])})*`, inline: true},

            { name: "**__Elemental M.__**", value: `<:ELEMENT_MASTERY:971462862948151358> ${Math.round(fight_props["28"])}`, inline: true},
            { name: "**__Energy Recharge__**", value: `<:CHARGE_EFFICIENCY:971462863229190154> ${(Math.round(fight_props["23"]*1000)/10).toFixed(1)}% 
            <:space:840539867322777630>`, inline: true},
            { name: '\u200B', value: '\u200B', inline: true},

            { name: "**__Crit Rate__**", value: `<:CRITICAL:971462862935584829> ${(Math.round(fight_props["20"]*1000)/10).toFixed(1)}%`, inline: true},
            { name: "**__Crit Damage__**", value: `<:CRITICAL_HURT:971462863254327357> ${(Math.round(fight_props["22"]*1000)/10).toFixed(1)}%`, inline: true},
            //{ name: '\u200B', value: '\u200B', inline: true},
            { name: "**__Crit Multiplier__**", value: `DMG x ${await (((await calculate_CM(fight_props))*1000)/10).toFixed(1)}%`, inline: true}
        ])
    
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