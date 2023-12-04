import { Router } from 'express';
import userModel from '../dao/models/user.model.js';
const router = Router();

router.post('/sessions/login', async (req, res) => {
    const { body: { email, password } } = req;
    if (!email || !password) {
        //return res.status(400).json({ message: 'Todos los campos son requeridos.' })
        res.render('error', {title: 'Bienvenido a nuesto Ecommerce', messageError: 'Todos los campos son requeridos.'})
    }
    const user = await userModel.findOne({ email })
    if (!user) {
        // return res.status(401).json({ message: 'Correo o contraseña no son validos' })
        res.render('error', {title: 'Bienvenido a nuesto Ecommerce', messageError: 'Correo o contraseña no son validos'})
    }
    if (user.password !== password) {
        // return res.status(401).json({ message: 'Correo o contraseña no son validos' })
        res.render('error', {title: 'Bienvenido a nuesto Ecommerce', messageError: 'Correo o contraseña no son validos'})
    }
    const {
        first_name,
        last_name,
        age,
    } = user; 

    req.session.user = {
        first_name,
        last_name,
        email,
        age,};
    // res.status(200).json({ messaje: 'Session iniciada correctamente' })
    res.redirect('/views')
})

router.post('/sessions/register', async (req, res) => {
    const {
        body: {
            first_name,
            last_name,
            email,
            password,
            age,
        },
    } = req
    if (
        !first_name ||
        !last_name ||
        !email ||
        !password
    ) {
        // return res.status(400).json({ message: 'Todos los campos son requeridos.' })
        res.render('error', {title: 'Bienvenido a nuesto Ecommerce', messageError: 'Todos los campos son requeridos.'})
    }
    const user = await userModel.create({
        first_name,
        last_name,
        email,
        password,
        age,
    })
    // res.status(201).json(user)
    res.redirect('/views/login')
})

router.get('/sessions/profile', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No estas autenticado.' })
    }
    return res.status(200).json(req.session.user)
})
export default router;