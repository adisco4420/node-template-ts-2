import TokenUtil from '../utilities/token.util';
import { RootService } from '../services/_root.service';
import { Status } from '../interfaces/status.interface';
import { UserApiResp } from '../api-response/user.response';
import { Request, Response, NextFunction } from 'express';
import env from '../env';
class AuthMidWare extends RootService {

    private _is_authenticated = async (req: Request) => {
        try {       
            const apiKey = req.headers['api-key'];
            if(apiKey) {
                if(apiKey !== env.API_KEY) throw UserApiResp.NOT_AUTHORIZED;
            } else {
                const authHeader = req.headers.authorization;                
                if(!authHeader) throw UserApiResp.NO_AUTHORIZATION_HEADER;
                const token = authHeader.split(' ')[1];
                const tokenData = await TokenUtil.verify_admin_user(token);
                if(!tokenData) throw UserApiResp.NOT_AUTHORIZED;
                (req as any).user = tokenData;
            }
            return req;                
        } catch (error: any) {                                
            const status = error.status || Status.UN_AUTHORIZED;
            const message = error.message || 'You are not authorized';
            throw {status, message, error, req}
        }
    }
    auth = async (req: Request, res: Response, next: NextFunction) => {
        const actionType = 'USER_AUTH_MIDWARE';
        try {
            await this._is_authenticated(req)
            next();           
             
        } catch (error) {
            const { status, message, data } = this.get_error(error);
            return this.sendResponse({req, res, status, actionType, message, data, error})
        }
    }
}
export default new AuthMidWare;