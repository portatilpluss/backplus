import pool from "../db/db.js";
import { config } from "dotenv";
import jwt from 'jsonwebtoken'
import { transporter } from "../middelware/email.js";
import bcrypt from 'bcrypt'
import opt from 'otp-generator'
config();


export const register =async(req, res)=>{
    const name= req.body.name;
    const lastname= req.body.lastname;
    const age = req.body.age;
    const phone = req.body.phone;
    const email= req.body.email;
    const paswordsin= req.body.pasword;
    const idrole= req.body.idrole;

    try {
        const salt = await bcrypt.genSalt(5);
        const paswordhash = await bcrypt.hash(paswordsin, salt);
        const pasword = paswordhash;

        const [result] = await pool.query(`CALL SP_REGISTER(?,?,?,?);`,[name,lastname,age,phone]);
        if(result.affectedRows==1){ 
            const [lastInsertResult] = await pool.query('SELECT LAST_INSERT_ID() AS iduser');
            const iduser = lastInsertResult[0].iduser; // Obtenemos el iduser insertado
              
              const authresult = await pool.query(`CALL SP_AUTHREGISTER(?,?,?,?);`, [iduser, email, pasword, idrole]);
              if(authresult[0].affectedRows==1){
                  return res.status(200).json({error: false, message : "User Register"});
                }
                
        }else{
            res.status(401).json({error: true, message : "User No Register"});
        }
    } catch (err) {
        console.error("Error Fuction:", err); 
        res.status(500).json({error: true, message: "Error" });
    }
    
}
export const registerAdmin =async(req, res)=>{
    const name= req.body.name;
    const lastname= req.body.lastname;
    const id = req.body.id;
    const age = req.body.age;
    const phone = req.body.phone;
    const email= req.body.email;
    const paswordsin= req.body.pasword;
    const idrole= req.body.idrole;

    try {
        const salt = await bcrypt.genSalt(5);
        const paswordhash = await bcrypt.hash(paswordsin, salt);
        const pasword = paswordhash;

        const [result] = await pool.query(`CALL SP_ADDREGISTER(?,?,?,?,?);`,[name,lastname,id,age,phone]);
        if(result.affectedRows==1){ 
            const [lastInsertResult] = await pool.query('SELECT LAST_INSERT_ID() AS idemployes');
            const idemployes = lastInsertResult[0].idemployes; // Obtenemos el iduser insertado
              
              const authresult = await pool.query(`CALL SP_AUTHADMIN(?,?,?,?);`, [idemployes, email, pasword, idrole]);
              if(authresult[0].affectedRows==1){
                  return res.status(200).json({error: false, message : "Admin Register"});
                }
                    
        }else{
            res.status(401).json({error: true, message : "Admin No Register"});
        }
    } catch (err) {
        console.error("Error Fuction:", err); 
        res.status(500).json({error: true, message: "Error" });
    }
    
}



export const loginUser = async(req, res)=>{
    const {iduser,name,email, pasword} = req.body;

    try {
        const result = await pool.query(`CALL SP_LOGIN(?);`,[email]);
        if(result[0][0].length === 0){  
            return res.status(401).json({error: true ,message: "User No Register"})
        }

        const comparePasword = await bcrypt.compare(pasword, result[0][0][0].pasword)
        if(!comparePasword){
            return res.status(401).json({error: true, message: "¡Password or Email Incorrect!"})
        }else{


        const user = result[0][0][0];
            
        if(user.idrole === 1 || user.idrole === 2){

            const payload = {
                iduser: user.iduser,
                name:user.name,
                email: user.email,
                idrole: user.idrole
            }
            
            let token = jwt.sign(
                payload,
                process.env.PRIVATE_KEY,
            {expiresIn: process.env.EXPIRES_IN})

            
            res.cookie('token', token,{
                httpOnly:true,
                secure: false,
                sameSite: 'lax',
                maxAge: 1000*60*60
            });
            const role = user.idrole === 1 ? 'Admin': 'User';
             return res.status(200).json({error: false ,message: `Welcome ${role}`, token, payload});

        }else{
            return res.status(500).json({error: true ,message: "Rol Incorrect!", token, payload});
        }
        }
    } catch (error) {
        console.error("Error Fuction:", error);
        res.status(500).json({error: true, message: "Error" });
    }
}


export const viewRegister = async(req, res) => {
    const iduser = req.user.iduser;
    try {
        const resukt = await pool.query(`CALL SP_VIEW_REGISTER(?);`,[iduser]);
        // console.log(resukt);
        
        res.status(200).json({error:false, resul: resukt[0] })
    } catch (error) {
        console.error("Error Fuction:", error);
        res.status(500).json({error: true, message: "Error" });
    }
}

export const insertEmail = async(req, res)=>{
    const email = req.body.email;

    try {
        const result = await pool.query(`CALL INSERTEMAIL(?);`, [email]);
        if(result[0][0].length === 0){
           return res.status(400).json({error: true, message: "Email not Exist"});
        }
        const users = result[0][0][0];

        const payloadEmail={
            email: users.email
        }
        const tokenEmail = jwt.sign(
            payloadEmail,
            process.env.PRIVATE_KEY,
            {expiresIn: '1h'}
        )


        res.cookie('tokenemail', tokenEmail,{
            httpOnly:true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000*60*50
        })

        const  iduser = result[0][0][0].iduser;

        const code = opt.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
            digits: true
        });

        // Calcular fecha de expiración
        const expiresdate = new Date();
        expiresdate.setMinutes(expiresdate.getMinutes() + 5);
        const expires = expiresdate.toISOString().slice(0, 19).replace('T', ' ');
        

        await pool.query(`CALL OTPGENERATOR(?,?,?);`, [iduser, code, expires]);


        await transporter.sendMail({
            from: `"Code Sent" ${process.env.EMAIL} `,
            to: email, 
            subject: "Code Sent",
            html: `
                <b>Hello ${email}! This is Code the Confirmation!¡
                <h1>${code}</h1>
                
                </b>
                `,
        });
      return res.status(200).json({error:false, message: "Code Sent successfully", payloadEmail, tokenEmail});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: true , message: "Error Controller"})
    }
}

export const insertCode = async(req, res) => {
    const code = req.body.code;
    try {
        const resukt = await pool.query(`CALL INSERTCODE(?);`,[code]);
        if(resukt[0][0].length === 0){
            return res.status(400).json({error: true, message: "Expired Code"});
        }
        // res.clearCookie('tokenemail');
        res.status(200).json({error:false, message: "Code Correct"})
        
    } catch (error) {
        console.error("Error Fuction:", error);
        res.status(500).json({error: true, message: "Error" });
    }
}

export const updatePassword = async(req, res)=>{
    const email = req.body.email;    
    const paswordChange = req.body.pasword;    
    try {

        const salt = await bcrypt.genSalt(10);
        const UpdatePasword = await bcrypt.hash(paswordChange, salt);
        const pasword = UpdatePasword;

        const result = await pool.query(`CALL SP_CHANGE_PASSWORD(?,?);`,[email,pasword]);
        if(result[0].affectedRows==1){
            return res.status(200).json({error : false , message : "Password Changed"});
        }else{
            return res.status(400).json({error: true, message : "Email not found"});
        }
        
    } catch (error) {
        console.error("Error Fuction:", error);
        res.status(500).json({error: true, message: "Error" });
    }
}



export const admins = async(req, res)=>{
    try {
        const respon = await pool.query(`CALL SP_ADMINS();`);
        res.status(200).json({error: false, resul: respon[0] });
    } catch (error) {
        res.status(500).json({error: false, resul: "Error" });
    }
}
export const deleteAdmins = async(req, res)=>{
    const idemployes = req.params.idemployes
    try {
        const respon = await pool.query(`CALL SP_DELETEADMIN('${idemployes}');`);
        if(respon[0].affectedRows==1){
            res.status(200).json({error: false, resul: "Employes Delete Corretment" });
            
        }else{
            res.status(400).json({error: false, resul: "Error Delete employes" });

        }
    } catch (error) {
        res.status(500).json({error: false, resul: "Error" });
    }
}