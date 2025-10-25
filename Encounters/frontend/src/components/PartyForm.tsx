import { useState, useEffect } from "react";
import { getCharacters, createParty } from "../lib/api";

export default function PartyForm({ onCreated }) {
  const [characters, setCharacters] = useState([]);
  const [selected, setSelected] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    getCharacters(userId).then(setCharacters);
  }, []);

  const toggleChar = (id: string) => {
    setSelected(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem("user_id");
    const data = await createParty({ user_id: userId, name, description, character_ids: selected });
    onCreated(data);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-slate-800 rounded-xl space-y-3">
      <h3 className="text-lg font-bold">Create Party</h3>
      <input placeholder="Party Name" value={name} onChange={e => setName(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}></textarea>
      
      <div className="space-y-1">
        <h4>Select Characters</h4>
        {characters.map(c => (
          <label key={c.id} className="block">
            <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleChar(c.id)} />
            <span className="ml-2">{c.name} ({c.class} lvl {c.level})</span>
          </label>
        ))}
      </div>

      <button className="bg-green-600 text-white px-3 py-1 rounded-md">Save Party</button>
    </form>
  );
}
