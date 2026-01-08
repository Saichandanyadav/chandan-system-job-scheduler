"use client"
import { useState, useEffect } from 'react';
import { useTheme } from "next-themes";
import api from '@/lib/api';
import JobForm from '@/components/JobForm';
import JobTable from '@/components/JobTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity, Filter, LayoutDashboard, Database, Zap, 
  Moon, Sun, Menu, X, ChevronLeft, ChevronRight, RotateCcw,
  Server, Cpu, Globe, Plus, CheckCircle2, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Job {
  id: number;
  taskName: string;
  payload: Record<string, unknown> | string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'pending' | 'running' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchJobs = async () => {
    try {
      let url = '/jobs?';
      if (statusFilter !== "all") url += `status=${statusFilter}&`;
      if (priorityFilter !== "all") url += `priority=${priorityFilter}`;
      const response = await api.get<Job[]>(url);
      setJobs(response.data);
    } catch (err) {
      console.error("Sync error", err);
    }
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 3000);
    return () => clearInterval(interval);
  }, [statusFilter, priorityFilter]);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Live Logs", icon: Activity },
    { name: "Instances", icon: Database },
  ];

  const renderContent = () => {
    if (activeTab === "Live Logs") {
      return (
        <div className="space-y-10 animate-in fade-in duration-500">
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Clock className="text-amber-500 h-5 w-5" />
              <h2 className="text-xl font-bold tracking-tight">Active & Pending Queue</h2>
            </div>
            <JobTable jobs={jobs.filter((j: Job) => j.status !== 'completed')} onRefresh={fetchJobs} />
          </section>
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <CheckCircle2 className="text-emerald-500 h-5 w-5" />
              <h2 className="text-xl font-bold tracking-tight">Completed Tasks</h2>
            </div>
            <JobTable jobs={jobs.filter((j: Job) => j.status === 'completed')} onRefresh={fetchJobs} />
          </section>
        </div>
      );
    }

    if (activeTab === "Instances") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in zoom-in-95 duration-300">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-primary/10 rounded-xl text-primary"><Server className="h-6 w-6" /></div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Online</Badge>
              </div>
              <div>
                <h3 className="font-bold text-lg">Cluster-Node-0{i}</h3>
                <p className="text-sm text-muted-foreground">Location: AWS / us-east-1</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">CPU Load</p>
                  <p className="text-sm font-mono flex items-center gap-1"><Cpu className="h-3 w-3" /> {10 + i * 4}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Latency</p>
                  <p className="text-sm font-mono flex items-center gap-1"><Globe className="h-3 w-3" /> {20 + i * 5}ms</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return <JobTable jobs={jobs} onRefresh={fetchJobs} />;
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-all duration-300">
      <aside className={`fixed inset-y-0 left-0 z-50 bg-card border-r border-border transition-all duration-300 transform md:relative 
        ${isSidebarOpen ? "w-64" : "w-20"} 
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        
        <div className="flex flex-col h-full">
          <div className={`h-20 flex flex-col items-center transition-all duration-300 ${isSidebarOpen ? "px-6 pt-6" : "pt-6"}`}>
            <div className={`flex items-center w-full ${isSidebarOpen ? "justify-between" : "justify-center"}`}>
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-xl text-primary-foreground shadow-lg shadow-primary/20 shrink-0">
                  <Zap className="h-5 w-5" />
                </div>
                <span className={`text-xl font-bold tracking-tighter transition-all duration-300 ${!isSidebarOpen && "md:hidden"}`}>DOTIX</span>
              </div>
              
              {isSidebarOpen && (
                <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setIsSidebarOpen(false)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {!isSidebarOpen && (
              <Button variant="ghost" size="icon" className="hidden md:flex mt-6 h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl" onClick={() => setIsSidebarOpen(true)}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}
          </div>

          <nav className={`flex-1 px-4 space-y-2 ${isSidebarOpen ? "mt-8" : "mt-12"}`}>
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant={activeTab === item.name ? "default" : "ghost"}
                className={`w-full h-12 rounded-xl transition-all duration-300 group ${isSidebarOpen ? "justify-start gap-4 px-4" : "justify-center px-0"}`}
                onClick={() => { setActiveTab(item.name); setIsMobileMenuOpen(false); }}
              >
                <item.icon className={`h-5 w-5 shrink-0 ${activeTab === item.name ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"}`} />
                <span className={`transition-all duration-300 font-medium ${!isSidebarOpen && "hidden"}`}>
                  {item.name}
                </span>
              </Button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>
            <div className="hidden md:block">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{activeTab}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="rounded-xl" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {mounted ? (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />) : <div className="h-4 w-4" />}
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/30 h-10">
                  <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Create Job</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-3xl border-border">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle className="text-2xl font-bold">New Automation</DialogTitle>
                </DialogHeader>
                <div className="p-6">
                  <JobForm onJobCreated={fetchJobs} setOpen={setIsDialogOpen} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {activeTab === "Dashboard" && (
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div>
                <h1 className="text-4xl font-black tracking-tight">System Status</h1>
                <p className="text-muted-foreground font-medium">Monitoring cluster health and task distribution.</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 bg-card p-1.5 rounded-2xl border border-border shadow-sm w-full md:w-auto">
                <div className="flex items-center gap-2 px-3 border-r border-border">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[110px] h-8 border-0 bg-transparent focus:ring-0 shadow-none text-xs font-bold"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[110px] h-8 border-0 bg-transparent focus:ring-0 shadow-none text-xs font-bold"><SelectValue placeholder="Priority" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={resetFilters}>
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {renderContent()}
        </div>
      </main>
    </div>
  );
}