import { themes as prismThemes } from "prism-react-renderer";

import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const organizationName = "Nick2bad4u";
const projectName = "Nick2bad4u";
const baseUrl = process.env["DOCUSAURUS_BASE_URL"] ?? "/Nick2bad4u/";

const footerCopyright =
    `© ${new Date().getFullYear()} ` +
    '<a href="https://github.com/Nick2bad4u/" target="_blank" rel="noopener noreferrer">Nick2bad4u</a> · Built with ' +
    '<a href="https://docusaurus.io/" target="_blank" rel="noopener noreferrer">Docusaurus</a>.';

const config: Config = {
    title: "Nick2bad4u Projects",
    tagline:
        "A Docusaurus-powered portfolio for GitHub projects, tooling, automation, and experiments.",
    url: "https://nick2bad4u.github.io",
    baseUrl,
    favicon: "img/logo.svg",
    organizationName,
    projectName,
    deploymentBranch: "gh-pages",
    trailingSlash: false,
    baseUrlIssueBanner: true,
    onBrokenLinks: "warn",
    onBrokenAnchors: "warn",
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },
    markdown: {
        emoji: true,
        format: "detect",
        hooks: {
            onBrokenMarkdownLinks: "warn",
        },
    },
    presets: [
        [
            "classic",
            {
                blog: false,
                docs: {
                    breadcrumbs: true,
                    editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/docusaurus/`,
                    path: "portfolio-docs",
                    routeBasePath: "docs",
                    showLastUpdateAuthor: true,
                    showLastUpdateTime: true,
                    sidebarCollapsed: false,
                    sidebarCollapsible: true,
                    sidebarPath: "./sidebars.ts",
                },
                pages: {
                    editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/docusaurus/`,
                    exclude: [
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
                sitemap: {
                    changefreq: "weekly",
                    filename: "sitemap.xml",
                    lastmod: "datetime",
                    priority: 0.6,
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
        image: "img/logo.svg",
        metadata: [
            {
                content:
                    "Nick2bad4u, GitHub portfolio, TypeScript, PowerShell, automation, Docusaurus",
                name: "keywords",
            },
        ],
        navbar: {
            hideOnScroll: true,
            style: "dark",
            title: "Nick2bad4u Projects",
            logo: {
                alt: "Nick2bad4u projects logo",
                height: 48,
                href: baseUrl,
                src: "img/logo.svg",
                width: 48,
            },
            items: [
                {
                    label: "Home",
                    position: "left",
                    to: "/",
                },
                {
                    label: "Projects",
                    position: "left",
                    to: "/projects",
                },
                {
                    label: "About",
                    position: "left",
                    to: "/docs/intro",
                },
                {
                    href: `https://github.com/${organizationName}?tab=repositories&sort=updated`,
                    label: "GitHub Repositories",
                    position: "right",
                },
                {
                    href: `https://github.com/${organizationName}`,
                    label: "GitHub Profile",
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
                            label: "About this site",
                            to: "/docs/intro",
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
        [
            "@easyops-cn/docusaurus-search-local",
            {
                docsDir: "portfolio-docs",
                docsRouteBasePath: "docs",
                explicitSearchResultPath: false,
                forceIgnoreNoIndex: true,
                fuzzyMatchingDistance: 1,
                hashed: true,
                hideSearchBarWithNoSearchContext: false,
                highlightSearchTermsOnTargetPage: true,
                indexBlog: false,
                indexDocs: true,
                indexPages: true,
                language: ["en"],
                removeDefaultStemmer: true,
                searchBarPosition: "right",
                searchBarShortcut: true,
                searchBarShortcutHint: true,
                searchBarShortcutKeymap: "ctrl+k",
                searchResultContextMaxLength: 96,
                searchResultLimits: 8,
                useAllContextsWithNoSearchContext: true,
            },
        ],
    ],
};

export default config;
