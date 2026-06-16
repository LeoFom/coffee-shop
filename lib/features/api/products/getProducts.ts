import {NextResponse} from "next/server";

export async function getProducts(){
  try {
    const apiUrl = process.env.NEXT_PUBLIC_URL

    if(!apiUrl) {
      throw {message: 'Failed env NEXT_PUBLIC_URL'}
    }

    const response = await fetch(`${apiUrl}/api/products`, {
      method: 'GET',
    })

    // console.log("response",response)
    if(response.ok){
      return response.json()
    }

  }
  catch (error){
    if(process.env.NEXT_PUBLIC_MODE === 'dev'){
      console.log('[GET] /api/products error:', error)
    }
  }
}

export const getProducts2 = async () => {
  try {

    const response = await fetch(`/api/products`, {
      method: 'GET',
    });
    // console.log("response",response)

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(errorText, { status: response.status });
    }

    const data = await response.json();

    return Response.json(data, {
      status: response.status,
    });
  } catch (error)
  {
    console.log("error",error)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}