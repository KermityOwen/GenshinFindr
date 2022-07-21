const { get_char_info , get_base_info, fetch_data} = require("./data_fetcher");
const { MessageEmbed, EmbedBuilder } = require("discord.js");

//Get data from data_fetcher.fetch_data
async function create_player_embed(data){
    //Somehow + is faster for combining strings than concat so...

    let arwr = ("AR: " + await get_base_info(data, Option="ar_level") + " --- WR: " + await get_base_info(data, Option="world_level"));
    //const playerEmbed = new EmbedBuilder()
    let signature = await get_base_info(data, Option="signature")
    if (signature == undefined){
        signature = "*no signature"
    }
    let nickname = await get_base_info(data, Option="nickname")

    const playerEmbed = new EmbedBuilder()
    .setColor('#29cf84')
    .setTitle(nickname)
    .setDescription(signature)
    .addFields([
        { name: "Adventure Rank --- WR", value: `${arwr}` || "Bruh",}
    ]);
    
    return playerEmbed
    
}

module.exports = {
    create_player_embed
}

fetch_data(700378769).then(r => {
    
    create_player_embed(r).then(r2 => {
        console.log(r2)
    })
    
})
