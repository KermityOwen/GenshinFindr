const fs = require('fs');
const template = require("../resources/temp_map.json")

/*
for (let i = 10000002; i<10000066; i++){
    try{
        char_img_map[i].CharName = char_img_map[i].SideIconName.replace('UI_AvatarIcon_Side_','')
    } catch (e) {
        //console.log(i)
    }
}

const new_json = {}
//console.log(template[0].id)

for (let i = 0; i<template.length; i++){
    new_json[template[i].id] = {
        "nameTextMapHash" : template[i].nameTextMapHash,
        "descTextMapHash" : template[i].descTextMapHash,
        "icon" : template[i].icon,
        "weaponType" : template[i].weaponType,
        "weaponRank" : template[i].rankLevel,
        "awakenIcon" : template[i].awakenIcon,
        "weaponProp" : template[i].weaponProp
    }
}

let new_json = {}
let names_key = []
for (let i = 0; i<template.length; i++){
    if (template[i].nameTextMapHash){
        names_key.push(template[i].nameTextMapHash)
    }
    //console.log(template[i].nameTextHashMap)
}


for (let i = 0; i<names_key.length; i++){
    if (bignames[template[i].nameTextMapHash]){
        new_json[template[i].nameTextMapHash] = bignames[template[i].nameTextMapHash]
    }
}

console.log(new_json)

fs.writeFile("../resources/artifacts_mapping.json", JSON.stringify(new_json, null, 4), 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }

    console.log(new_json)
    console.log("JSON file has been saved.");
}) 
*/