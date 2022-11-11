const config =require("../config/dbConfig.js")
const mongoose =require("mongoose");
const {normalizeMsj}=require("./normalizr.js")
const twilio=require('twilio')






try {
    mongoose.connect(config.mongoDb.url, config.mongoDb.options)
} catch (error) {
    console.log(error);
};

const mongooseSchema = new mongoose.Schema({
    author: {
        id: { type: String, required: true, max: 100 },
        nombre: { type: String, required: true, max: 100 },
        apellido: { type: String, required: true, max: 50 },
        edad: { type: Number, required: true },
        alias: { type: String, required: true },
        avatar: { type: String, required: true, max: 100 },
        timestamp: { type: Date, default: Date.now }
    },
    text: { type: String, required: true, max: 400 }
});

const msjModel = mongoose.model('mensajes', mongooseSchema);



const saveMsjs = async (msj) => {
    const newMsj = new msjModel(msj);
    try {
        newMsj.save()
    } catch (error) {
        throw new Error(error);
    }
}

const getMsjs = async () => {
    try {
        const mensajes = await msjModel.find();
        return normalizeMsj(mensajes);
    } catch (error) {
        throw new Error(error);
    }
}


module.exports={saveMsjs,getMsjs}


// //MENSAJES SMS CON TWILIO

// const accountSid = 'AC9fefc59c281978bc8db78b2ecbdccb33'; 
// const authToken = 'fe685c01b076299109c97fb6861794dc'; 
// const client = twilio(accountSid, authToken); 


// // const smsOption={
// //     from:"+12535533470",
// //     to: "+543424055157",
// //     body:"probando le mensaje de texto"
// // }

// // async function sendSms() {
// //     try {
// //       const info = await client.messages.create(smsOption);
// //       console.log(info);
// //     } catch(err) {
// //       console.log(err)
// //     }
// //   }

//    const whatsAppOption={
//     from:"whatsapp:+14155238886",
//     to: "whatsapp:+5493424055157",
//     body:"probando le mensaje de texto"
// }

// async function sendWhatsapp() {
//     try {
//       const info = await client.messages.create(whatsAppOption);
//       console.log(info);
//     } catch(err) {
//       console.log(err)
//     }
//   }

// // sendSms();
// sendWhatsapp();
 
// // client.messages 
// //       .create({         
// //          to: '+543424055157' 
// //        }) 
// //       .then(message => console.log(message.sid)) 
// //       .done();