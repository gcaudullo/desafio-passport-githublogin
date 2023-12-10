import { Router } from 'express';
import userModel from '../dao/models/user.model.js';
import bcrypt from 'bcrypt';
const router = Router();

router.post('/sessions/login', async (req, res) => {
    const { body: { email, password } } = req;
    if (!email || !password) {
        //return res.status(400).json({ message: 'Todos los campos son requeridos.' })
        res.render('error', { messageError: 'Todos los campos son requeridos.' })
        return;
    }
    const user = await userModel.findOne({ email })
    if (!user) {
        // return res.status(401).json({ message: 'Correo o contraseña no son validos' })
        res.render('error', { messageError: 'Usuario no registrado en nuestra Base de Datos' })
        return;
    }
    const passwordMatch = password === user.password;
    if (!passwordMatch) {
        // return res.status(401).json({ message: 'Correo o contraseña no son validos' })
        res.render('error', { messageError: 'Correo o contraseña no son validos' })
        return;
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
        age,
        role: email === 'adminCoder@coder.com' && password === 'adminCod3r123' ? 'admin' : 'user',
    };
    // res.status(200).json({ messaje: 'Session iniciada correctamente' })
    res.redirect('/views')
})

router.post('/session/register', async (req, res) => {
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
        res.render('error', { messageError: 'Todos los campos son requeridos.' })
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

router.get('/session/profile', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No estas autenticado.' })
    }
    return res.status(200).json(req.session.user)
})

router.get('/session/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.render('error', { title: 'Hello People 🖐️', messageError: error.message });
        }
        res.redirect('/views/login');
    });
})

export default router;

