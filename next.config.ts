import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
        port: "",
        pathname: "/v1/storage/buckets/**",
      },
    ],
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["middleware.ts"],
          }
        : false,
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  reactStrictMode: process.env.NODE_ENV !== "production",
  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-menubar",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
      "@radix-ui/react-toggle",
      "@radix-ui/react-tooltip",
      "lucide-react",
    ],
  },
  // Optimize bundle size
  webpack: (config, { dev, isServer, webpack }) => {
    // Optimize for production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        minimizer: [
          // Keep existing minimizers and add custom ones
          ...config.optimization.minimizer,
        ],
        splitChunks: {
          chunks: "all",
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              priority: 10,
              reuseExistingChunk: true,
              chunks: "all",
            },
            common: {
              name: "common",
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
              chunks: "all",
            },
            // Separate chunk for heavy libraries
            syntaxHighlighter: {
              test: /[\\/]node_modules[\\/]react-syntax-highlighter[\\/]/,
              name: "syntax-highlighter",
              priority: 20,
              reuseExistingChunk: true,
              chunks: "all",
            },
            radixUI: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: "radix-ui",
              priority: 15,
              reuseExistingChunk: true,
              chunks: "all",
            },
          },
        },
        usedExports: true,
        sideEffects: false,
      };
    }

    // Optimize imports
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": require("path").resolve(__dirname, "src"),
    };
    // Optimize module resolution
    config.resolve.modules = ["node_modules"];
    if (!dev && !isServer) {
      config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
    }
    return config;
  },
  // Headers for better caching and performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=1, stale-while-revalidate=59",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  // Compress responses
  compress: true,
  // Optimize page extensions
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  swcMinify: true,
};

export default nextConfig;
