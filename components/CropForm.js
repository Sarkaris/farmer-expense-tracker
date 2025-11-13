'use client';

import { useState } from "react";

const initialState = {
  name: "",
  area: "",
  startDate: "",
  endDate: "",
};

export default function CropForm({ onCreate, disabled }) {
  const [form, setForm] = useState(initialState);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await onCreate({
      name: form.name,
      area: Number(form.area),
      startDate: form.startDate,
      endDate: form.endDate || null,
    });
    setForm(initialState);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium text-muted">Crop Name</label>
        <input
          className="form-input"
          name="name"
          placeholder="Maize"
          value={form.name}
          onChange={handleChange}
          required
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted">Area (acres)</label>
        <input
          className="form-input"
          type="number"
          min="0.1"
          step="0.1"
          name="area"
          value={form.area}
          onChange={handleChange}
          required
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted">Start Date</label>
        <input
          className="form-input"
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          required
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted">End Date</label>
        <input
          className="form-input"
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
      <div className="flex justify-end md:col-span-4">
        <button className="primary-button" type="submit" disabled={disabled}>
          Add Crop
        </button>
      </div>
    </form>
  );
}

