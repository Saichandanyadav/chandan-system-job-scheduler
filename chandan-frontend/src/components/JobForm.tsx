"use client"

import { useState } from 'react';
import api from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Sparkles } from "lucide-react";

export default function JobForm({ onJobCreated, setOpen }: { onJobCreated: () => void, setOpen: (open: boolean) => void }) {
  const [formData, setFormData] = useState({ taskName: '', payload: '', priority: 'Medium' });
  const [jsonError, setJsonError] = useState(false);
  const [loading, setLoading] = useState(false);

  const insertTemplate = () => {
    const template = {
      taskName: "System Data Sync",
      priority: "Medium",
      payload: {
        email: "admin@dotix.io",
        name: "Cloud_Instance_01",
        action: "full_sync",
        metadata: {
          region: "us-east-1",
          retry: true
        }
      }
    };
    setFormData({
      taskName: template.taskName,
      priority: template.priority,
      payload: JSON.stringify(template.payload, null, 2)
    });
    setJsonError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const jsonPayload = JSON.parse(formData.payload);
      await api.post('/jobs', { 
        taskName: formData.taskName,
        priority: formData.priority,
        payload: jsonPayload 
      });
      setFormData({ taskName: '', payload: '', priority: 'Medium' });
      onJobCreated();
      setOpen(false);
    } catch (err) {
      setJsonError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pt-4">
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Process Name</Label>
        <Input 
          value={formData.taskName} 
          onChange={(e) => setFormData({...formData, taskName: e.target.value})}
          className="bg-muted/50 border-border" 
          placeholder="e.g. data-sync-worker" 
          required 
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Configuration</Label>
          <Button type="button" onClick={insertTemplate} variant="ghost" className="h-6 text-[10px] text-primary hover:bg-primary/10 px-2 rounded-full">
            <Sparkles className="h-3 w-3 mr-1" /> Use Template
          </Button>
        </div>
        <Textarea 
          className={`font-mono text-xs h-32 bg-muted/30 border-border resize-none ${jsonError ? 'border-destructive' : ''}`}
          value={formData.payload}
          onChange={(e) => { setFormData({...formData, payload: e.target.value}); setJsonError(false); }}
          required 
        />
        {jsonError && <p className="text-[10px] text-destructive flex items-center gap-1 font-medium"><AlertCircle className="h-3 w-3" /> Invalid JSON Format</p>}
      </div>

      <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-xl border border-border">
        {(['Low', 'Medium', 'High'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setFormData({...formData, priority: p})}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${formData.priority === p ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}
          >
            {p}
          </button>
        ))}
      </div>

      <Button type="submit" disabled={loading} className="w-full h-11 font-bold rounded-xl shadow-lg shadow-primary/20">
        {loading ? "Processing..." : "Deploy Process"}
      </Button>
    </form>
  );
}