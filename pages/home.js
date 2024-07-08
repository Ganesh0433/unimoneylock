import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function Home1() {
  const [store, setStore] = useState([]);
  const [users, setUsers] = useState(0);
  const [notransactions, setNoOfTransactions] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const router = useRouter();

  const fetchAmount = async () => {
    setStore([]);
    try {
      const res = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/credentials.json`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          const noOfUsers = Object.keys(data).length;
          console.log("Number of users: ", noOfUsers);
          setUsers(noOfUsers);
        }
      } else {
        throw new Error('Failed to fetch data.');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    try {
      const res = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/Alltransactions.json`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          const noOfTransactions = Object.keys(data).length;
          setNoOfTransactions(noOfTransactions);
          const matches = Object.values(data).map(entry => Number(entry.Amount));
          const total = matches.reduce((acc, amount) => acc + amount, 0);
          setStore(matches.reverse());
          setTotalAmount(total);
        }
      } else {
        throw new Error('Failed to fetch data.');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAmount();
  }, []);

  const debitTransaction = () => {
    router.push(`/debitTransaction`);
  };

  const creditTransaction = () => {
    router.push(`/creditTransaction`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col w-full max-w-4xl p-6 mb-10 bg-white rounded-lg shadow-lg">
        <div className="flex justify-around mb-6">
          <div className="p-6 bg-blue-100 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-blue-600">Total Amount : </p>
            <p className="text-2xl font-bold text-blue-800">{totalAmount}</p>
          </div>
          <div className="p-6 bg-green-100 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-green-600">Total no of Users : </p>
            <p className="text-2xl font-bold text-green-800">{users}</p>
          </div>
          <div className="p-6 bg-yellow-100 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-yellow-600">Total no of Transactions :</p>
            <p className="text-2xl font-bold text-yellow-800">{notransactions}</p>
          </div>
        </div>
      </div>
      <div className="flex space-x-4">
        <button 
          onClick={debitTransaction} 
          className="px-6 py-3 font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none">
          Debit Transaction
        </button>
        <button 
          onClick={creditTransaction} 
          className="px-6 py-3 font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-700 focus:outline-none">
          Credit Transaction
        </button>
      </div>
    </div>
  );
}

export default Home1;
