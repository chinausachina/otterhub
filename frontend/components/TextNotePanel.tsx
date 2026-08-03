"use client";

import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { uploadFileWithProgress } from "@/lib/api";
import { useFileDataStore } from "@/stores/file";
import { FileItem } from "@shared/types";
import { toast } from "sonner";
import { useGeneralSettingsStore } from "@/stores/general-store";

function defaultFileName() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `文本笔记_${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}.txt`;
}

export function TextNotePanel() {
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState(defaultFileName);
  const [saving, setSaving] = useState(false);
  const addFileLocal = useFileDataStore((s) => s.addFileLocal);
  const { defaultUploadTags } = useGeneralSettingsStore();

  const handleSave = async () => {
    const text = content.trim();
    if (!text) {
      toast.error("请先输入或粘贴文本内容");
      return;
    }

    let name = fileName.trim() || defaultFileName();
    if (!name.toLowerCase().endsWith(".txt")) {
      name = `${name}.txt`;
    }

    setSaving(true);
    try {
      const file = new File([text], name, {
        type: "text/plain;charset=utf-8",
        lastModified: Date.now(),
      });

      const key = await uploadFileWithProgress(
        file,
        { tags: defaultUploadTags },
        () => {},
      );

      const fileItem: FileItem = {
        name: key,
        metadata: {
          fileName: name,
          fileSize: file.size,
          uploadedAt: Date.now(),
          liked: false,
          tags: defaultUploadTags,
        },
      };

      // key 形如 text:xxx.txt，从 key 解析类型
      const fileType = key.split(":")[0] as any;
      addFileLocal(fileItem, fileType);

      toast.success("文本已保存");
      setContent("");
      setFileName(defaultFileName());
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "保存失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative border-2 border-dashed rounded-xl p-6 backdrop-blur-sm bg-glass-bg border-glass-border space-y-4">
      <div className="flex items-center gap-2 text-foreground/70">
        <FileText className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium">新建文本笔记</span>
        <span className="text-xs text-foreground/40">（粘贴内容后保存为 .txt）</span>
      </div>

      <Input
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        placeholder="文件名（默认自动生成）"
        className="bg-secondary/30 border-glass-border"
      />

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="在这里粘贴或输入文本内容…"
        className="min-h-[160px] bg-secondary/30 border-glass-border resize-y"
      />

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-foreground/40">
          {content.length > 0 ? `${content.length} 字符` : "支持直接 Ctrl+V 粘贴"}
        </p>
        <Button onClick={handleSave} disabled={saving || !content.trim()}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              保存中…
            </>
          ) : (
            "保存文本"
          )}
        </Button>
      </div>
    </div>
  );
}
