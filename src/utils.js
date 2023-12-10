import path from 'path';
import url from 'url';
import bcrypt from 'bcrypt';

const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename)

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
