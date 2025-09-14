const Settings = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Theme Toggle */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Appearance</h2>
        <button className="btn btn-outline">Toggle Dark / Light Theme</button>
      </section>

      {/* Notifications */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="checkbox" defaultChecked />
          <span>Email Notifications</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="checkbox" />
          <span>Push Notifications</span>
        </label>
      </section>

      {/* Privacy */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Privacy</h2>
        <p className="text-sm text-gray-500">Manage who can see your profile & activity.</p>
        <button className="btn btn-outline btn-error">Delete Account</button>
      </section>
    </div>
  );
};

export default Settings;
