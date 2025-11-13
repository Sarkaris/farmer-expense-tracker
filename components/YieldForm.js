'use client';

import { useState } from "react";

const initialState = {
  cropId: "",
  totalYield: "",
  pricePerUnit: "",
  date: "",
};

export default function YieldForm({ crops, onCreate, disabled }) {
  const [form, setForm] = useState(initialState);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await onCreate({
      cropId: form.cropId,
      totalYield: Number(form.totalYield),
      pricePerUnit: Number(form.pricePerUnit),
      date: form.date,
    });
    setForm(initialState);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted">Crop</label>
        <select
          className="form-input"
          name="cropId"
          value={form.cropId}
          onChange={handleChange}
          required
          disabled={disabled || !crops.length}
        >
          <option value="">Select crop</option>
          {crops.map((crop) => (
            <option key={crop._id} value={crop._id}>
              {crop.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted">Yield Quantity</label>
        <input
          className="form-input"
          type="number"
          min="0"
          step="0.01"
          name="totalYield"
          value={form.totalYield}
          onChange={handleChange}
          required
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted">Price per Unit (₹)</label>
        <input
          className="form-input"
          type="number"
          min="0"
          step="0.01"
          name="pricePerUnit"
          value={form.pricePerUnit}
          onChange={handleChange}
          required
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted">Date</label>
        <input
          className="form-input"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          disabled={disabled}
        />
      </div>
      <div className="flex justify-end md:col-span-4">
        <button className="primary-button" type="submit" disabled={disabled}>
          Add Yield
        </button>
      </div>
    </form>
  );
}
