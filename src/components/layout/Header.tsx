export function Header() {
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Buenos días";
    }

    if (hour >= 12 && hour < 19) {
      return "Buenas tardes";
    }

    return "Buenas noches";
  };

  return (
    <header style={{ padding: "10px 0" }}>
      

    
    </header>
  );
}