
// THIS API ROUTE NEEDS TO BE DEPLOYED TO A HOSTING SERVICE (e.g. Vercel) 
// COULD ALSO BE IMPLEMENTED IN A LAMBDA, GCP CLOUD FUNCTION, ETC.
// THE POINT IS TO KEEP THE SANITY VIEWER TOKEN OUT OF THE CLIENT SIDE CODE
// BECAUSE IT CAN VIEW DRAFT CONTENT (WHICH SHOULD BE SECURED EVEN IN PRIVATE DATASETS)

import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { WEB_APP_BASE_URL } from "../constants.js";
import { createSanityClient } from "../sanity/client.js";

export async function POST(request) {
  try {
    const { PRIVATE_SANITY_VIEWER_TOKEN: token = '' } = process.env;
    const { 'sanity-preview-secret': secret, 'sanity-preview-pathname': pathname, 'sanity-preview-perspective': perspective } = await request.json();

    console.log({sanity_preview_secret: secret, sanity_preview_pathname: pathname, sanity_preview_perspective: perspective});

    if (!secret) {
        throw new Error("Preview mode missing token");
    }
    if (!token) {
        throw new Error("Internal server error");
    }
  
    const clientWithToken = createSanityClient({ token });
    const url = `${WEB_APP_BASE_URL}/${pathname}?sanity-preview-secret=${secret}&sanity-preview-perspective=${perspective}&sanity-preview-pathname=${pathname}`      

    const { isValid, redirectTo = "/" } = await validatePreviewUrl(
        clientWithToken,
        url     
      );

    if(!isValid) {
      console.log("Unauthorized/invalid"); 
      return new Response(JSON.stringify({error: 'Unauthorized'}), {status: 401})
    }

    return Response.json({ isValid, redirectTo, token });
  } catch (error) {
    console.error("Error in validate request:", error); 
    return new Response(JSON.stringify({error: 'Internal Server Error'}), {status: 500})
  }
}