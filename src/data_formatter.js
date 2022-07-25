const { get_char_info , get_base_info, fetch_data} = require("./data_fetcher");
const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, SelectMenuBuilder } = require("discord.js");
const { gen_constellation, gen_determined_bonus, gen_element, gen_rarity_stars, gen_refinement,
    get_max_lvl, det_talent_level, det_weapon, calculate_CM } = require("./data_handler")

const char_map = require("../resources/character_mapping.json");
const names_map = require("../resources/names_mapping.json");
const weapon_map = require("../resources/weapon_mapping.json")

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
    .setTitle(`**${nickname}**`)
    .setDescription(signature)
    .setThumbnail(prof_pic_url)
    .addFields([
        { name: "Adventure Rank --- WR", value: `${arwr}` || "Error",},
        { name: "Highest Spiral Abyss (Version 2.8)", value: `${spiral}` || "Error" },
        { name: "Number of Achievements", value: `${achievements}` || "Error" },
    ]);
    
    return playerEmbed
}

async function create_character_embed(data, index=1){
    let player_name = await get_base_info(data, option="nickname")
    let char_id = await get_char_info(data, index, option="char_id")

    let fight_props = await get_char_info(data, index, option="fight_properties")
    let props = await get_char_info(data, index, option="char_properties")

    let name = names_map[char_map[char_id].NameTextMapHash]
    let title = (`${player_name}'s ${name}`)
    let element = char_map[char_id].Element

    let char_pic = char_map[char_id].IconName
    let char_pic_url = "https://enka.network/ui/" + char_pic + ".png"

    let rarity = gen_rarity_stars(char_map[char_id].QualityType)
    let constellation = gen_constellation(await get_char_info(data, index, option="constellations_id"))
    let dmg_bonus = gen_determined_bonus(fight_props)

    let weapon = det_weapon(await get_char_info(data, index, option="equips"))
    let weapon_pic_url = "https://enka.network/ui/" + weapon.flat.icon + ".png?size=10"
    let weapon_refinement = weapon.weapon.affixMap[`1${weapon.itemId}`]

    //console.log(gen_element("30"))

    let description = rarity +
    "\n\nLevel: " + props["4001"].val + "/" + get_max_lvl(props["1002"].val) + " (Ascension: " + props["1002"].val + "/6)" +
    "\nXP: " + props["1001"].ival +
    "\nConstellation: " + constellation +
    "\nElement: " + `${gen_element(element)[0]} ${gen_element(element)[1]} ${gen_element(element)[0]}` +
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
            <:space:840539867322777630> `, inline: true},
            { name: '\u200B', value: '\u200B', inline: true},

            { name: "**__Crit Rate__**", value: `<:CRITICAL:971462862935584829> ${(Math.round(fight_props["20"]*1000)/10).toFixed(1)}%`, inline: true},
            { name: "**__Crit Damage__**", value: `<:CRITICAL_HURT:971462863254327357> ${(Math.round(fight_props["22"]*1000)/10).toFixed(1)}%`, inline: true},
            { name: "**__Crit Multiplier__**", value: `DMG x ${await (((await calculate_CM(fight_props))*1000)/10).toFixed(1)}%`, inline: true},

            { name: `**__${gen_element(dmg_bonus[0])[1]} DMG Bonus__**`, value: `${gen_element(dmg_bonus[0])[0]} ${(Math.round(dmg_bonus[1]*1000)/10).toFixed(1)}%`, inline: true},
            { name: '\u200B', value: '\u200B', inline: true},
            { name: "**__Talent Levels__**", value: `${det_talent_level(char_id, await get_char_info(data, index, option="skills_lvl"))}
            <:space:840539867322777630> 
            <:space:840539867322777630>`, inline: true},
        ])
        //.setImage(weapon_pic_url)
        .addFields([
            { name: `**__Weapon --- ${names_map[weapon.flat.nameTextMapHash]}__**`, value:
            `**Level:** ${weapon.weapon.level}/${get_max_lvl(weapon.weapon.promoteLevel)} (Ascension: ${weapon.weapon.promoteLevel}/6)
            **Refinement:** ${ gen_refinement(weapon.weapon.affixMap[`1${weapon.itemId}`]+1) }
            **Attack:** <:ATTACK:971462863346597958>${weapon.flat.weaponStats[0].statValue}
            **${names_map[weapon.flat.weaponStats[1].appendPropId]}:** ${weapon.flat.weaponStats[1].statValue}%`}
        ])
        .setFooter({text: names_map[weapon.flat.nameTextMapHash], iconURL: weapon_pic_url})
    
    return characterEmbed
}

//input avatarInputList
async function create_select_character (data, uid) {
    const option = []
    for (let i = 0; i < data.length; i++){
        option.push(
            {
                label: `${names_map[char_map[data[i].avatarId].NameTextMapHash]}`,
                value: `${i}-${uid}`
            }
        )
    }
    const row = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId("char_sel")
                .setPlaceholder("Switch characters")
                .addOptions(
                    option
                )
        )
    return row
}

module.exports = {
    create_player_embed,
    create_character_embed,
    create_select_character
}