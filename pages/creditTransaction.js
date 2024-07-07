import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
const Modal = ({ transaction, onClose }) => {
  const [amount, setAmount] = useState(transaction.Amount);
  const [message, setmessage] = useState(transaction.Message);

  const [data, setdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const fetchdata = async () => {
      try {
        const res = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/currentbalance/${transaction.userid}.json`);
        if (res.ok) {
          var wdata = await res.json();
          setdata(Object.values(wdata).pop());

          console.log("Fetched user info:", wdata);
         
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
    if (transaction.userid) {
      fetchdata();
    }
  }, [transaction.userid]);

  console.log("store is ",data)

  const updatedAmount = data? Number(data.CurrentBalance) - Number(transaction.Amount) : amount;
  console.log("updated amount",updatedAmount)
  function formatDate(date) {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    const timeString = date.toLocaleTimeString('en-US', options);
  
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
  
    return `Last updated at ${timeString.toLowerCase()} on ${day} ${month} ${year}`;
  }
  
  const date = new Date();
  const formattedDate = formatDate(date);
  
  console.log(formattedDate);

  const option = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        CurrentBalance: updatedAmount,
        formattedDate:formattedDate
    })
};
const options = {
  method: 'POST',
  headers: {
      'Content-Type': 'application/json'
  },
  body: JSON.stringify({
      txnid:transaction.txnid,
      DateToCredit:transaction.DateToCredit,
      TimeToCredit:transaction.TimeToCredit,
      Amount:transaction.Amount,
      Message:transaction.Message,
      userid:transaction.userid
  })
};

const modifyData = async () => {
    try {
        const res = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/currentbalance/${transaction.userid}.json`, option);
        const response = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/userinfo/${transaction.userid}/RecentTransaction.json`, options);

        if (res.ok) {
            const data = await res.json();
            console.log("Data modified successfully:", data);
        } else {
            console.error("Failed to modify data");
        }

        if (response.ok) {
            const data = await res.json();
            console.log("Data modified successfully:", data);
        } else {
            console.error("Failed to modify data");
        }
    } catch (error) {
        console.error("Error modifying data:", error);
    }
};


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg">
      <p className='text-center'>{message}</p>

        <input
          type="text"
          className="p-2 border rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter amount..."
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      <button 
    onClick={() => {
        modifyData();
        onClose();
    }}
    className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-700"
>
    UnLock Money
</button>
      </div>
    </div>
  );
}


function CreditTransaction() {
  const router = useRouter();
  const [store, setStore] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { me } = router.query;

  const fetchData = async () => {
    try {
      const res = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/userinfo/${me}/Transactions.json`);
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched transactions:", data);
        setStore(Object.values(data));
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (me) {
      fetchData();
    }
  }, [me]);

  const handleSearch = async () => {
    setStore([]);
    setLoading(true);

    try {
      const res = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/Alltransactions.json`);
      if (res.ok) {
        const data = await res.json();
        const matches = Object.values(data).filter(entry => entry.DateToCredit === searchTerm);
        setStore(matches.reverse());
      } else {
        throw new Error('Failed to fetch data.');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseModal = () => {
    setSelectedTransaction(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="pb-2 mb-4 text-3xl font-semibold text-gray-800 border-b-4 border-blue-500">
          Credit Transaction
        </h2>
        <div className="flex items-center">
          <input
            type="text"
            className="p-2 border rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="p-2 text-white bg-blue-500 rounded-r-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </div>
      <div className={`overflow-x-auto ${selectedTransaction ? 'blur-sm' : ''}`}>
    
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Transaction ID</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {store.length > 0 ? (
                store.map((transaction, index) => (
                  <tr key={index} className="bg-white cursor-pointer" onClick={() => handleTransactionClick(transaction)}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{transaction.txnid}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      <div>
                        {transaction.DateOfDebit} {transaction.TimeOfDebit} &nbsp; To &nbsp; {transaction.DateToCredit} {transaction.TimeToCredit}
                      </div>
                    </td>
                    <td className='px-6 py-4 text-sm font-semibold text-black whitespace-nowrap'>₹{transaction.Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-sm text-center text-gray-500">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        
      </div>
      {selectedTransaction && (
        <Modal transaction={selectedTransaction} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default CreditTransaction;
