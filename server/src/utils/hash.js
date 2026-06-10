import crypto from "crypto";
import { HASH_ALGORITHM, TOKEN_ENCODING } from "../constant.js";

const hashFunction = (refreshToken) => {
    return crypto
        .createHash(HASH_ALGORITHM)
        .update(refreshToken)
        .digest(TOKEN_ENCODING);
};

export default hashFunction;