"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var fs_1 = __importDefault(require("fs"));
var NotAuthenticatedError_1 = require("../Common/Errors/NotAuthenticatedError");
var Auth = /** @class */ (function () {
    function Auth() {
    }
    //TODO: Fix public key not being available in class bug.
    // Acts as an authentication middleware that authenticates a user's JSON Webtoken
    // If no web token exists it throws a NotAuthenticatedError 
    Auth.prototype.authenitcateJWT = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var token, PUBLIC_KEY;
            return __generator(this, function (_a) {
                console.log(req.cookies);
                token = req.cookies["jwt"];
                if (!token) {
                    throw new NotAuthenticatedError_1.NotAuthenticatedError();
                }
                PUBLIC_KEY = fs_1.default.readFileSync('C:\\Users\\Aaron\\Desktop\\Basic-Blog\\src\\Auth\\rsa.pem');
                //verify the token
                jsonwebtoken_1.default.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] }, function (err, payload) {
                    //check for error in the decoding 
                    if (err) {
                        throw new NotAuthenticatedError_1.NotAuthenticatedError();
                    }
                    //check if payload is undefined --if not undefined the token is valid
                    if (payload === undefined) {
                        throw new NotAuthenticatedError_1.NotAuthenticatedError();
                    }
                    //make the payload keys accessible -- token interface is: {iat: string, sub: string, expires: string} as well as other keys
                    var accessiblePayload = payload;
                    //get the subject from the payload
                    var subject = accessiblePayload.sub;
                    //verify the subject exists
                    if (subject === undefined || subject === null || subject === '') {
                        throw new NotAuthenticatedError_1.NotAuthenticatedError();
                    }
                    // attach subject information to res.locals to persist the information to endpoint
                    res.locals.userId = subject;
                    //continue flow to endpoint
                    next();
                });
                return [2 /*return*/];
            });
        });
    };
    Auth.prototype.createJWT = function (user) {
        //create a jwt using the private key and the user information
        var PRIVATE_KEY = fs_1.default.readFileSync('C:\\Users\\Aaron\\Desktop\\Basic-Blog\\src\\Auth\\rsa.key'); //TODO: Use env npm package
        var jwtBearerToken = jsonwebtoken_1.default.sign({}, PRIVATE_KEY, {
            algorithm: 'RS256',
            expiresIn: "2 days",
            subject: "" + user.getUsername() //TODO: Do not use username in the jwt payload -- use user id 
        });
        return jwtBearerToken;
    };
    //code that takes a jwt token and authenticates it then passes back the subject
    Auth.prototype.setSubject = function (token, subject) {
        //check if token exists
        if (!token) {
            //if no token return an empty string
            return;
        }
        //verify the passed in jsonwebtoken --TODO: Make async?
        var PUBLIC_KEY = fs_1.default.readFileSync('C:\\Users\\Aaron\\Desktop\\Basic-Blog\\src\\Auth\\rsa.pem');
        //verify the token
        jsonwebtoken_1.default.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] }, function (err, payload) {
            console.log("Verify callback");
            //check for error in the decoding 
            if (err) {
                return;
            }
            //check if payload is undefined --if not undefined the token is valid
            if (payload === undefined) {
                return;
            }
            //make the payload keys accessible -- token interface is: {iat: string, sub: string, expires: string} as well as other keys
            var accessiblePayload = payload;
            //set subject value 
            subject.id = accessiblePayload.sub;
            console.log("Subject should be set!");
            console.log(subject);
            //verify the subject exists
            if (subject === undefined || subject === null || subject.id === '') {
                return;
            }
        });
    };
    return Auth;
}());
exports.default = Auth;
