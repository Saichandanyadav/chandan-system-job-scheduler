"use client"

import { useState } from 'react';
import api from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Eye, Terminal, Braces } from "lucide-react";

interface Job {
  id: number;
  taskName: string;
  payload: Record<string, unknown> | string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'pending' | 'running' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}

export default function JobTable({ jobs, onRefresh }: { jobs: Job[], onRefresh: () => void }) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const runJob = async (id: number) => {
    try {
      await api.post(`/run-job/${id}`);
      onRefresh();
    } catch (error) {
      console.error("Execution error", error);
    }
  };

  const formatPayload = (payload: any) => {
    try {
      if (typeof payload === 'string') {
        return JSON.stringify(JSON.parse(payload), null, 2);
      }
      return JSON.stringify(payload, null, 2);
    } catch (e) {
      return String(payload);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-w-full">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border">
                <TableHead className="py-4 px-6 text-xs uppercase tracking-wider">Process</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Priority</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-right px-6 text-xs uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No active processes in queue.
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id} className="border-border hover:bg-muted/20 transition-colors">
                    <TableCell className="font-bold py-4 px-6 min-w-[150px]">{job.taskName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`rounded-full px-3 ${
                        job.priority === 'High' 
                          ? 'text-red-500 border-red-500/20' 
                          : job.priority === 'Medium' 
                          ? 'text-amber-500 border-amber-500/20' 
                          : 'text-primary border-primary/20'
                      }`}>
                        {job.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${
                          job.status === 'running' 
                            ? 'bg-blue-500 animate-pulse' 
                            : job.status === 'completed' 
                            ? 'bg-green-500' 
                            : 'bg-muted-foreground/30'
                        }`} />
                        <span className="text-sm font-medium capitalize">{job.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary" 
                          onClick={() => setSelectedJob(job)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          className="h-8 w-8 rounded-lg shadow-sm" 
                          onClick={() => runJob(job.id)} 
                          disabled={job.status !== 'pending'}
                        >
                          <Play className="h-4 w-4 fill-current" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] p-0 overflow-hidden rounded-3xl border-border bg-card flex flex-col">
          <DialogHeader className="p-6 bg-muted/30 border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Braces className="h-5 w-5" />
              </div>
              <div className="text-left">
                <DialogTitle className="text-xl font-bold">{selectedJob?.taskName}</DialogTitle>
                <p className="text-xs text-muted-foreground mt-1">Process Configuration Object</p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Terminal className="h-3 w-3" /> Raw JSON Output
              </span>
              <Badge variant="outline" className="text-[10px] font-mono">
                ID: {selectedJob?.id}
              </Badge>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              <pre className="relative text-xs font-mono bg-black/95 text-emerald-400 p-5 rounded-xl overflow-x-auto whitespace-pre-wrap break-all border border-white/10">
                {selectedJob && formatPayload(selectedJob.payload)}
              </pre>
            </div>
          </div>

          <div className="p-4 border-t border-border bg-muted/20 shrink-0 flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => setSelectedJob(null)}
              className="rounded-xl px-6 font-bold"
            >
              Close Inspector
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}