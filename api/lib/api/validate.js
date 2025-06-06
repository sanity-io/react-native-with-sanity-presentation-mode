"use strict";
// THIS API ROUTE NEEDS TO BE DEPLOYED TO A HOSTING SERVICE (e.g. Vercel) 
// COULD ALSO BE IMPLEMENTED IN A LAMBDA, GCP CLOUD FUNCTION, ETC.
// THE POINT IS TO KEEP THE SANITY VIEWER TOKEN OUT OF THE CLIENT SIDE CODE
// BECAUSE IT CAN VIEW DRAFT CONTENT (WHICH SHOULD BE SECURED EVEN IN PRIVATE DATASETS)
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const preview_url_secret_1 = require("@sanity/preview-url-secret");
const constants_1 = require("../constants");
const client_1 = require("../sanity/client");
async function POST(request) {
    console.log("RUNNING VALIDATE!!!!!!!!!!!");
    try {
        const { PRIVATE_SANITY_VIEWER_TOKEN: token = '' } = process.env;
        const { 'sanity-preview-secret': secret, 'sanity-preview-pathname': pathname, 'sanity-preview-perspective': perspective } = await request.json();
        if (!secret) {
            throw new Error("Preview mode missing token");
        }
        if (!token) {
            throw new Error("Internal server error");
        }
        const clientWithToken = (0, client_1.createSanityClient)({ token });
        const url = `${constants_1.BASE_URL}/${pathname}?sanity-preview-secret=${secret}&sanity-preview-perspective=${perspective}&sanity-preview-pathname=${pathname}`;
        const { isValid, redirectTo = "/" } = await (0, preview_url_secret_1.validatePreviewUrl)(clientWithToken, url);
        if (!isValid) {
            console.log("Unauthorized/invalid");
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        return Response.json({ isValid, redirectTo, token });
    }
    catch (error) {
        console.error("Error in validate request:", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
exports.POST = POST;
