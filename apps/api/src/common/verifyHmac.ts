import { timingSafeEqual } from "crypto";
import { hmac } from "./hmac.js";

export const verifyHmac = (plainText: string, hashedText: string): boolean => {
    const newHash = hmac(plainText);

    const bufferA = Buffer.from(newHash, 'hex');
    const bufferB = Buffer.from(hashedText, 'hex');

    if (bufferA.length !== bufferB.length) {
        return false;
    }

    return timingSafeEqual(bufferA, bufferB);
};