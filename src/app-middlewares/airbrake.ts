import env from '../env';
import { ServiceRespI } from '../interfaces/interface';
const Airbrake = require('@airbrake/node');
const airbrakeExpress = require('@airbrake/node/dist/instrumentation/express');
const json_stringify_safe = require('json-stringify-safe');

const airbrake = new Airbrake.Notifier({
    projectId: env.AIRBRAKE.PROJECT_ID,
    projectKey: env.AIRBRAKE.PROJECT_KEY,
    environment: `${env.NODE_ENV}`
});

const airbrake_request_logger = (dto: {serviceResponse: ServiceRespI}) => {
    try {
        const { request, error, data, message, actionType } = dto.serviceResponse;
        const dataErr = data ? json_stringify_safe(data) : null;
        const errorErr = error ? json_stringify_safe(error, null) : null;
        const messageErr = message ? json_stringify_safe(message) : null;
        const error_ = messageErr || errorErr || dataErr;
        const actionType_ = actionType || 'App Error';
        const body = request && request.body ? request.body : 'no body';
        const url = request && request.url ? request.url : 'no url';
        airbrake.notify({
            error: error_,
            params: { url, body, actionType: actionType_},
            route: url
        })
    } catch (error) {
        airbrake.notify(error)
    }
}
const airtbrake_error_logger = (dto: {error: any, params: any, route: any}) => {
    try {
        airbrake.notify({
            error: json_stringify_safe(dto.error, null) ,
            params: dto.params,
            route: dto.route
        })
    } catch (error) {
        airbrake.notify(error)
    }
}
export {
    airbrake,
    airbrakeExpress,
    airbrake_request_logger,
    airtbrake_error_logger
}