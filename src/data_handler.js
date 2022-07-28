const char_map = require("../resources/character_mapping.json");

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
    //let max_lvl = ""
    return (":small_blue_diamond:".repeat(amount) + ":white_small_square:".repeat(6-amount))
}

function gen_refinement(refinement){
    return (":small_blue_diamond:".repeat(refinement) + ":white_small_square:".repeat(5-refinement))
}

function gen_element(element){
    switch (element){
        case "Ice":
        case 46:
            return ["<:ICE_ADD_HURT:971462863384367114>", "Cryo"];
            break;
        case "Electric":
        case 41:
            return ["<:ELEC_ADD_HURT:971462863241773056>", "Electro"];
            break;
        case "Fire":
        case 40:
            return ["<:FIRE_ADD_HURT:971462863354986546>", "Pyro"];
            break;
        case "Rock":
        case 45:
            return ["<:ROCK_ADD_HURT:971462863623454730>", "Geo"];
            break;
        case "Water":
        case 42:
            return ["<:WATER_ADD_HURT:971462863392751707>", "Hydro"];
            break;
        case "Wind":
        case 44:
            return ["<:WIND_ADD_HURT:971462863011065877>", "Anemo"];
            break;
        case "Physical":
        case 30:
            return ["<:PHYSICAL_ADD_HURT:971462863371788330>", "Physical"];
            break;
        default:
            return ["<:GRASS_ADD_HURT:971462863287906354>", "Dendro"];
    }
}

//input int level of ascension
function get_max_lvl(ascension){
    if (ascension <= 1){
        return ascension*20
    } else {
        return 40 + (ascension-1)*10
    }
}

//FightProp Input
function gen_determined_bonus(data){
    if(data[30] != 0){
        return [30, data["30"]];
    } 
    for (let i=40; i<=46; i++){
        if (data[i] != 0){
            return [i, data[i]];
        }
    }
    return [30, "0"]
}

//SkillLevelMap and charId input
function det_talent_level(char_id, skill_map){
    ordered_skill_array = char_map[char_id].SkillOrder
    return `${skill_map[ordered_skill_array[0]]} | ${skill_map[ordered_skill_array[1]]} | ${skill_map[ordered_skill_array[2]]}`
}

//input equiplist
function det_weapon(data){
    for (let i = 0; i<data.length; i++){
        if (data[i].weapon != undefined){
            return data[i]
        }
    }
}

function det_artifact(data){
    let artifacts = []
    for (let i = 0; i<data.length; i++){
        if (data[i].reliquary != undefined){
            artifacts.push(data[i])
        }
    }
    return artifacts
}

module.exports = {
    gen_constellation,
    gen_determined_bonus,
    gen_element,
    gen_rarity_stars,
    gen_refinement,
    get_max_lvl,
    det_talent_level,
    det_weapon,
    calculate_CM,
    det_artifact
}


/*
fetch_data(826235659).then(r => {
    
    create_character_embed(r, 0).then(r2 => {
        
    })
    
})
*/