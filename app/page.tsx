import Link from 'next/link';

export default function Home() {
  return (
    <main className='justify-content-center items-center flex flex-col'>
      <div className='bg-blue-900 text-center mt-10 rounded-2xl w-100' >
        <h1 className='text-2xl font-bold text-white'>Fit Monkey 🐒</h1>
        <p className='text-white'>Be fit like a Monkey!</p>
        <p className='text-white'>Track your fitness journey with Fit Monkey!</p>
      </div>
    </main>
  );
}

