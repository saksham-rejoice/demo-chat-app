"use client";
import { getCollection, createCollection } from "@/services/instagramService";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Bookmark, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";

interface Collection {
  _id: string;
  collectionName: string;
  savedPost?: string[];
}

const InstgramCollectionPage = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchAllCollections = async () => {
    setLoading(true);
    try {
      const result = await getCollection();
      setCollections(result.collections || []);
    } catch (error) {
      toast.error("Failed to load collections");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;

    setCreating(true);
    try {
      await createCollection({ collectionName: newCollectionName });
      toast.success("Collection created successfully!");
      setNewCollectionName("");
      setIsDialogOpen(false);
      await fetchAllCollections();
    } catch (error) {
      toast.error("Failed to create collection");
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchAllCollections();
  }, []);

  return (
    <div className="py-6 px-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Saved Collections</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create Collection</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                Create Collection
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Collection name..."
                className="bg-gray-700 border-gray-600 text-white"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateCollection();
                  }
                }}
              />
              <div className="flex gap-3">
                <Button
                  onClick={handleCreateCollection}
                  disabled={creating || !newCollectionName.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {creating ? "Creating..." : "Create"}
                </Button>
                <Button
                  onClick={() => {
                    setIsDialogOpen(false);
                    setNewCollectionName("");
                  }}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-400">Loading collections...</div>
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-8">
          <Bookmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No saved collections yet</p>
          <p className="text-gray-500 text-sm">
            Create your first collection to start saving posts
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <Link
              key={collection._id}
              href={`/dashboard/instagram/save/${collection._id}`}
            >
              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer">
                <CardHeader className="pb-1">
                  <div className="flex flex-col items-center gap-1 py-1">
                    <div className="p-3 bg-blue-500/20 rounded-full">
                      <Bookmark className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-white font-semibold text-xl text-center">
                      {collection.collectionName}
                    </h3>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 text-center">
                  <p className="text-gray-400 text-sm font-medium">
                    {collection.savedPost?.length || 0} posts saved
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstgramCollectionPage;
