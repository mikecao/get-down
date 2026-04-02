import { KeyRound, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type Credential, useCredentialsStore } from '@/lib/credentialsStore';

function CredentialForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Credential;
  onSave: (domain: string, username: string, password: string) => void;
  onCancel: () => void;
}) {
  const [domain, setDomain] = useState(initial?.domain || '');
  const [username, setUsername] = useState(initial?.username || '');
  const [password, setPassword] = useState(initial?.password || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim() && username.trim() && password.trim()) {
      onSave(domain.trim(), username.trim(), password.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <Label htmlFor="cred-domain">Domain</Label>
        <Input
          id="cred-domain"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          placeholder="e.g., crunchyroll.com"
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="cred-username">Username</Label>
        <Input
          id="cred-username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter username or email"
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="cred-password">Password</Label>
        <Input
          id="cred-password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter password"
          autoComplete="off"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!domain.trim() || !username.trim() || !password.trim()}>
          {initial ? 'Update' : 'Add'}
        </Button>
      </div>
    </form>
  );
}

export function CredentialManager() {
  const {
    credentials,
    loaded,
    loadCredentials,
    addCredential,
    updateCredential,
    removeCredential,
  } = useCredentialsStore();
  const [editing, setEditing] = useState<Credential | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!loaded) {
      loadCredentials();
    }
  }, [loaded, loadCredentials]);

  const handleAdd = async (domain: string, username: string, password: string) => {
    await addCredential(domain, username, password);
    setAdding(false);
  };

  const handleUpdate = async (domain: string, username: string, password: string) => {
    if (editing) {
      await updateCredential(editing.id, domain, username, password);
      setEditing(null);
    }
  };

  const handleDelete = async (id: number) => {
    await removeCredential(id);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Manage logins">
          <KeyRound size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between">
          <DialogTitle>Site Logins</DialogTitle>
          <DialogClose>
            <Button variant="ghost" size="icon" title="Close">
              <X size={16} />
            </Button>
          </DialogClose>
        </div>
        <p className="text-muted-foreground text-sm">
          Credentials are automatically used when downloading from matching sites.
        </p>

        <div className="mt-2 flex max-h-[50vh] flex-col gap-2 overflow-y-auto">
          {credentials.length === 0 && !adding && (
            <p className="py-4 text-center text-neutral-500 text-sm">
              No saved logins. Add credentials for sites that require authentication.
            </p>
          )}

          {credentials.map(cred =>
            editing?.id === cred.id ? (
              <div
                key={cred.id}
                className="rounded border border-border bg-neutral-50 p-3 dark:bg-neutral-900"
              >
                <CredentialForm
                  initial={cred}
                  onSave={handleUpdate}
                  onCancel={() => setEditing(null)}
                />
              </div>
            ) : (
              <div
                key={cred.id}
                className="flex items-center justify-between rounded border border-border px-3 py-2"
              >
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  <span className="truncate font-medium text-sm">{cred.domain}</span>
                  <span className="truncate text-muted-foreground text-xs">{cred.username}</span>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Edit"
                    onClick={() => {
                      setAdding(false);
                      setEditing(cred);
                    }}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Delete"
                    onClick={() => handleDelete(cred.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ),
          )}

          {adding && (
            <div className="rounded border border-border bg-neutral-50 p-3 dark:bg-neutral-900">
              <CredentialForm onSave={handleAdd} onCancel={() => setAdding(false)} />
            </div>
          )}
        </div>

        {!adding && !editing && (
          <Button
            variant="ghost"
            className="mt-2 w-full"
            onClick={() => {
              setEditing(null);
              setAdding(true);
            }}
          >
            <Plus size={16} />
            Add Login
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
