
// THIS EXPO API ROUTE NEEDS TO BE DEPLOYED TO A HOSTING SERVICE (e.g. Vercel) 
// COULD ALSO BE IMPLEMENTED IN A LAMBDA, GCP CLOUD FUNCTION, ETC.
// THE POINT IS TO KEEP THE SANITY VIEWER TOKEN OUT OF THE CLIENT SIDE CODE
// BECAUSE IT CAN VIEW DRAFT CONTENT (WHICH SHOULD BE SECURED EVEN IN PRIVATE DATASETS)

import { BASE_URL } from "@/constants";
import { createSanityClient } from "@/data/client";
import { validatePreviewUrl } from "@sanity/preview-url-secret";

export async function POST(request: Request) {
    const { PRIVATE_SANITY_VIEWER_TOKEN: token } = process.env;
    const { secret, pathname, perspective } = await request.json();

    if (!secret) {
        throw new Error("Preview mode missing token");
      }
  
    const clientWithToken = createSanityClient({ token });
    const url = `${BASE_URL}/${pathname}?sanity-preview-secret=${secret}&sanity-preview-perspective=${perspective}&sanity-preview-pathname=${pathname}`      

    const { isValid, redirectTo = "/" } = await validatePreviewUrl(
        clientWithToken,
        url     
      );

    if(!isValid) {
      return new Response(JSON.stringify({error: 'Unauthorized'}), {status: 401})
    }

    return Response.json({ isValid, redirectTo, token });
  }