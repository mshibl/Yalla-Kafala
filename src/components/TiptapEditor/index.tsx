import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Sparkles,
} from "lucide-react";
import styles from "./index.module.css";
import { useState } from "react";
import { toast } from "sonner";
import { improveText } from "@/server/actions/ai/improveText";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
  placeholder?: string;
}

export function TipTapEditor({
  content,
  onChange,
  className,
  placeholder = "Write something...",
}: TipTapEditorProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose-base lg:prose-lg prose-stone dark:prose-invert focus:outline-none max-w-full",
          styles.tiptap,
          className,
        ),
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    autofocus: true,
  });

  const handleEnhanceWithAI = async () => {
    if (!editor || isEnhancing) return;
    if (editor.isEmpty) {
      toast.error("Please enter any text before enhancing");
      return;
    }

    try {
      setIsEnhancing(true);
      const currentContent = editor.getHTML();

      const improvedContent = await improveText({
        text: currentContent,
        system: `You are an expert writer. You will be given text and you return it in HTML format with minimal changes. only fix the grammar, punctuation errors and remove extra spaces.`,
      });
      editor.commands.setContent(improvedContent ?? currentContent);
      setIsEnhancing(false);
    } catch (error) {
      toast.error("Error enhancing content");
      setIsEnhancing(false);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1 rounded-md border p-1">
        <Button
          type="button"
          variant={editor.isActive("bold") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("italic") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("underline") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("bulletList") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("orderedList") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleEnhanceWithAI}
          disabled={isEnhancing}
          className="ml-auto bg-purple-500 text-white transition-colors hover:bg-purple-600 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-700"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isEnhancing ? "Enhancing..." : "Enhance with AI"}
        </Button>
      </div>
      <div
        className="relative w-full cursor-text rounded-md border border-input bg-background px-3 py-2"
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent editor={editor} />
        {editor?.isEmpty && (
          <p className="pointer-events-none absolute left-[15px] top-[11px] text-muted-foreground">
            {placeholder}
          </p>
        )}
      </div>
    </div>
  );
}
