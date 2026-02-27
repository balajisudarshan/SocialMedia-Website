const Project = require('../models/Project.model')

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'

async function generateProjectCode(){
    let code
    let exists = true

    while(exists){
        code = ""
        for(let i = 0;i<6;i++){
            code += characters.charAt(Math.floor(Math.random() * characters.length))
        }
        const project = await Project.findOne({projectCode:code})
        if(!project) exists = false;
    }
    return code;
}
module.exports = generateProjectCode