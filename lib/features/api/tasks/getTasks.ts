export const getTasks = async () => {
  console.log("CLICK!")
  try {

    const response = await fetch(`/api/tasks`, {
      method: 'GET',
    });
    console.log("response",response)

  } catch (error)
  {
    console.log("error",error)
  }
}