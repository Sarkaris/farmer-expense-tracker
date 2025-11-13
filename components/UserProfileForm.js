'use client';

export default function UserProfileForm({ user, onSave, loading }) {
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      pincode: formData.get("pincode")?.toString().trim(),
      farmSize: Number(formData.get("farmSize")),
    };

    if (user?._id) {
      payload._id = user._id;
    }

    await onSave(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          className="form-input"
          name="name"
          placeholder="Farmer name"
          defaultValue={user?.name}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className="form-input"
          type="email"
          name="email"
          placeholder="farmer@example.com"
          defaultValue={user?.email}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted" htmlFor="pincode">
          Pincode
        </label>
        <input
          id="pincode"
          className="form-input"
          name="pincode"
          placeholder="e.g. 560001"
          defaultValue={user?.pincode}
          required
          pattern="[0-9]{6}"
          inputMode="numeric"
          title="Enter a 6-digit Indian postal code (numbers only)."
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted" htmlFor="farmSize">
          Farm Size (acres)
        </label>
        <input
          id="farmSize"
          className="form-input"
          name="farmSize"
          type="number"
          min="0.5"
          step="0.1"
          defaultValue={user?.farmSize}
          required
        />
      </div>
      <div className="flex items-center justify-end gap-3 md:col-span-2">
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Saving..." : user ? "Update Profile" : "Create Profile"}
        </button>
      </div>
    </form>
  );
}

