import * as jwt from 'jsonwebtoken';
import env from '../env';
import { UserApiResp } from '../api-response/user.response';

class TokenUtil {
    sign_admin_user(payload: any, expiresIn: string | number) {
       return jwt.sign(payload, env?.ADMIN_JWT_KEY, {expiresIn: expiresIn ? expiresIn : '1d'});
    }
    verify_admin_user(token: string): any {
        return new Promise((resolve, reject) => {
            try {
                const resp =  jwt.verify(token, env.ADMIN_JWT_KEY);                
                resolve(resp)
            } catch (error) {
                reject({error, ...UserApiResp.NOT_AUTHORIZED})
            }
        }) 
    }
}
export default new TokenUtil;