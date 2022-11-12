const config =require("../config/dbConfig.js")
const mongoose =require("mongoose");
const {normalizeMsj}=require("./normalizr.js")
const twilio=require('twilio')
const nodemailer= require('nodemailer');

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





// //MENSAJES SMS CON TWILIO

const accountSid = 'AC2510716c68b2261fb6fd373fd7fe5ce0'; 
const authToken = 'c2d1dcb80cab806638c34b4191b252b9'; 
const client = twilio(accountSid, authToken); 


 

async function sendSms() {
    const smsOption={
        from:"+13603008856",
        to: "+5493424055157",
        body:"Su pedido ha sido recibido y se encuentra en proceso"
    }
    try {
      const info = await client.messages.create(smsOption);
      console.log(info);
    } catch(err) {
      console.log(err)
    }
  }

 
async function sendWhatsapp(user) {
    const whatsAppOption={
        from:"whatsapp:+14155238886",
        to: "whatsapp:+5493424055157",
        body:`nuevo pedido de ${user}`
    }    
    try {
      const info = await client.messages.create(whatsAppOption);
      console.log(info);
    } catch(err) {
      console.log(err)
    }
  }

  async function sendMail(user,listCart) {
    try {
        await transporter.sendMail({
          to:"retete2854@sopulit.com",
          from:"iva12@ethereal.email",
          subject:`nuevo pedido de ${user}`,
           html:`${listCart}`
      });
      } catch (err) {
        console.log(err);
      }
    }
    const transporter = nodemailer.createTransport({
        service:"gmail",
        host: 'smtp.gmail.email',
        port: 587,
        auth: {
            user: 'andreshosch114@gmail.com',
            pass: "pripxpboynmzhqev"
        }
      });

      module.exports={saveMsjs,getMsjs,sendMail,sendSms,sendWhatsapp}
