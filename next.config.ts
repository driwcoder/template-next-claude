import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Compiler: auto-memoization, fewer manual useMemo/useCallback.
  // Stable in Next 16, opt-in. Requires babel-plugin-react-compiler.
  reactCompiler: true,

  // Typed <Link href> and router helpers.
  typedRoutes: true,

  // Biome is the linter (biome.json). Keep type errors fatal at build time.
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
