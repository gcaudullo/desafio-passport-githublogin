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

export const createHash = (password) => {
    const result = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    return result;
}

export const isValidPassword = (password, user) => {
    const result = bcrypt.compareSync(password, user.password)
    return result;
}

export const generateToken = (user) => {
    const payload = {
        id: user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
    }
    return JWT.sign(payload, JWT_SECRET, { expiresIn: '1h' })
};

export const verifyToken = (token) => {
    return new Promise((resolve) => {
        JWT.verify(token, JWT_SECRET, (error, payload) => {
            if (error) {
                return resolve(false)
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


export const authRolesMiddleware = (role) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
        /*401 no está autenticado*/
    }
    const { role : userRole } = req.user;
    if (userRole !== role){
        return res.
        status(403).json({message: 'No permissions'})
        /*403 no tiene permisos*/
    }
    next();
}