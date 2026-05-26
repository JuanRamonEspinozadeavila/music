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
      <h2
        style={{
          fontSize: "26px",
          fontWeight: 400,
          margin: 0,
          color: "#fff",
        }}
      >
        Propotipo 2026
      </h2>

    
    </header>
  );
}