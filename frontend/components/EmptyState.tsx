import { Upload } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-32 h-32 mb-6 opacity-50 text-8xl">☁️</div>
      <h3 className="text-2xl font-semibold text-foreground mb-2">还没有文件</h3>
      <p className="text-foreground/60 max-w-md mb-6">
        拖拽文件到此处，或点击上传按钮开始使用你的私人云盘。
      </p>
      <div className="flex items-center gap-2 text-sm text-primary">
        <Upload className="h-4 w-4" />
        <span>支持图片、音频、视频、文档和文本</span>
      </div>
    </div>
  )
}
