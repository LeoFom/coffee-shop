export async function getProducts(){
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    if(!apiUrl) {
      throw {message: 'Failed env NEXT_PUBLIC_API_URL'}
    }

    const response = await fetch(`${apiUrl}/api/products`, {
      method: 'GET',
    })

    console.log("response",response)
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