declare module 'vite/client' {
  // fallback 定义：当本地尚未安装 Vite 类型声明时，避免 TS 报错。
  const viteClient: Record<string, unknown>
  export = viteClient
}

