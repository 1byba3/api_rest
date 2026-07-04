import { Router } from 'express'
import { z } from 'zod'
import prisma from '../lib/prisma.js'
import bcrypt from 'bcryptjs'
import { authMiddleware } from '../middleware/auth.midedleware.js'

const userRouter = Router()

// Validación de datos con Zod
const studentSchema = z.object({
    studentCode: z.string().min(5, { message: "El código del estudiante debe tener minimo 5 caracteres" }),
    firstName: z.string().min(2, { message: "El nombre debe tener minimo 2 caracteres" }).max(40, { message: "El nombre no puede tener mas de 40 caracteres" }),
    lastName: z.string().min(2, { message: "El apellido debe tener minimo 2 caracteres" }).max(40, { message: "El apellido no puede tener mas de 40 caracteres" }),
    email: z.string().email({ message: "El correo electrónico no es válido" }),
    password: z.string().min(8, { message: "La contraseña debe tener minimo 8 caracteres" }).max(24, { message: "La contraseña no puede tener mas de 24 caracteres" }),
    phone: z.string().optional(),
    birthDate: z.string().optional()
})

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ success: false, errors: result.error.flatten().fieldErrors })
  }

  req.validatedData = result.data
  next()
}


userRouter.get("/", async (req, res) => {
    // BUSCAR EN LA BASE DE DATOS
    const students = await prisma.student.findMany()
    res.status(200).json({success: true, data: students})
  
})

userRouter.post('/create', authMiddleware, validate(studentSchema), async (req, res) => {
    const body = req.body || {}
    const data = req.validatedData ?? body
    const { studentCode, firstName, lastName, email, password, phone, birthDate } = data

    if (!req.body || Object.keys(body).length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Body vacío. Envía JSON usando Content-Type: application/json o datos de formulario con urlencoded.'
        })
    }

    if (!studentCode || !firstName || !lastName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos: studentCode, firstName, lastName, email, password son requeridos'
        })
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12)
        const normalizedBirthDate = birthDate ? new Date(birthDate) : undefined

        const newStudent = await prisma.student.create({
            data: {
                studentCode,
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone,
                birthDate: normalizedBirthDate
            }
        })

        return res.status(201).json({
            success: true,
            message: 'Estudiante creado exitosamente',
            student: newStudent
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al crear el estudiante',
            error: error.message
        })
    }
})

userRouter.put("/update/:id", (req, res) => {
    const { id } = req.params
    const {name, age} = req.body
    if (!name || !age){
        return res.status(400).json({message: "Faltan datos: nombre o edad"})
    }
    res.status(200).json({message: `El usuario con ID: ${id} se ha actualizado`})
})

userRouter.delete("/delete/:id", async(req, res) => {
    const { id } = req.params
    try {
        const deletedStudent = await prisma.student.delete({
            where: {id: parseInt(id)}
        })
        res.status(200).json({success: true, data: deletedStudent})
    } catch (error) {
        if(error.code === "P2025"){
            res.status(404).json({success: false, message: "El id seleccionado no fue encontrado"})
        }
        res.status(500).json({success: false, message: "Error interno del servidor"})
    }
})
 

userRouter.get("/test", (req, res) => {
    res.status(200).json({ mensaje: "Hola a la formacion de docentes del MINEDUCYT como estas?🙌"})
})

export default userRouter