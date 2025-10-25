import { useEffect, useState } from "react";
import { createEncounter } from "../lib/api";

export default function EncounterForm({
  onGenerated,
}: {
  onGenerated: (data: any) => void;
}) {
  const [form, setForm] = useState({
    environment: "forest",
    tone: "mysterious",
    difficulty: "medium",
    focus: ["combat"],
    encounter_count: 1,
    narrative: true,
    story_seed: "",
    party_id: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await createEncounter(form);
    onGenerated(data);
  };

  const [parties, setParties] = useState([
  { id: "1", name: "The Fellowship" },
  { id: "2", name: "Band of Blades" },
]);


  /*This is for later use for loading parties from the API.
  useEffect(() => {
  async function loadParties() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/parties`);
    const data = await res.json();
    setParties(data);
  }
  loadParties();
}, []);*/

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-zinc-900 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold">Build Your Encounter</h2>

      <label>Party / Characters</label>
      <select onChange={e => setForm({ ...form, party_id: e.target.value })}>
        <option value="">-- Select Party --</option>
        {parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>

      <label>Environment</label>
      <select value={form.environment} onChange={e => setForm({ ...form, environment: e.target.value })}>
        <option>forest</option><option>desert</option><option>dungeon</option>
      </select>

      <label>Tone</label>
      <input type="text" value={form.tone} onChange={e => setForm({ ...form, tone: e.target.value })} />

      <label>Difficulty</label>
      <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
        <option>easy</option><option>medium</option><option>hard</option>
      </select>

      <label>Focus</label>
      <select multiple value={form.focus} onChange={e => setForm({ ...form, focus: Array.from(e.target.selectedOptions, o => o.value) })}>
        <option>combat</option><option>puzzle</option><option>roleplay</option>
      </select>

      <label>Encounter Count</label>
      <input type="number" value={form.encounter_count} onChange={e => setForm({ ...form, encounter_count: +e.target.value })} />

      <label>
        <input type="checkbox" checked={form.narrative} onChange={e => setForm({ ...form, narrative: e.target.checked })} />
        Include Narrative
      </label>

      <textarea placeholder="Story seed (optional)" value={form.story_seed} onChange={e => setForm({ ...form, story_seed: e.target.value })}></textarea>

      <button className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500">
        Generate Encounter
      </button>
    </form>
  );
}
