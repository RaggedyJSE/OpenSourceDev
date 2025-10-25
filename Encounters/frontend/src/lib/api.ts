export async function createEncounter(form: any) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/encounters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form)
  });
  return res.json();
}
