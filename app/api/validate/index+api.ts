
// THIS EXPO API ROUTE NEEDS TO BE DEPLOYED TO A HOSTING SERVICE (e.g. Vercel) 
// COULD ALSO BE IMPLEMENTED IN A LAMBDA, GCP CLOUD FUNCTION, ETC.
// THE POINT IS TO KEEP THE SANITY VIEWER TOKEN OUT OF THE CLIENT SIDE CODE
// BECAUSE IT CAN VIEW DRAFT CONTENT (WHICH SHOULD BE SECURED EVEN IN PRIVATE DATASETS)

import { BASE_URL } from "@/constants";
import { createSanityClient } from "@/data/client";
import { validatePreviewUrl } from "@sanity/preview-url-secret";

export async function POST(request: Request) {
  try {
    console.log("validate request", request); 
    const { PRIVATE_SANITY_VIEWER_TOKEN: token } = process.env;
    const { secret, pathname, perspective } = await request.json();

    console.log("Secret is present?", secret); 

    if (!secret) {
        throw new Error("Preview mode missing token");
    }

    console.log("Secret is present?", secret); 
  
    const clientWithToken = createSanityClient({ token });
    
    console.log("Client and token found?:",{client: !!clientWithToken, token: !!token} ); 

    const url = `${BASE_URL}/${pathname}?sanity-preview-secret=${secret}&sanity-preview-perspective=${perspective}&sanity-preview-pathname=${pathname}`      

    console.log("URL is:", url); 

    const { isValid, redirectTo = "/" } = await validatePreviewUrl(
        clientWithToken,
        url     
      );

    console.log("isValid is:", isValid); 

    if(!isValid) {
      console.log("Unauthorized/invalid"); 
      return new Response(JSON.stringify({error: 'Unauthorized'}), {status: 401})
    }

    console.log("Response is:", { isValid, redirectTo, token }); 

    return Response.json({ isValid, redirectTo, token });
  } catch (error) {
    console.error("Error in validate request:", error); 
    return new Response(JSON.stringify({error: 'Internal Server Error'}), {status: 500})
  }
}