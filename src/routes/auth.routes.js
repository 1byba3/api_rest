import {Router} from 'express'
import { z } from 'zod'
import prisma from '../lib/prisma.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const authRouter = Router()

const loginSchema = z.object({
    email: z.string().email({ message: "El correo electrónico no es válido" }),
    password: z.string().min(8, { message: "La contraseña debe tener minimo 8 caracteres" }).max(24, { message: "La contraseña no puede tener mas de 24 caracteres" })
})  

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ success: false, errors: result.error.issues })
    }   
    req.validatedData = result.data
    next()
}

authRouter.post('/login',validate(loginSchema), async(req, res) => {
    const {email, password} = req.body

    try {
    const student = await prisma.student.findUnique({where: {email}})
    if (!student){
        return res.status(401).json({success: false, message: "El email no ha sido encontrado"})
    }

    const isPasswordvalid = await bcrypt.compare(password, student.password)

    if (!isPasswordvalid){
        return res.status(401).json({success: false, message: "La clave es invalida"})
    }

    const payload = {id: student.id, email: student.email, studentCode: student.studentCode}
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'})

    res.status(200).json({success: true, token})

    } catch (error) {
        res.status(500).json({success: false, message: "Error interno del servidor", error: error.message})
    }
})


export default authRouter
