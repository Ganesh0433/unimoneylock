import React from 'react';
import { useRouter } from 'next/router';

function Home1() {
    const router = useRouter();
    const debitTransaction = () => {
        router.push(`/debitTransaction`);
      };
    const creditTransaction = () => {
        router.push(`/creditTransaction`);
      };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <button onClick={debitTransaction} className="m-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none">
        Debit Transaction
      </button>
      <button onClick={creditTransaction} className="m-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none">
        Credit Transaction
      </button>
    </div>
  );
}

export default Home1;
