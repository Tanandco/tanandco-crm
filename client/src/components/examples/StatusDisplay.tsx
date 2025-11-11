import { useState } from 'react';
import StatusDisplay from '../StatusDisplay';

export default function StatusDisplayExample() {
  const [customer, setCustomer] = useState<any>(null);

  const mockCustomer = {
    name: 'דוד כהן',
    balance: 8,
    lastVisit: '15/1/2025'
  };

  const handleIdentification = () => {
    console.log('Customer identification clicked');
    setCustomer(mockCustomer);
  };

  const handleLogout = () => {
    console.log('Customer logout');
    setCustomer(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black p-8">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center text-white mb-8">
          <h2 className="text-2xl font-hebrew mb-2">דוגמה למצב לקוח</h2>
          <button 
            onClick={handleLogout}
            className="text-primary hover:text-primary/80 text-sm font-hebrew underline"
          >
            התנתק (לבידוק הדוגמה)
          </button>
        </div>
        
        <StatusDisplay 
          customer={customer}
          onScanQR={handleIdentification}
          onPhoneLogin={handleIdentification}
        />
      </div>
    </div>
  );
}