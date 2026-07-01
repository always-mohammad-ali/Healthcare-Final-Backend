import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envVar } from "../config/env";
import { Response } from "express";
import { CookieUtils } from "./cookie";
import ms, { StringValue } from "ms";


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
  //  const maxAge = ms(envVar.ACCESS_TOKEN_EXPIRES_IN as StringValue)      //it is giving us error and problematic
    CookieUtils.setCookie(res, 'accessToken', token, {
        httpOnly : true,
        secure : true,
        sameSite : "none",
        path : '/',
        //1d duration
        maxAge : 24 * 60 * 60 * 1000,
    })
}

const setRefreshTokenInsideCookie = (res : Response, token : string) =>{
   // const maxAge = ms(envVar.REFRESH_TOKEN_EXPIRES_IN as StringValue);
    CookieUtils.setCookie(res, 'refreshToken', token, {
        httpOnly : true,
        secure : true,
        sameSite : "none",
        path : '/',
        //7d duration
        maxAge : 24 * 7 * 60 * 60 * 1000,
    })
}


const setBetterAuthSessionInsideCookie = (res : Response, token : string) =>{
   // const maxAge = ms(envVar.REFRESH_TOKEN_EXPIRES_IN as StringValue);
    CookieUtils.setCookie(res, 'better-auth.session_cookie', token, {
        httpOnly : true,
        secure : true,
        sameSite : "none",
        path : '/',
        //1d duration
        maxAge : 24 * 60 * 60 * 1000,
    })
}


export const tokenUtils = {
    getAccessToken,
    getRefreshToken,
    setAccessTokenInsideCookie,
    setRefreshTokenInsideCookie,
    setBetterAuthSessionInsideCookie
}