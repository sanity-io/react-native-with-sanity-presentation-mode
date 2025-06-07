
// THIS API ROUTE NEEDS TO BE DEPLOYED TO A HOSTING SERVICE (e.g. Vercel) 
// COULD ALSO BE IMPLEMENTED IN A LAMBDA, GCP CLOUD FUNCTION, ETC.
// THE POINT IS TO KEEP THE SANITY VIEWER TOKEN OUT OF THE CLIENT SIDE CODE
// BECAUSE IT CAN VIEW DRAFT CONTENT (WHICH SHOULD BE SECURED EVEN IN PRIVATE DATASETS)

import { Request, Response } from 'undici';
const {validatePreviewUrl} = require("@sanity/preview-url-secret"); 
const { WEB_APP_BASE_URL } = require("../constants");
const { sanityClient } = require("../sanity/client");

type RequestBody = {
  'sanity-preview-secret'?: string;
  'sanity-preview-pathname'?: string;
  'sanity-preview-perspective'?: string;
} 

export const config = {
  runtime: 'edge',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': "*",
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

export async function POST(request: Request): Promise<Response> {
  try {    
    const requestBody = await request.json()
    const { 'sanity-preview-secret': secret, 'sanity-preview-pathname': pathname, 'sanity-preview-perspective': perspective } = requestBody as RequestBody


    if (!secret) {
      return new Response(JSON.stringify({error: 'Invalid request'}), {status: 400})
    }
  
    const url = `${WEB_APP_BASE_URL}/${pathname}?sanity-preview-secret=${secret}&sanity-preview-perspective=${perspective}&sanity-preview-pathname=${pathname}`      

    const validation = await validatePreviewUrl(
        sanityClient,
        url     
      );

    console.log("validation", validation);
    const { isValid } = validation;

    if(!isValid) {
      console.log("Unauthorized/invalid"); 
      return new Response(JSON.stringify({error: 'Unauthorized'}), {status: 401})
    }

    return new Response(JSON.stringify(validation), { status: 200, headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    } })
  } catch (error) {
    console.error("Error in validate request:", error); 
    return new Response(JSON.stringify({error: 'Internal Server Error'}), {status: 500})
  }
}