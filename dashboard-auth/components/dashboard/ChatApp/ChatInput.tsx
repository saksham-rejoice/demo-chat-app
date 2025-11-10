import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  activeChat: string | null;
  uploadOpen: boolean;
  setUploadOpen: (open: boolean) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  uploading: boolean;
  onFileUpload: () => void;
  isImportant: boolean;
  setIsImportant: (val: boolean) => void;
  inputText: string;
  setInputText: (v: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSend: () => void;
};

const ChatInput: React.FC<Props> = ({
  activeChat,
  uploadOpen,
  setUploadOpen,
  selectedFile,
  setSelectedFile,
  uploading,
  onFileUpload,
  isImportant,
  setIsImportant,
  inputText,
  setInputText,
  onKeyPress,
  onSend,
}) => {
  if (!activeChat) return null;
  return (
    <div className="bg-gray-800 border-t border-gray-700 p-4">
      <div className="flex items-center space-x-3 bg-gray-700 rounded-md border border-gray-600 p-2">
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost" className="text-gray-400 hover:text-gray-500">
              <Paperclip className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload File</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              {selectedFile && <div className="text-sm text-gray-600">Selected: {selectedFile.name}</div>}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setUploadOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={onFileUpload} disabled={!selectedFile || uploading}>
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="important"
            checked={isImportant}
            onCheckedChange={(checked) => setIsImportant(checked === true)}
          />
          <label htmlFor="important" className="text-sm text-gray-300 leading-none">
            Mark as important
          </label>
        </div>

        <Input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Type your message..."
          className="flex-1 bg-transparent text-white placeholder-gray-400 border-0 focus-visible:ring-0 py-3"
        />

        <Button
          onClick={onSend}
          disabled={!inputText.trim()}
          size="icon"
          className="bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full p-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;


