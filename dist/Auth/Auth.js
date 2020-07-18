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
var Auth = /** @class */ (function () {
    //private PUBLIC_KEY: string;
    function Auth() {
        //this.PUBLIC_KEY = fs.readFileSync('C:\\Users\\Aaron\\Desktop\\Typescript-Starter\\src\\Auth\\jwtRS256.key.pub', "utf8")
        //console.log(this.PUBLIC_KEY);
    }
    //TODO: Fix public key not being available in class bug. 
    Auth.prototype.authenitcateJWT = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var token, PUBLIC_KEY;
            return __generator(this, function (_a) {
                try {
                    token = req.cookies["jwt"];
                    // console.log("Parsed Cookie:");
                    // console.log(token);
                    if (!token) {
                        return [2 /*return*/, res.status(401)]; //not authenticated
                    }
                    PUBLIC_KEY = fs_1.default.readFileSync('C:\\Users\\Aaron\\Desktop\\Basic-Blog\\src\\Auth\\rsa.pem');
                    //verify the token
                    jsonwebtoken_1.default.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] }, function (err, payload) {
                        //check for error in the decoding 
                        if (err) {
                            res.status(401).send("Error authenticating");
                            return;
                        }
                        //check if payload is undefined --if not undefined the token is valid
                        if (payload === undefined) {
                            res.status(401).send("Error authenticating");
                            return;
                        }
                        //console.log("Incoming cookies jwt payload: ");
                        //console.log(payload);
                        //make the payload keys accessible -- token interface is: {iat: string, sub: string, expires: string} as well as other keys
                        var accessiblePayload = payload;
                        //get the subject from the payload
                        var subject = accessiblePayload.sub;
                        //verify the subject exists
                        if (subject === undefined || subject === null || subject === '') {
                            res.status(401).send("Error authenticating");
                            return;
                        }
                        // attach subject information to res.locals to persist the information to endpoint
                        res.locals.userId = subject;
                        //continue flow to endpoint
                        next();
                    });
                }
                catch (e) {
                    console.log("Error: " + e);
                    res.status(401).send("Error authenticating");
                }
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
    return Auth;
}());
exports.default = Auth;
