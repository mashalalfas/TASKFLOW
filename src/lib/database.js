// Database abstraction layer - supports both localStorage and Supabase
// Switch backends by setting VITE_DATABASE_MODE=supabase (or 'local' for localStorage)

const DB_MODE = import.meta.env.VITE_DATABASE_MODE || 'local';

class LocalStorageDB {
  constructor(storeName = 'taskflow-storage') {
    this.storeName = storeName;
  }

  async read() {
    const data = localStorage.getItem(this.storeName);
    return data ? JSON.parse(data) : null;
  }

  async write(data) {
    localStorage.setItem(this.storeName, JSON.stringify(data));
  }

  async clear() {
    localStorage.removeItem(this.storeName);
  }

  subscribe(callback) {
    // LocalStorage doesn't support real-time, but we can listen to storage events
    const handler = () => {
      const data = this.read();
      if (data) callback(data);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }
}

class SupabaseDB {
  constructor(supabaseClient) {
    this.client = supabaseClient;
  }

  async read() {
    const { data, error } = await this.client.from('taskflow').select('*').single();
    if (error) throw error;
    return data;
  }

  async write(data) {
    const { error } = await this.client.from('taskflow').upsert(data);
    if (error) throw error;
  }

  async clear() {
    const { error } = await this.client.from('taskflow').delete().neq('id', '');
    if (error) throw error;
  }

  subscribe(callback) {
    const subscription = this.client
      .channel('taskflow-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'taskflow' }, (payload) => {
        callback(payload.new);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }
}

export function createDatabase() {
  if (DB_MODE === 'supabase') {
    // Import dynamically to avoid bundling Supabase if not needed
    const { createSupabaseClient } = require('./supabaseClient');
    return new SupabaseDB(createSupabaseClient());
  }
  return new LocalStorageDB();
}

export const db = createDatabase();
