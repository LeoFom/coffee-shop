'use client';

export default function TaskApi() {

  const getTasks = async () => {
    console.log("CLICK!")
    try {

      const response = await fetch(`/api/tasks`, {
        method: 'GET',
      });

      // const response = await fetch('/api/tasks', {
      //   method: 'GET',
      //   // headers: { 'Content-Type': 'application/json' },
      // })
      console.log("response",response)

    } catch (error)
    {
      console.log("error",error)
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg pt-32 pb-24">
      <button
        onClick={getTasks}
      >Get tasks</button>
    </div>
  );
}