import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, X } from "lucide-react";
import MessageTicks from "./MessageTicks";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  fileUrl?: string;
  isImportant?: boolean;
  decision?: "accepted" | "rejected";
};

type User = {
  userId: string;
  name: string;
};

type Props = {
  messages: { [key: string]: Message[] };
  users: User[];
  activeChat: string | null;
  decisions: Record<string, string>;
  onDecision: (
    messageId: string,
    decision: "accepted" | "rejected",
    receiverId: string,
    receiverName: string
  ) => void;
};

const Messages: React.FC<Props> = ({
  messages,
  users,
  activeChat,
  decisions,
  onDecision,
}) => {
  if (!activeChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <svg
          className="text-gray-600"
          width="75"
          height="75"
          viewBox="0 0 24 24"
          fill="none"
        />
        <p className="text-lg mt-4">Select a user to start messaging</p>
      </div>
    );
  }

  const chatKey = users.find((u) => u.userId === activeChat)?.name || "";
  const list = messages[chatKey] || [];

  return (
    <div className="space-y-4">
      {list.map((message) => {
        const decision = message.decision || decisions[message.id];
        return (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex flex-col items-end">
              {message.isImportant && message.sender !== "user" && !decision ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <div
                      className={`cursor-pointer max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md bg-gray-700 text-white border border-gray-600`}
                    >
                      {message.text}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-auto bg-gray-800 border border-gray-700 p-2 rounded-xl flex items-center space-x-2"
                  >
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-green-400 hover:text-green-500"
                      onClick={() =>
                        onDecision(
                          message.id,
                          "accepted",
                          activeChat || "",
                          users.find((u) => u.userId === activeChat)?.name ||
                            "Unknown"
                        )
                      }
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-400 hover:text-red-500"
                      onClick={() =>
                        onDecision(
                          message.id,
                          "rejected",
                          activeChat || "",
                          users.find((u) => u.userId === activeChat)?.name ||
                            "Unknown"
                        )
                      }
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </PopoverContent>
                </Popover>
              ) : (
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
                    decision === "accepted"
                      ? "bg-green-600 text-white"
                      : decision === "rejected"
                      ? "bg-red-600 text-white"
                      : message.sender === "user"
                      ? "bg-linear-to-r from-blue-500 to-purple-600 text-white"
                      : "bg-gray-700 text-white border border-gray-600"
                  }`}
                >
                  {message.fileUrl ? (
                    <img
                      src={message.fileUrl}
                      alt="Shared image"
                      className="max-w-full rounded"
                    />
                  ) : (
                    message.text
                  )}
                </div>
              )}
              {message.sender === "user" && (
                <MessageTicks status={message.status} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
