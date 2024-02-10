import { Router } from 'express';
import userModel from '../dao/models/user.model.js';
import { createHash, generateToken, isValidPassword, verifyToken, authMiddleware, authRolesMiddleware } from '../utils.js';
import passport from 'passport';
const router = Router();

// router.post('/sessions/login', passport.authenticate('login', { failureRedirect: '/sessions/login' }), async (req, res) => {

//     // req.session.user = {
//     //     first_name,
//     //     last_name,
//     //     email,
//     //     age,
//     //     role: email === 'adminCoder@coder.com' && password === 'adminCod3r123' ? 'admin' : 'user',
//     // };
//     console.log(req.user)
//     // res.status(200).json({ messaje: 'Session iniciada correctamente' })
//     res.redirect('/views')
// })

// router.post('/sessions/register', passport.authenticate('register', { failureRedirect: '/sessions/register' }), async (req, res) => {
//     // res.status(201).json(user)
//     res.redirect('/views/login')
// })

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

// router.get('/sessions/profile', async (req, res) => {
//     if (!req.session.user) {
//         return res.status(401).json({ message: 'No estas autenticado.' })
//     }
//     return res.status(200).json(req.session.user)
// })

router.get('/sessions/logout', (req, res) => {
    res.clearCookie('token'); // Elimina la cookie que almacena el token JWT, si la tienes
    res.redirect('/views/login');
});

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

router.post('/sessions/register', async (req, res) => {
    try {
        const { first_name, last_name, email, password, age } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'El usuario ya está registrado.' });
        }

        // Crear un nuevo usuario
        const newUser = await userModel.create({
            first_name,
            last_name,
            email,
            password: createHash(password),
            age,
        });

        // Generar token JWT
        const token = generateToken(newUser._id);

        // Redireccionar a la vista después de un registro exitoso
        // res.redirect('/views');

        // Devolver el token y cualquier otra información que desees
        return res.status(201).json({ token, user: newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el registro.' });
    }
});

router.post('/sessions/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Buscar al usuario por correo electrónico
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Usuario o contraseña invalidos' })
        }

        // Verificar la contraseña
        const isValidPass = isValidPassword(password, user)
        if (!isValidPass) {
            res.status(401).json({ message: 'Usuario o contraseña invalidos' })
        }

        // Generar token JWT
        const token = generateToken(user);

        // Establecer el token en la cookie o cualquier otra lógica que desees
        res.cookie('token', token, {
            maxAge: 1000 * 60 * 30, //EXPRESADO EN MILISEGUNDOS 1000 * 60 * 30 = 30 MINUTOS
            httpOnly: true,
            signed: true
        })
        return res.status(200).json({ token, user });
        // res.redirect('/views');
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el inicio de sesión.' });
    }
})

router.get('/sessions/current', authMiddleware('jwt'), authRolesMiddleware(['admin']), async (req, res) => {
    res.status(200).json(req.user)
})

export default router;

