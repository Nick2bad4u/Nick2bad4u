import { themes as prismThemes } from "prism-react-renderer";

import type { Config, PluginModule } from "@docusaurus/types";
import type { Options as DocsPluginOptions } from "@docusaurus/plugin-content-docs";
import type * as Preset from "@docusaurus/preset-classic";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

/** Route base path where docs site is deployed (GitHub Pages project path). */
const baseUrl =
    process.env["DOCUSAURUS_BASE_URL"] ?? "/Nick2bad4u/";
/** Opt-in flag for experimental Docusaurus performance features. */
const enableExperimentalFaster =
    process.env["DOCUSAURUS_ENABLE_EXPERIMENTAL"] === "true";

/** GitHub organization used for edit links and project metadata. */
const organizationName = "Nick2bad4u";
/** Repository name used for edit links and project metadata. */
const projectName = "Nick2bad4u";
/** Public origin for the published documentation site. */
const siteOrigin = "https://nick2bad4u.github.io";
/** Canonical public site URL including the GitHub Pages project path. */
const siteUrl = `${siteOrigin}${baseUrl}`;
/** Global site description used for SEO and social cards. */
const siteDescription =
    "A Docusaurus-powered portfolio for GitHub projects created by Nick2bad4u.";
/** Social preview image used for Open Graph and Twitter cards. */
const socialCardImagePath = "img/social-card.png";
/** Absolute social preview image URL. */
const socialCardImageUrl = new URL(socialCardImagePath, siteUrl).toString();
/** Client module path for runtime DOM enhancement bootstrap script. */
const modernEnhancementsClientModule = fileURLToPath(
    new URL("src/js/modernEnhancements.ts", import.meta.url)
);

/** PWA theme-color meta value for Chromium-based browsers. */
const pwaThemeColor = "#25c2a0";
/** Windows tile color for pinned-site metadata. */
const pwaTileColor = "#25c2a0";
/** Safari pinned-tab mask icon color. */
const pwaMaskIconColor = "#25c2a0";
/** Footer copyright HTML used by the site theme config. */
const footerCopyright =
    `© ${new Date().getFullYear()} ` +
    '<a href="https://github.com/Nick2bad4u/" target="_blank" rel="noopener noreferrer">Nick2bad4u</a> 💻 Built with ' +
    '<a href="https://docusaurus.io/" target="_blank" rel="noopener noreferrer">🦖 Docusaurus</a>.';

/** Obfuscated key for the v4 legacy post-build head attribute removal flag. */
const removeHeadAttrFlagKey = [
    "remove",
    "Le",
    "gacyPostBuildHeadAttribute",
].join("");

/** Local require helper rooted at the docs workspace config file location. */
const requireFromDocsWorkspace = createRequire(import.meta.url);

/** Resolve an optional module specifier without throwing when absent. */
const resolveOptionalModule = (moduleSpecifier: string): string | undefined => {
    try {
        return requireFromDocsWorkspace.resolve(moduleSpecifier);
    } catch {
        return undefined;
    }
};

/**
 * Optional ESM entry used to avoid webpack warnings from VS Code CSS language
 * service packages.
 */
const vscodeCssLanguageServiceEsmEntry = resolveOptionalModule(
    "vscode-css-languageservice/lib/esm/cssLanguageService.js"
);
/**
 * Optional ESM entry used to avoid webpack warnings from VS Code language
 * server type packages.
 */
const vscodeLanguageServerTypesEsmEntry = resolveOptionalModule(
    "vscode-languageserver-types/lib/esm/main.js"
);

/**
 * Alias VS Code language-service packages to their ESM entries when they are
 * present.
 *
 * @remarks
 * Some transitive editor-style dependencies resolve the UMD build of
 * `vscode-languageserver-types`, which causes noisy webpack critical-dependency
 * warnings inside Docusaurus. This plugin only activates when those optional
 * packages are actually installed in the current workspace.
 */
const suppressKnownWebpackWarningsPlugin: PluginModule = () => {
    if (
        vscodeCssLanguageServiceEsmEntry === undefined ||
        vscodeLanguageServerTypesEsmEntry === undefined
    ) {
        return null;
    }

    return {
        configureWebpack () {
            return {
                ignoreWarnings: [],
                resolve: {
                    alias: {
                        "vscode-css-languageservice$":
                            vscodeCssLanguageServiceEsmEntry,
                        "vscode-languageserver-types$":
                            vscodeLanguageServerTypesEsmEntry,
                        "vscode-languageserver-types/lib/umd/main.js$":
                            vscodeLanguageServerTypesEsmEntry,
                    },
                },
            };
        },
        name: "suppress-known-webpack-warnings",
    };
};

/** Docusaurus future flags, including optional experimental fast path. */
const futureConfig = {
    ...(enableExperimentalFaster
        ? {
            faster: {
                mdxCrossCompilerCache: true,
                rspackBundler: true,
                rspackPersistentCache: true,
                ssgWorkerThreads: true,
            },
        }
        : {}),
    v4: {
        [removeHeadAttrFlagKey]: true,
        // NOTE: Enabling cascade layers currently breaks our production CSS output
        // (CssMinimizer parsing errors -> large chunks of CSS dropped), which
        // makes many Infima (--ifm-*) variables undefined across the site.
        // Re-enable only after verifying the build output CSS is valid.
        siteStorageNamespacing: true,
        fasterByDefault: true,
        removeLegacyPostBuildHeadAttribute: true,
        mdx1CompatDisabledByDefault: true,
        useCssCascadeLayers: false,
    },
} satisfies Config["future"];


const config: Config = {
    storage: {
        type: "localStorage",
        namespace: true,
    },
    title: "Nick2bad4u's Projects",
    tagline:
        "A Docusaurus-powered portfolio for GitHub projects created by Nick2bad4u.",
    url: siteOrigin,
    baseUrl,
    future: futureConfig,
    baseUrlIssueBanner: true,
    clientModules: [modernEnhancementsClientModule],
    favicon: "img/favicon.ico",
    organizationName,
    projectName,
    deploymentBranch: "gh-pages",
    trailingSlash: false,
    onBrokenLinks: "warn",
    onBrokenAnchors: "warn",
    headTags: [
        {
            attributes: {
                href: siteOrigin,
                rel: "preconnect",
            },
            tagName: "link",
        },
        {
            attributes: {
                href: "https://github.com",
                rel: "preconnect",
            },
            tagName: "link",
        },
        {
            attributes: {
                type: "application/ld+json",
            },
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                description: siteDescription,
                image: socialCardImageUrl,
                name: "eslint-plugin-docusaurus-2",
                publisher: {
                    "@type": "Person",
                    name: "Nick2bad4u",
                    url: "https://github.com/Nick2bad4u",
                },
                url: siteUrl,
            }),
            tagName: "script",
        },
    ],
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },
    markdown: {
        anchors: {
            maintainCase: true,
        },
        emoji: true,
        format: "detect",
        hooks: {
            onBrokenMarkdownImages: "warn",
            onBrokenMarkdownLinks: "warn",
        },
        mermaid: true,
    },
    noIndex: false,
    onDuplicateRoutes: "warn",
    plugins: [
        suppressKnownWebpackWarningsPlugin,
        "docusaurus-plugin-image-zoom",
        [
            "@docusaurus/plugin-pwa",
            {
                debug: process.env["DOCUSAURUS_PWA_DEBUG"] === "true",
                offlineModeActivationStrategies: [
                    "appInstalled",
                    "standalone",
                    "queryString",
                ],
                pwaHead: [
                    {
                        href: `${baseUrl}manifest.json`,
                        rel: "manifest",
                        tagName: "link",
                    },
                    {
                        content: pwaThemeColor,
                        name: "theme-color",
                        tagName: "meta",
                    },
                    {
                        content: "yes",
                        name: "apple-mobile-web-app-capable",
                        tagName: "meta",
                    },
                    {
                        content: "default",
                        name: "apple-mobile-web-app-status-bar-style",
                        tagName: "meta",
                    },
                    {
                        href: `${baseUrl}img/icons/icon-192x192.png`,
                        rel: "apple-touch-icon",
                        tagName: "link",
                    },
                    {
                        color: pwaMaskIconColor,
                        href: `${baseUrl}img/docusaurus.svg`,
                        rel: "mask-icon",
                        tagName: "link",
                    },
                    {
                        content: `${baseUrl}img/icons/icon-192x192.png`,
                        name: "msapplication-TileImage",
                        tagName: "meta",
                    },
                    {
                        content: pwaTileColor,
                        name: "msapplication-TileColor",
                        tagName: "meta",
                    },
                ],
            },
        ],
    ],
    presets: [
        [
            "classic",
            {
                blog: {
                    blogDescription:
                        "Updates, architecture notes, and practical guidance for Nick2bad4u's projects.",
                    blogSidebarCount: "ALL",
                    blogTitle: "Nick2bad4u's Project Blog",
                    editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/docusaurus/`,
                    feedOptions: {
                        type: ["rss", "atom"],
                        xslt: true,
                    },
                    onInlineAuthors: "warn",
                    onInlineTags: "warn",
                    onUntruncatedBlogPosts: "warn",
                    path: "blog",
                    postsPerPage: 10,
                    routeBasePath: "blog",
                    showReadingTime: true,
                },
                docs: {
                    breadcrumbs: true,
                    editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/docusaurus/`,
                    path: "docs",
                    includeCurrentVersion: true,
                    onInlineTags: "ignore",
                    routeBasePath: "docs",
                    showLastUpdateAuthor: true,
                    showLastUpdateTime: true,
                    sidebarCollapsed: true,
                    sidebarCollapsible: true,
                    sidebarPath: "./sidebars.ts",
                },
                googleTagManager: {
                    containerId: "GTM-T8J6HPLF",
                },
                gtag: {
                    trackingID: "G-18DR1S6R1T",
                },
                pages: {
                    editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/docusaurus/`,
                    exclude: [
                        // Declarations (often generated next to CSS modules)
                        // must never become routable pages.
                        "**/*.d.ts",
                        "**/*.d.tsx",
                        "**/__tests__/**",
                        "**/*.test.{js,jsx,ts,tsx}",
                        "**/*.spec.{js,jsx,ts,tsx}",
                    ],
                    include: ["**/*.{js,jsx,ts,tsx,md,mdx}"],
                    mdxPageComponent: "@theme/MDXPage",
                    path: "src/pages",
                    routeBasePath: "/",
                    showLastUpdateAuthor: true,
                    showLastUpdateTime: true,
                },
                debug:
                    process.env["DOCUSAURUS_PRESET_CLASSIC_DEBUG"] === "true",
                sitemap: {
                    filename: "sitemap.xml",
                    ignorePatterns: ["/tests/**"],
                    lastmod: "datetime",
                },
                svgr: {
                    svgrConfig: {
                        dimensions: false, // Remove width/height so CSS controls size
                        expandProps: "start", // Spread props at the start: <svg {...props}>
                        icon: true, // Treat SVGs as icons (scales via viewBox)
                        memo: true, // Wrap component with React.memo
                        native: false, // Produce web React components (not React Native)
                        prettier: true, // Run Prettier on output
                        prettierConfig: "../../.prettierrc",
                        replaceAttrValues: {
                            "#000": "currentColor",
                            "#000000": "currentColor",
                        }, // Inherit color
                        svgo: true, // Enable SVGO optimizations
                        svgoConfig: {
                            plugins: [
                                { active: false, name: "removeViewBox" }, // Keep viewBox for scalability
                            ],
                        },
                        svgProps: { focusable: "false", role: "img" }, // Default SVG props
                        titleProp: true, // Allow passing a title prop for accessibility
                        typescript: true, // Generate TypeScript-friendly output (.tsx)
                    },
                },
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Preset.Options,
        ],
    ],
    themeConfig: {
        colorMode: {
            defaultMode: "dark",
            disableSwitch: false,
            respectPrefersColorScheme: true,
        },
        liveCodeBlock: {
            playgroundPosition: "bottom",
        },
        image: "img/logo.svg",
        metadata: [
            {
                content:
                    "A Docusaurus-powered portfolio for GitHub projects created by Nick2bad4u.",
                name: "keywords",
            },
            {
                content: "summary_large_image",
                name: "twitter:card",
            },
            {
                content: "Nick2bad4u's Projects",
                property: "og:site_name",
            },
            {
                content: socialCardImageUrl,
                property: "og:image",
            },
            {
                content: socialCardImageUrl,
                name: "twitter:image",
            },
        ],
        navbar: {
            hideOnScroll: true,
            style: "dark",
            title: "Nick2bad4u",
            logo: {
                alt: "Nick2bad4u's projects logo",
                height: 32,
                href: baseUrl,
                src: "img/logo-32x32.png",
                width: 32,
            },
            items: [
                {
                    label: "\uf46d Home",
                    position: "left",
                    to: "/",
                },
                {
                    label: "\udb81\udd3a Showcase",
                    position: "left",
                    to: "/showcase",
                },
                {
                    label: "\uf503 Projects",
                    position: "left",
                    to: "/projects",
                },
                {
                    label: "\uea74 Blog",
                    position: "left",
                    to: "/blog",
                },
                {
                    href: `https://github.com/${organizationName}?tab=repositories&sort=updated`,
                    label: "\uea62 Repos",
                    position: "right",
                },
                {
                    href: `https://github.com/${organizationName}`,
                    label: "\ueb00 Profile",
                    position: "right",
                },
            ],
        },
        footer: {
            style: "dark",
            links: [
                {
                    title: "Explore",
                    items: [
                        {
                            label: "Homepage",
                            to: "/",
                        },
                        {
                            label: "All projects",
                            to: "/projects",
                        },
                        {
                            label: "Blog",
                            to: "/blog",
                        },
                    ],
                },
                {
                    title: "GitHub",
                    items: [
                        {
                            href: `https://github.com/${organizationName}`,
                            label: "Profile",
                        },
                        {
                            href: `https://github.com/${organizationName}?tab=repositories&sort=updated`,
                            label: "Repositories",
                        },
                        {
                            href: `https://github.com/${organizationName}/${projectName}`,
                            label: "Site source",
                        },
                    ],
                },
                {
                    title: "Highlights",
                    items: [
                        {
                            href: "https://github.com/Nick2bad4u/FitFileViewer",
                            label: "FitFileViewer",
                        },
                        {
                            href: "https://github.com/Nick2bad4u/Uptime-Watcher",
                            label: "Uptime-Watcher",
                        },
                        {
                            href: "https://github.com/Nick2bad4u/PS-Color-Scripts-Enhanced",
                            label: "PS-Color-Scripts-Enhanced",
                        },
                    ],
                },
            ],
            copyright: footerCopyright,
            logo: {
                alt: "Nick2bad4u's Projects logo",
                href: `https://github.com/${organizationName}/${projectName}`,
                src: "img/logo-96x96.png",
                width: 96,
                height: 96,
            },
        },
        prism: {
            additionalLanguages: ["bash", "json", "powershell", "yaml"],
            darkTheme: prismThemes.dracula,
            defaultLanguage: "typescript",
            theme: prismThemes.github,
        },
        tableOfContents: {
            maxHeadingLevel: 4,
            minHeadingLevel: 2,
        },
    } satisfies Preset.ThemeConfig,
    themes: [
        "@docusaurus/theme-live-codeblock",
        "@docusaurus/theme-mermaid",
        [
            "@easyops-cn/docusaurus-search-local",
            {
                blogDir: "blog",
                blogRouteBasePath: "blog",
                docsDir: "docs",
                docsRouteBasePath: "docs",
                explicitSearchResultPath: false,
                forceIgnoreNoIndex: true,
                fuzzyMatchingDistance: 1,
                hashed: true,
                hideSearchBarWithNoSearchContext: false,
                highlightSearchTermsOnTargetPage: true,
                indexBlog: true,
                indexDocs: true,
                indexPages: false,
                language: ["en"],
                removeDefaultStemmer: true,
                removeDefaultStopWordFilter: false,
                searchBarPosition: "left",
                searchBarShortcut: true,
                searchBarShortcutHint: true,
                searchBarShortcutKeymap: "ctrl+k",
                searchResultContextMaxLength: 96,
                searchResultLimits: 8,
                useAllContextsWithNoSearchContext: false,
            },
        ],
    ],
};

export default config;
