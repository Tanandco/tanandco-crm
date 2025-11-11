import TouchInterface from '../TouchInterface';

export default function TouchInterfaceExample() {
  const handleServiceSelect = (service: string) => {
    console.log(`Service selected in example: ${service}`);
    // In real app, this would navigate to service-specific page
  };

  const handleNavigate = (path: string) => {
    console.log(`Navigation to ${path} in TouchInterface example`);
    // In real app, this would handle routing
  };

  return (
    <TouchInterface 
      onServiceSelect={handleServiceSelect}
      onNavigate={handleNavigate}
    />
  );
}