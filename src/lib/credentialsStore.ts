import { create } from 'zustand';
import { getDb } from './db';

export interface Credential {
  id: number;
  domain: string;
  username: string;
  password: string;
}

interface CredentialsState {
  credentials: Credential[];
  loaded: boolean;
  loadCredentials: () => Promise<void>;
  addCredential: (domain: string, username: string, password: string) => Promise<void>;
  updateCredential: (
    id: number,
    domain: string,
    username: string,
    password: string,
  ) => Promise<void>;
  removeCredential: (id: number) => Promise<void>;
  findCredential: (url: string) => Credential | undefined;
}

function extractDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    // Strip www. prefix for matching
    return hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export const useCredentialsStore = create<CredentialsState>()((set, get) => ({
  credentials: [],
  loaded: false,

  loadCredentials: async () => {
    const db = await getDb();
    const rows = await db.select<Credential[]>(
      'SELECT id, domain, username, password FROM credentials ORDER BY domain',
    );
    set({ credentials: rows, loaded: true });
  },

  addCredential: async (domain: string, username: string, password: string) => {
    const db = await getDb();
    const result = await db.execute(
      'INSERT INTO credentials (domain, username, password) VALUES ($1, $2, $3)',
      [domain.toLowerCase(), username, password],
    );
    const id = result.lastInsertId as number;
    set(state => ({
      credentials: [...state.credentials, { id, domain: domain.toLowerCase(), username, password }],
    }));
  },

  updateCredential: async (id: number, domain: string, username: string, password: string) => {
    const db = await getDb();
    await db.execute(
      'UPDATE credentials SET domain = $1, username = $2, password = $3 WHERE id = $4',
      [domain.toLowerCase(), username, password, id],
    );
    set(state => ({
      credentials: state.credentials.map(c =>
        c.id === id ? { id, domain: domain.toLowerCase(), username, password } : c,
      ),
    }));
  },

  removeCredential: async (id: number) => {
    const db = await getDb();
    await db.execute('DELETE FROM credentials WHERE id = $1', [id]);
    set(state => ({
      credentials: state.credentials.filter(c => c.id !== id),
    }));
  },

  findCredential: (url: string) => {
    const domain = extractDomain(url);
    if (!domain) return undefined;
    return get().credentials.find(c => domain === c.domain || domain.endsWith(`.${c.domain}`));
  },
}));
