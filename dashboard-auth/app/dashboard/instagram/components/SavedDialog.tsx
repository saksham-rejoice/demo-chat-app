"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Bookmark, Plus } from "lucide-react";
import {
  saveInstagramPost,
  createCollection,
  getCollection,
} from "@/services/instagramService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Post {
  id: number;
  username: string;
  avatar: string;
  image: string;
  likes: string;
  caption: string;
  time: string;
}

interface Collection {
  _id: string;
  collectionName: string;
  savedPost?: string[];
}

interface SavedDialogProps {
  post: Post;
}

export default function SavedDialog({ post }: SavedDialogProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newCollection, setNewCollection] = useState("");
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch collections when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchCollections();
    }
  }, [isOpen]);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const data = await getCollection();
      const collectionsArray = Array.isArray(data.collections)
        ? data.collections
        : [];
      setCollections(collectionsArray);
    } catch (error) {
      toast.error("Failed to load collections");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToCollection = async (collectionName: string) => {
    setSaving(true);
    try {
      await saveInstagramPost({
        postId: post.id.toString(),
        collectionName: collectionName,
      });

      toast.success(`Saved to ${collectionName}!`);
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollection.trim()) return;

    setSaving(true);
    try {
      await createCollection({
        collectionName: newCollection,
        postId: post.id.toString(),
      });

      toast.success(`Collection "${newCollection}" created and post saved!`);
      setNewCollection("");
      setShowNewCollection(false);
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to create collection");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="transition-transform hover:scale-110">
          <Bookmark className="w-6 h-6 text-white" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md w-full p-0 overflow-hidden">
        <div className="bg-[#0f1724] text-white p-4">
          <DialogTitle className="text-lg font-semibold mb-2">
            Save to Collection
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-400 mb-4">
            Choose a collection to save this post
          </DialogDescription>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {loading ? (
              <div className="text-center py-4 text-gray-400">
                Loading collections...
              </div>
            ) : collections.length === 0 ? (
              <div className="text-center py-4 text-gray-400">
                No collections yet
              </div>
            ) : (
              collections.map((collection) => (
                <button
                  key={collection._id}
                  onClick={() =>
                    handleSaveToCollection(collection.collectionName)
                  }
                  disabled={saving}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <span className="font-medium">
                    {collection.collectionName || "Unnamed Collection"}
                  </span>
                  <span className="text-sm text-gray-400">
                    {collection.savedPost?.length || 0} posts
                  </span>
                </button>
              ))
            )}

            {!showNewCollection ? (
              <button
                onClick={() => setShowNewCollection(true)}
                className="w-full flex items-center gap-2 p-3 rounded-lg border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Collection</span>
              </button>
            ) : (
              <div className="space-y-2">
                <input
                  value={newCollection}
                  onChange={(e) => setNewCollection(e.target.value)}
                  placeholder="Collection name..."
                  className="w-full bg-gray-800 rounded px-3 py-2 text-sm text-white placeholder:text-gray-500 outline-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCreateCollection();
                    }
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateCollection}
                    disabled={saving || !newCollection.trim()}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? "Creating..." : "Create"}
                  </button>
                  <button
                    onClick={() => {
                      setShowNewCollection(false);
                      setNewCollection("");
                    }}
                    className="px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
