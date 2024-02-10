import path, { resolve } from 'path';
import url from 'url';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken'
import passport from 'passport';



const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename)
export const JWT_SECRET = 't-Zy>e/}}*ong9`PQiZB_z!?y:C/G699'

export const base_Url = 'http://localhost:8080/api/products';

export const buildResponsePaginated = (data, baseUrl = base_Url) => {

    return {
        status: 'success',
        payload: data.docs.map((doc) => doc.toJSON()),
        totalPages: data.totalPages,
        prevPage: data.prevPage,
        nextPage: data.nextPage,
        page: data.page,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.hasNextPage,
        prevLink: data.hasPrevPage ? `${baseUrl}/?limit=${data.limit}&page=${data.prevPage}${data.sort ? `&sort=${data.sort}` : ''}${data.category ? `&category=${data.category}` : ''}` : null,
        nextLink: data.hasNextPage ? `${baseUrl}/?limit=${data.limit}&page=${data.nextPage}${data.sort ? `&sort=${data.sort}` : ''}${data.category ? `&category=${data.category}` : ''}` : null,
    };
}

//Hasheo del password para guardarlo en la base de datos.
export const createHash = (password) => {
    const result = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    return result;
}
//Deshasheo el password para compararlo con el password que ingresó el usuario
export const isValidPassword = (password, user) => {
    const result = bcrypt.compareSync(password, user.password)
    return result;
}

//Una vez chequeado que el usuario está registrado y logueado generamos el Token
export const generateToken = (user) => {
    const payload = {
        id: user._id, //si no anda revisar este campo puede ser user._id
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
    }
    return JWT.sign(payload, JWT_SECRET, { expiresIn: '1h' })
};

export const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        JWT.verify(token, JWT_SECRET, (error, payload) => {
            if (error) {
                return reject(error)
            }
            resolve(payload)
        });
    });
};

export const authMiddleware = (strategy) => (req, res, next) => {
    //hacer un switch case con las distintas estrategias.
    passport.authenticate(strategy, function (error, payload, info) {
        if (error) {
            return next(error);
            /*Si ocurre algun error al llamar al metodo next con parametro de error va al middleware de errores que está en app.js*/
        }
        if (!payload) {
            return res.status(401).json({ message: info.message ? info.message : info.toString() });
        }
        req.user = payload;
        next();
    })(req, res, next) /*aquí llamamos a la funcion function que acabamos de definir*/
};


export const authRolesMiddleware = (roles) => (req, res, next) => {
    const { user } = req;
    if (!user) {
        return res.status(401).json({ message: 'unauthorized 😨' });
    }
    if (!roles.includes(user.role)) {
        return res.status(403).json({ message: 'forbidden 😨' });
    }
    next();
}