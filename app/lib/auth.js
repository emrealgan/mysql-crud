import { jwtVerify } from "jose";

export function getJWTSecretKey(){
  const secretKey = process.env.JWT_SECRET_KEY;

  if(!secretKey){
    throw new Error('JWT Secret Key is not available')
  }
  return new TextEncoder().encode(secretKey);
}

export async function verifyToken(token){
  try {
    const { payload } = await jwtVerify(token, getJWTSecretKey());
    return payload;
  } 
  catch (error) {
    return null;
  }
}