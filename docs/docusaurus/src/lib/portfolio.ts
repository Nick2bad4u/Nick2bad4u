import { useEffect, useState } from "react";

import { fallbackRepositories } from "../data/fallbackRepositories";

export type PortfolioRepository = {
    readonly name: string;
    readonly description: string | null;
    readonly repositoryUrl: string;
    readonly homepageUrl: string | null;
    readonly language: string | null;
    readonly stars: number;
    readonly forks: number;
    readonly updatedAt: string;
    readonly archived: boolean;
    readonly fork: boolean;
    readonly topics: readonly string[];
    readonly openIssues: number;
};

export type ProjectCategory =
    | "Applications"
    | "Automation"
    | "Fitness & Cycling"
    | "Gaming & Mods"
    | "PowerShell"
    | "Tooling";

export type ProjectCollectionId =
    | "eslint-plugins"
    | "developer-tooling"
    | "apps-sites"
    | "powershell-terminal"
    | "automation-utilities"
    | "fitness-cycling"
    | "gaming-mods";

export type ProjectCollection = {
    readonly description: string;
    readonly id: ProjectCollectionId;
    readonly shortLabel: string;
    readonly title: string;
};

export type ProjectSortKey = "featured" | "name" | "stars" | "updated";

export type RepositoryFetchStatus =
    | "error"
    | "idle"
    | "loading"
    | "success";

export const githubProfile = {
    apiRepositoriesUrl:
        "https://api.github.com/users/Nick2bad4u/repos?type=owner&sort=updated&per_page=100&page=1",
    avatarUrl: "https://github.com/Nick2bad4u.png?size=480",
    displayName: "Nick2bad4u",
    profileUrl: "https://github.com/Nick2bad4u",
    repositoriesUrl:
        "https://github.com/Nick2bad4u?tab=repositories&sort=updated",
    username: "Nick2bad4u",
} as const;

export const featuredRepositoryNames = new Set<string>([
    "FitFileViewer",
    "Uptime-Watcher",
    "PS-Color-Scripts-Enhanced",
    "UserStyles",
    "Prettier-Plugin-Powershell",
    "eslint-plugin-typefest",
    "eslint-plugin-docusaurus-2",
    "eslint-plugin-file-progress-2",
    "eslint-plugin-typedoc",
    "internet-archive-upload",
    "ZwiftScripts",
]);

export const projectCollections = [
    {
        description:
            "A grouped family of ESLint plugins covering comments, TSDoc, immutability, GitHub Actions, Copilot, and other linting experiments.",
        id: "eslint-plugins",
        shortLabel: "ESLint",
        title: "ESLint plugins",
    },
    {
        description:
            "Formatter plugins, Stylelint utilities, validators, inspectors, and other developer-experience tooling that supports day-to-day coding workflows.",
        id: "developer-tooling",
        shortLabel: "Tooling",
        title: "Developer tooling",
    },
    {
        description:
            "Interactive projects with a stronger UI or site angle, including dashboards, viewers, docs sites, and GitHub Pages deployments.",
        id: "apps-sites",
        shortLabel: "Apps",
        title: "Apps & sites",
    },
    {
        description:
            "PowerShell scripts, prompt themes, terminal customization, and shell-first utilities built around the command line.",
        id: "powershell-terminal",
        shortLabel: "PowerShell",
        title: "PowerShell & terminal",
    },
    {
        description:
            "Automation helpers, bots, uploaders, schedulers, and small utilities that remove repetitive work or glue systems together.",
        id: "automation-utilities",
        shortLabel: "Automation",
        title: "Automation & utilities",
    },
    {
        description:
            "Projects related to cycling data, training workflows, FIT files, Strava, and Zwift-adjacent experiments.",
        id: "fitness-cycling",
        shortLabel: "Cycling",
        title: "Fitness & cycling",
    },
    {
        description:
            "Game helpers, mods, private-server tweaks, and other hobby projects tied to specific communities and games.",
        id: "gaming-mods",
        shortLabel: "Gaming",
        title: "Gaming & mods",
    },
] as const satisfies readonly ProjectCollection[];

const projectCollectionMap = new Map<
    ProjectCollectionId,
    ProjectCollection
>(projectCollections.map((collection) => [collection.id, collection]));

const toolingKeywords = [
    "eslint",
    "stylelint",
    "prettier",
    "config-inspector",
    "lint",
    "plugin",
    "tsdoc",
    "type-fest",
    "ts-extras",
];

const automationKeywords = [
    "archive",
    "bot",
    "github-actions",
    "automation",
    "uploader",
    "backup",
    "copilot",
];

const powerShellKeywords = [
    "powershell",
    "terminal",
    "oh-my-posh",
    "colorscripts",
    "shell",
    "prompt",
];

const appKeywords = [
    "dashboard",
    "docusaurus",
    "hub",
    "monitor",
    "pages",
    "profile",
    "site",
    "viewer",
    "watcher",
    "website",
];

const gamingKeywords = [
    "brawlhalla",
    "game",
    "gold-farming",
    "mods",
    "osrs",
    "runelite",
    "xp-bot",
];

const fitnessKeywords = [
    "cycling",
    "cycling-gear",
    "fit-file",
    "fitfile",
    "garmin",
    "strava",
    "zwift",
];

const containsAnyKeyword = (
    haystack: string,
    keywords: readonly string[]
): boolean => keywords.some((keyword) => haystack.includes(keyword));

const toNormalizedSearchText = (value: string): string =>
    value.trim().toLowerCase();

export const normalizeSearchText = (value: string): string =>
    toNormalizedSearchText(value);

export const toPortfolioRepository = (
    candidate: unknown
): PortfolioRepository | null => {
    if (typeof candidate !== "object" || candidate === null) {
        return null;
    }

    const repository = candidate as Record<string, unknown>;
    const name = repository["name"];
    const repositoryUrl = repository["html_url"];
    const updatedAt = repository["updated_at"];

    if (
        typeof name !== "string" ||
        typeof repositoryUrl !== "string" ||
        typeof updatedAt !== "string"
    ) {
        return null;
    }

    return {
        archived: repository["archived"] === true,
        description:
            typeof repository["description"] === "string"
                ? repository["description"]
                : null,
        fork: repository["fork"] === true,
        forks:
            typeof repository["forks_count"] === "number"
                ? repository["forks_count"]
                : 0,
        homepageUrl:
            typeof repository["homepage"] === "string" &&
            repository["homepage"].length > 0
                ? repository["homepage"]
                : null,
        language:
            typeof repository["language"] === "string"
                ? repository["language"]
                : null,
        name,
        openIssues:
            typeof repository["open_issues_count"] === "number"
                ? repository["open_issues_count"]
                : 0,
        repositoryUrl,
        stars:
            typeof repository["stargazers_count"] === "number"
                ? repository["stargazers_count"]
                : 0,
        topics: Array.isArray(repository["topics"])
            ? repository["topics"].filter(
                  (topic): topic is string => typeof topic === "string"
              )
            : [],
        updatedAt,
    };
};

export const isFeaturedRepository = (
    repository: PortfolioRepository
): boolean => featuredRepositoryNames.has(repository.name);

export const isEslintPluginRepository = (
    repository: PortfolioRepository
): boolean => {
    const name = toNormalizedSearchText(repository.name);
    const haystack = toNormalizedSearchText(
        [
            repository.name,
            repository.description ?? "",
            repository.topics.join(" "),
        ].join(" ")
    );

    return (
        name.startsWith("eslint-plugin") ||
        name.endsWith("eslint-plugin") ||
        repository.topics.some((topic) => {
            const normalizedTopic = toNormalizedSearchText(topic);

            return (
                normalizedTopic === "eslint-plugin" ||
                normalizedTopic === "eslintplugin"
            );
        }) ||
        (name.includes("eslint") && haystack.includes("eslint plugin"))
    );
};

export const getProjectCategory = (
    repository: PortfolioRepository
): ProjectCategory => {
    const haystack = toNormalizedSearchText(
        [
            repository.name,
            repository.description ?? "",
            repository.language ?? "",
            repository.topics.join(" "),
        ].join(" ")
    );

    if (containsAnyKeyword(haystack, fitnessKeywords)) {
        return "Fitness & Cycling";
    }

    if (containsAnyKeyword(haystack, gamingKeywords)) {
        return "Gaming & Mods";
    }

    if (
        repository.language === "PowerShell" ||
        containsAnyKeyword(haystack, powerShellKeywords)
    ) {
        return "PowerShell";
    }

    if (containsAnyKeyword(haystack, toolingKeywords)) {
        return "Tooling";
    }

    if (containsAnyKeyword(haystack, automationKeywords)) {
        return "Automation";
    }

    return "Applications";
};

export const getProjectCollectionId = (
    repository: PortfolioRepository
): ProjectCollectionId => {
    const haystack = toNormalizedSearchText(
        [
            repository.name,
            repository.description ?? "",
            repository.language ?? "",
            repository.topics.join(" "),
        ].join(" ")
    );
    const projectCategory = getProjectCategory(repository);

    if (isEslintPluginRepository(repository)) {
        return "eslint-plugins";
    }

    if (projectCategory === "PowerShell") {
        return "powershell-terminal";
    }

    if (projectCategory === "Fitness & Cycling") {
        return "fitness-cycling";
    }

    if (projectCategory === "Gaming & Mods") {
        return "gaming-mods";
    }

    if (projectCategory === "Tooling") {
        return "developer-tooling";
    }

    if (projectCategory === "Automation") {
        return "automation-utilities";
    }

    if (
        (repository.homepageUrl !== null &&
            !repository.homepageUrl.includes("npmjs.com")) ||
        containsAnyKeyword(haystack, appKeywords)
    ) {
        return "apps-sites";
    }

    return "apps-sites";
};

export const getProjectCollection = (
    repository: PortfolioRepository
): ProjectCollection =>
    projectCollectionMap.get(getProjectCollectionId(repository)) ??
    projectCollections.at(-1)!;

export const getHomepageLabel = (repository: PortfolioRepository): string => {
    if (repository.homepageUrl === null) {
        return "GitHub";
    }

    if (repository.homepageUrl.includes("npmjs.com")) {
        return "Package";
    }

    return "Live demo";
};

export const getProjectTotals = (
    repositories: readonly PortfolioRepository[]
) => {
    const demos = repositories.filter(
        (repository) =>
            repository.homepageUrl !== null &&
            !repository.homepageUrl.includes("npmjs.com")
    ).length;
    const packages = repositories.filter(
        (repository) =>
            repository.homepageUrl?.includes("npmjs.com")
    ).length;
    const totalStars = repositories.reduce(
        (sum, repository) => sum + repository.stars,
        0
    );
    const totalForks = repositories.reduce(
        (sum, repository) => sum + repository.forks,
        0
    );
    const languages = new Map<string, number>();

    for (const repository of repositories) {
        if (repository.language === null) {
            continue;
        }

        const currentCount = languages.get(repository.language) ?? 0;
        languages.set(repository.language, currentCount + 1);
    }

    const topLanguages = [...languages.entries()]
        .sort((left, right) => {
            if (right[1] !== left[1]) {
                return right[1] - left[1];
            }

            return left[0].localeCompare(right[0]);
        })
        .slice(0, 8)
        .map(([language, count]) => ({ count, language }));

    return {
        demos,
        packages,
        topLanguages,
        totalForks,
        totalRepositories: repositories.length,
        totalStars,
    };
};

export const sortRepositories = (
    repositories: readonly PortfolioRepository[],
    sortKey: ProjectSortKey
): PortfolioRepository[] => {
    const sortedRepositories = [...repositories];

    sortedRepositories.sort((left, right) => {
        if (sortKey === "name") {
            return left.name.localeCompare(right.name);
        }

        if (sortKey === "stars") {
            if (right.stars !== left.stars) {
                return right.stars - left.stars;
            }
        }

        if (sortKey === "updated") {
            const leftTimestamp = Date.parse(left.updatedAt);
            const rightTimestamp = Date.parse(right.updatedAt);

            if (rightTimestamp !== leftTimestamp) {
                return rightTimestamp - leftTimestamp;
            }
        }

        if (sortKey === "featured") {
            const featuredDelta =
                Number(isFeaturedRepository(right)) -
                Number(isFeaturedRepository(left));

            if (featuredDelta !== 0) {
                return featuredDelta;
            }

            if (right.stars !== left.stars) {
                return right.stars - left.stars;
            }

            const leftTimestamp = Date.parse(left.updatedAt);
            const rightTimestamp = Date.parse(right.updatedAt);

            if (rightTimestamp !== leftTimestamp) {
                return rightTimestamp - leftTimestamp;
            }
        }

        if (right.stars !== left.stars) {
            return right.stars - left.stars;
        }

        return left.name.localeCompare(right.name);
    });

    return sortedRepositories;
};

export const buildRepositorySearchIndex = (
    repository: PortfolioRepository
): string =>
    toNormalizedSearchText(
        [
            repository.name,
            repository.description ?? "",
            repository.language ?? "",
            getProjectCategory(repository),
            getProjectCollection(repository).title,
            getProjectCollection(repository).shortLabel,
            repository.topics.join(" "),
        ].join(" ")
    );

export const getProjectCollectionSections = (
    repositories: readonly PortfolioRepository[],
    sortKey: ProjectSortKey
) =>
    projectCollections
        .map((collection) => ({
            collection,
            repositories: sortRepositories(
                repositories.filter(
                    (repository) =>
                        getProjectCollectionId(repository) === collection.id
                ),
                sortKey
            ),
        }))
        .filter((section) => section.repositories.length > 0);

export const usePortfolioRepositories = () => {
    const [repositories, setRepositories] = useState<readonly PortfolioRepository[]>(
        fallbackRepositories
    );
    const [source, setSource] = useState<"live" | "snapshot">("snapshot");
    const [fetchStatus, setFetchStatus] =
        useState<RepositoryFetchStatus>("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const abortController = new AbortController();
        let isDisposed = false;

        const loadRepositories = async () => {
            setFetchStatus("loading");

            try {
                const response = await fetch(githubProfile.apiRepositoriesUrl, {
                    headers: {
                        Accept: "application/vnd.github+json",
                    },
                    signal: abortController.signal,
                });

                if (!response.ok) {
                    throw new Error(
                        `GitHub API returned ${String(response.status)}.`
                    );
                }

                const payload: unknown = await response.json();

                if (!Array.isArray(payload)) {
                    throw new TypeError(
                        "GitHub API response did not contain a repository array."
                    );
                }

                const nextRepositories = payload
                    .map((entry) => toPortfolioRepository(entry))
                    .filter(
                        (
                            repository
                        ): repository is PortfolioRepository => repository !== null
                    );

                if (nextRepositories.length === 0) {
                    throw new TypeError(
                        "GitHub API returned zero usable repositories."
                    );
                }

                if (isDisposed) {
                    return;
                }

                setRepositories(nextRepositories);
                setSource("live");
                setFetchStatus("success");
                setErrorMessage(null);
            } catch (error) {
                if (
                    isDisposed ||
                    (error instanceof DOMException &&
                        error.name === "AbortError")
                ) {
                    return;
                }

                setFetchStatus("error");
                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : "Unable to refresh repositories from GitHub."
                );
            }
        };

        void loadRepositories();

        return () => {
            isDisposed = true;
            abortController.abort();
        };
    }, []);

    return {
        errorMessage,
        fetchStatus,
        repositories,
        source,
    };
};
