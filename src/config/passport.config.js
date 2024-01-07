import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import userModel from '../dao/models/user.model.js';
import { createHash, isValidPassword } from '../utils.js'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { JWT_SECRET } from '../utils.js';

export const init = () => {
    const registerOpts = {
        usernameField: 'email',
        passReqToCallback: true,
    };
    passport.use('register', new LocalStrategy(registerOpts, async (req, email, password, done) => {
        const {
            body: {
                first_name,
                last_name,
                age,
            },
        } = req
        if (
            !first_name ||
            !last_name
        ) {
            return done(new Error('Todos los campos son requeridos.'))
        }
        const user = await userModel.findOne({ email })
        if (user) {
            return done(new Error(`Ya existe un usuario registrado con este correo ${email} en la Base de datos`));
        }
        const newUser = await userModel.create({
            first_name,
            last_name,
            email,
            password: createHash(password),
            age,
        })
        done(null, newUser)
    }));

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        const user = await userModel.findOne({ email });
        if (!user) {
            return done(new Error('Usuario no registrado en nuestra Base de Datos'))
        }
        const passwordMatch = isValidPassword(password, user);
        if (!passwordMatch) {
            return done(new Error('Correo o Contraseña inválidas.'));
        }
        done(null, user)
    }))

    const githubOpts = {
        clientID: 'Iv1.8eac47301b753b41',
        clientSecret: "bae8f2f8ebae1f0cc38b2781a402db236b37d54a",
        callbackURL: 'http://localhost:8080/api/sessions/github/callback',
    };

    passport.use('github', new GithubStrategy(githubOpts, async (accessToken, refreshToken, profile, done) => {
        const email = profile._json.email;
        let user = await userModel.findOne({ email });
        if (user) {
            return done(null, user)
        }
        user = {
            first_name: profile._json.name,
            last_name: '',
            email: email,
            password: '',
        }
        const newUser = await userModel.create(user);
        done(null, newUser);
    }))

    const cookieExtractor = (req) => {
        let token = null;
        if (req && req.cookies){
            token = req.cookies.token;
        }
        return token;
    }
    const jwtOpts = {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    };
    passport.use('jwt', new JWTStrategy(jwtOpts, async (payload, done) => {
        try{
            return done(null, payload);
        } catch{
            return done(err);
        }
        
    }))

    //Con JWT no necesitamos serialización ni deserialización de nada.
    // passport.serializeUser((user, done) => {
    //     done(null, user._id)
    // });

    // passport.deserializeUser(async (uid, done) => { //inflar la session
    //     const user = await userModel.findById(uid);
    //     done(null, user);
    // });
}