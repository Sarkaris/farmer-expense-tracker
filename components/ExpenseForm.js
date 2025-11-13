'use client';

import { useState, useMemo } from "react";

const initialState = {
  type: "",
  amount: "",
  date: "",
  description: "",
  cropId: "",
  shared: false,
  sharedBetween: [],
};

const expenseTypes = [
  "Seeds",
  "Fertilizers",
  "Pesticides",
  "Labor",
  "Irrigation",
  "Machinery",
  "Transportation",
  "Miscellaneous",
];

export default function ExpenseForm({ crops, onCreate, disabled }) {
  const [form, setForm] = useState(initialState);

  const selectedCropOptions = useMemo(
    () => crops.map((crop) => ({ value: crop._id, label: crop.name })),
    [crops]
  );

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function toggleSharedCrop(cropId) {
    setForm((prev) => {
      const exists = prev.sharedBetween.includes(cropId);
      return {
        ...prev,
        sharedBetween: exists
          ? prev.sharedBetween.filter((id) => id !== cropId)
          : [...prev.sharedBetween, cropId],
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await onCreate({
      ...form,
      amount: Number(form.amount),
      sharedBetween: form.shared ? form.sharedBetween : [],
    });
    setForm(initialState);
  }

  const disableSharedSection = disabled || !crops.length;

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted">Expense Type</label>
        <select
          className="form-input"
          name="type"
          value={form.type}
          onChange={handleChange}
          required
          disabled={disabled}
        >
          <option value="">Select</option>
          {expenseTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted">Amount (₹)</label>
        <input
          className="form-input"
          type="number"
          min="0"
          step="0.01"
          name="amount"
          value={form.amount}
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
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted">Primary Crop</label>
        <select
          className="form-input"
          name="cropId"
          value={form.cropId}
          onChange={handleChange}
          required={!form.shared}
          disabled={disabled || !crops.length}
        >
          <option value="">Select crop</option>
          {selectedCropOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2 md:col-span-4">
        <label className="text-sm font-medium text-muted">Description</label>
        <textarea
          className="form-input min-h-20"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Notes or vendor name"
          disabled={disabled}
        />
      </div>
      <div className="md:col-span-4 flex flex-col gap-3 rounded-xl border surface-border bg-(--chip-bg)/60 p-4">
        <label className="inline-flex items-center gap-3 text-sm font-medium text-heading">
          <input
            type="checkbox"
            name="shared"
            checked={form.shared}
            onChange={handleChange}
            disabled={disableSharedSection}
            className="h-4 w-4 rounded border-(--border) bg-(--card) accent-(--accent)"
          />
          Shared across crops (auto distribute by area)
        </label>
        {form.shared ? (
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {selectedCropOptions.map((option) => (
              <label
                key={option.value}
                className="inline-flex items-center gap-2 rounded-lg border surface-border bg-(--card) px-3 py-2 text-sm text-heading shadow-sm"
              >
                <input
                  type="checkbox"
                  checked={form.sharedBetween.includes(option.value)}
                  onChange={() => toggleSharedCrop(option.value)}
                  className="h-4 w-4 rounded border-(--border) bg-(--card) accent-(--accent)"
                />
                {option.label}
              </label>
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex justify-end gap-3 md:col-span-4">
        <button className="primary-button" type="submit" disabled={disabled}>
          Add Expense
        </button>
      </div>
    </form>
  );
}

