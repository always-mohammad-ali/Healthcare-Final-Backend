import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envVar } from "../config/env";
import { Response } from "express";
import { CookieUtils } from "./cookie";
import ms from "ms";


const getAccessToken = (payload : JwtPayload) =>{
    const accessToken = jwtUtils.createToken(
        payload,
        envVar.ACCESS_TOKEN_SECRET,
        { expiresIn : envVar.ACCESS_TOKEN_EXPIRES_IN } as SignOptions
    )

    return accessToken;
}

const getRefreshToken = ( payload : JwtPayload) =>{
    const refreshToken = jwtUtils.createToken(
        payload, 
        envVar.REFRESH_TOKEN_SECRET,
        { expiresIn : envVar.REFRESH_TOKEN_EXPIRES_IN } as SignOptions
    )


    return refreshToken;
}


const setAccessTokenInsideCookie = (res : Response, token : string) =>{
    const maxAge = ms(Number(envVar.ACCESS_TOKEN_EXPIRES_IN))
    CookieUtils.setCookie(res, 'accessToken', token, {
        httpOnly : true,
        secure : true,
        sameSite : "none",
        path : '/',
        maxAge : Number(maxAge)
    })
}

const setRefreshTokenInsideCookie = (res : Response, token : string) =>{
    const maxAge = ms(Number(envVar.REFRESH_TOKEN_EXPIRES_IN));
    CookieUtils.setCookie(res, 'refreshToken', token, {
        httpOnly : true,
        secure : true,
        sameSite : "none",
        path : '/',
        maxAge : Number(maxAge)
    })
}


const setBetterAuthSessionInsideCookie = (res : Response, token : string) =>{
    const maxAge = ms(Number(envVar.REFRESH_TOKEN_EXPIRES_IN));
    CookieUtils.setCookie(res, 'better-auth.session_cookie', token, {
        httpOnly : true,
        secure : true,
        sameSite : "none",
        path : '/',
        maxAge : Number(maxAge)
    })
}


export const tokenUtils = {
    getAccessToken,
    getRefreshToken,
    setAccessTokenInsideCookie,
    setRefreshTokenInsideCookie,
    setBetterAuthSessionInsideCookie
}