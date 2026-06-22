import { ApiResponse } from "./ApiResponse.js";
import { STATUS_CODE } from "./constants.js";

export function asyncHandler(cb, label) {
    return async (req, res) => {
        try {
            await cb(req, res);
        } catch(error) {
            console.log(`Error at ${label}: ${error}`);
            return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(new ApiResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, "Server error", {}));
        }
    }
}