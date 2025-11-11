import React from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

type User = {
  userId: string;
  name: string;
};

type Props = {
  users: User[];
  activeChat: string | null;
  onOpenSidebar: () => void;
  onDeleteAllChats: (receiverId: string) => Promise<boolean>;
};

const ChatHeader: React.FC<Props> = ({ users, activeChat, onOpenSidebar, onDeleteAllChats }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDeleteAllChats = async () => {
    if (!activeChat) return;
    
    setIsDeleting(true);
    try {
      const success = await onDeleteAllChats(activeChat);
      if (success) {
        toast.success('All chats have been deleted');
      } else {
        toast.error('Failed to delete chats');
      }
    } catch (error) {
      console.error('Error deleting chats:', error);
      toast.error('An error occurred while deleting chats');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };
  return (
    <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg p-4">
      <div className="flex items-center justify-between space-x-3">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="flex items-center justify-between space-x-3 w-full">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageSquare size={20} />
            </div>
            <h1 className="text-xl font-bold">
              {activeChat
                ? users.find((u) => u.userId === activeChat)?.name
                : "Select a user"}
            </h1>
          </div>
          <div className="flex items-center space-x-4 px-4">
            <Button
              variant="outline"
              className="text-black hover:bg-red-600 hover:text-white"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={!activeChat || isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete All Chats'}
            </Button>
          </div>

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all messages in this chat. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteAllChats} 
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete All'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
