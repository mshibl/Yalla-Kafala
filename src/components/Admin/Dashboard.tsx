"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { syncFacebookPostsAction } from "@/server/actions/fetchFacebookPosts";

const AdminDashboard = () => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncFacebook = async () => {
    setIsSyncing(true);
    toast.loading("Syncing Facebook posts...", { id: "fb-sync" });
    try {
      const res = await syncFacebookPostsAction();
      if (res.success) {
        toast.success(res.message, { id: "fb-sync" });
      } else {
        toast.error(res.message, { id: "fb-sync" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync Facebook posts.", { id: "fb-sync" });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome to the Yallakafala admin portal.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <p className="text-sm text-gray-500">
              Synchronize the homepage Facebook feed with the latest posts from the official page.
            </p>
            <Button 
              onClick={handleSyncFacebook} 
              disabled={isSyncing} 
              className="w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? "Syncing..." : "Sync Facebook Posts"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
