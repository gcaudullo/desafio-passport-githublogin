import { Router } from 'express';
import userModel from '../dao/models/user.model.js';
import { createHash, generateToken, isValidPassword, verifyToken, authMiddleware, authRolesMiddleware } from '../utils.js';
import passport, { session } from 'passport';
const router = Router();

router.post('/sessions/login', passport.authenticate('login', { failureRedirect: '/sessions/login' }), async (req, res) => {

    // req.session.user = {
    //     first_name,
    //     last_name,
    //     email,
    //     age,
    //     role: email === 'adminCoder@coder.com' && password === 'adminCod3r123' ? 'admin' : 'user',
    // };
    console.log(req.user)
    // res.status(200).json({ messaje: 'Session iniciada correctamente' })
    res.redirect('/views')
})

router.post('/sessions/register', passport.authenticate('register', { failureRedirect: '/sessions/register' }), async (req, res) => {
    // res.status(201).json(user)
    res.redirect('/views/login')
})

router.post('/sessions/recovery-password', async (req, res) => {
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
    user.password = createHash(password);
    await userModel.updateOne({ email }, user);
    res.redirect('/views/login');
})

router.get('/sessions/profile', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No estas autenticado.' })
    }
    return res.status(200).json(req.session.user)
})

router.get('/sessions/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.render('error', { title: 'Hello People 🖐️', messageError: error.message });
        }
        res.redirect('/views/login');
    });
})

router.get('/sessions/github', passport.authenticate('github', { scope: ['user:email'] }))

router.get('/sessions/github/callback', passport.authenticate('github', { failureRedirect: '/sessions/login' }), (req, res) => {
    console.log(req.user)
    // res.status(200).json({ messaje: 'Session iniciada correctamente' })
    res.redirect('/views')
})

const auth = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ message: 'No debería estár acá' })
    }
    const payload = await verifyToken(token)
    if (!payload) {
        return res.status(401).json({ message: 'No debería estár acá' })
    }
    req.user = payload;
    next();
}

router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        res.status(401).json({ message: 'Usuario o contraseña invalidos' })
    }
    const isValidPass = isValidPassword(password, user)
    if (!isValidPass) {
        res.status(401).json({ message: 'Usuario o contraseña invalidos' })
    }
    const token = generateToken(user);
    res.cookie('token', token, {
        maxAge: 1000 * 60,
        httpOnly: true,
    })
        .status(200)
        .json({ status: 'success' })
    res.redirect('/views')
})

router.get('/auth/current', authMiddleware('jwt'), authRolesMiddleware('admin'), async (req, res) => {
    res.status(200).json(req.user)
})

export default router;

