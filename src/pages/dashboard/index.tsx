function Dashboard() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <h2>My Resume</h2>
      <iframe
        src="https://docs.google.com/document/d/e/2PACX-1vTMoPAFZzdE7R1uyed9UfjZ9ZYYlSlDQ-tAgZlIOf68X8T1TcIiCbi8P4leY8vojApfClWKWibqhiin/pub?embedded=true"
        style={{ width: "100%", height: "90vh", border: "none" }}
        title="Resume"
      ></iframe>
    </div>
  );
}

export default Dashboard;
