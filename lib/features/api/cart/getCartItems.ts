export async function getCartItems() {
  try {
    const response = await fetch(`/api/cart`, {
      method: 'GET',
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const errorMessage = errorBody.text || 'Щось пішло не так';

      console.error(`Код помилки: ${response.status}. Повідомлення: ${errorMessage}`);

      return new Response(
        JSON.stringify({
          success: false,
          cartItems: [],
          error: errorMessage
        }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const data = await response.json()
    return data
  }
  catch (error) {
    if(process.env.NEXT_PUBLIC_MODE === 'dev'){
      console.log('[GET] /api/cart error:', error)
    }
  }
}