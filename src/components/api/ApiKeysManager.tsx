'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from 'next-auth/react';
import {
  Key,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  tier: string;
  isActive: boolean;
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  requestCount: number;
  requestLimit: number;
  monthlyRequests: number;
}

export default function ApiKeysManager() {
  const { data: session } = useSession();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [selectedKeyStats, setSelectedKeyStats] = useState<any>(null);

  useEffect(() => {
    if (session?.user) {
      fetchApiKeys();
    }
  }, [session]);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/user/api-keys');
      const data = await response.json();

      if (data.success) {
        setApiKeys(data.apiKeys);
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
      toast.error('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for the API key');
      return;
    }

    setCreating(true);

    try {
      const response = await fetch('/api/user/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newKeyName,
          tier: 'free',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create API key');
      }

      toast.success('API key created successfully!');
      setNewKeyName('');
      await fetchApiKeys();

      // Show the new key temporarily
      setVisibleKeys(new Set([data.apiKey.id]));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setCreating(false);
    }
  };

  const revokeApiKey = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/user/api-keys?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to revoke API key');
      }

      toast.success('API key revoked successfully');
      await fetchApiKeys();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('API key copied to clipboard');
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const fetchKeyStats = async (apiKeyId: string) => {
    try {
      const response = await fetch(`/api/user/api-usage?apiKeyId=${apiKeyId}&days=30`);
      const data = await response.json();

      if (data.success) {
        setSelectedKeyStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch key stats:', error);
      toast.error('Failed to load statistics');
    }
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 12) return key;
    return `${key.substring(0, 12)}${'*'.repeat(key.length - 16)}${key.substring(key.length - 4)}`;
  };

  const getTierColor = (tier: string) => {
    const colors = {
      FREE: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      BASIC: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      PRO: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      ENTERPRISE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    };
    return colors[tier as keyof typeof colors] || colors.FREE;
  };

  if (!session?.user) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Please sign in to manage API keys</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create New Key */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New API Key
          </CardTitle>
          <CardDescription>Generate a new API key to access our calculator API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="key-name">API Key Name</Label>
              <Input
                id="key-name"
                placeholder="e.g., Production App, Mobile App, Testing"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createApiKey()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={createApiKey} disabled={creating || !newKeyName.trim()}>
                {creating ? 'Creating...' : 'Create Key'}
              </Button>
            </div>
          </div>

          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="font-medium mb-1">🔒 Security Notice:</p>
            <p className="text-muted-foreground">
              Store your API key securely. It will only be shown once after creation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* API Keys List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Your API Keys ({apiKeys.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Key className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No API Keys Yet</h3>
              <p className="text-muted-foreground text-sm">
                Create your first API key to start using our API
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <Card key={apiKey.id} className={!apiKey.isActive ? 'opacity-60' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{apiKey.name}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded ${getTierColor(apiKey.tier)}`}>
                            {apiKey.tier}
                          </span>
                          {!apiKey.isActive && (
                            <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded">
                              Inactive
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-mono">
                          <code className="text-muted-foreground">
                            {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                            className="h-6 w-6 p-0"
                          >
                            {visibleKeys.has(apiKey.id) ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(apiKey.key)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => revokeApiKey(apiKey.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Requests</p>
                        <p className="font-medium">
                          {apiKey.requestCount.toLocaleString()} / {apiKey.requestLimit.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">This Month</p>
                        <p className="font-medium">{apiKey.monthlyRequests.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Created</p>
                        <p className="font-medium">{new Date(apiKey.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Last Used</p>
                        <p className="font-medium">
                          {apiKey.lastUsedAt ? new Date(apiKey.lastUsedAt).toLocaleDateString() : 'Never'}
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => fetchKeyStats(apiKey.id)}
                      className="mt-3 gap-2"
                    >
                      <BarChart3 className="h-3.5 w-3.5" />
                      View Stats
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Modal (if stats are loaded) */}
      {selectedKeyStats && (
        <Card>
          <CardHeader>
            <CardTitle>API Usage Statistics</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Requests</p>
                  <p className="text-2xl font-bold">{selectedKeyStats.stats.totalRequests}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    Success Rate
                  </p>
                  <p className="text-2xl font-bold">{selectedKeyStats.stats.successRate.toFixed(1)}%</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Avg Response</p>
                  <p className="text-2xl font-bold">{selectedKeyStats.stats.avgResponseTime}ms</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <XCircle className="h-3.5 w-3.5 text-red-500" />
                    Failed
                  </p>
                  <p className="text-2xl font-bold">{selectedKeyStats.stats.failedRequests}</p>
                </CardContent>
              </Card>
            </div>

            <Button variant="outline" onClick={() => setSelectedKeyStats(null)}>
              Close
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
