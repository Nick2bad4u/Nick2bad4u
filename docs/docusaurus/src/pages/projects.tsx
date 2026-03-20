import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import { useEffect, useMemo, useState } from "react";

import ProjectCard from "../components/ProjectCard";
import {
    buildRepositorySearchIndex,
    getProjectCategory,
    getProjectCollectionId,
    getProjectCollectionSections,
    getProjectTotals,
    githubProfile,
    normalizeSearchText,
    projectCollections,
    usePortfolioRepositories,
    type ProjectCollectionId,
    type ProjectSortKey,
} from "../lib/portfolio";
import styles from "./projects.module.css";

const sortOptions = [
    {
        label: "Featured first",
        value: "featured",
    },
    {
        label: "Recently updated",
        value: "updated",
    },
    {
        label: "Most starred",
        value: "stars",
    },
    {
        label: "Alphabetical",
        value: "name",
    },
] as const satisfies readonly {
    readonly label: string;
    readonly value: ProjectSortKey;
}[];

const getCollectionFilterFromSearch = (
    search: string
): ProjectCollectionId | "all" => {
    const searchParameters = new URLSearchParams(search);
    const collection = searchParameters.get("collection");

    if (
        collection !== null &&
        projectCollections.some(
            (projectCollection) => projectCollection.id === collection
        )
    ) {
        return collection as ProjectCollectionId;
    }

    return "all";
};

export default function ProjectsPage() {
    const { errorMessage, fetchStatus, repositories, source } =
        usePortfolioRepositories();
    const location = useLocation();
    const urlCollectionFilter = useMemo(
        () => getCollectionFilterFromSearch(location.search),
        [location.search]
    );
    const [searchValue, setSearchValue] = useState("");
    const [collectionFilter, setCollectionFilter] = useState<
        ProjectCollectionId | "all"
    >(urlCollectionFilter);
    const [languageFilter, setLanguageFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortKey, setSortKey] = useState<ProjectSortKey>("featured");
    const [showArchived, setShowArchived] = useState(true);
    const [showForks, setShowForks] = useState(true);

    useEffect(() => {
        setCollectionFilter(urlCollectionFilter);
    }, [urlCollectionFilter]);

    const totals = getProjectTotals(repositories);

    const languageOptions = useMemo(
        () =>
            [...new Set(repositories.map((repository) => repository.language))]
                .filter((language): language is string => language !== null)
                .sort((left, right) => left.localeCompare(right)),
        [repositories]
    );

    const categoryOptions = useMemo(
        () =>
            [...new Set(repositories.map((repository) => getProjectCategory(repository)))]
                .sort((left, right) => left.localeCompare(right)),
        [repositories]
    );

    const baseFilteredRepositories = useMemo(() => {
        const normalizedQuery = normalizeSearchText(searchValue);

        return repositories.filter((repository) => {
            if (!showArchived && repository.archived) {
                return false;
            }

            if (!showForks && repository.fork) {
                return false;
            }

            if (
                languageFilter !== "all" &&
                repository.language !== languageFilter
            ) {
                return false;
            }

            if (
                categoryFilter !== "all" &&
                getProjectCategory(repository) !== categoryFilter
            ) {
                return false;
            }

            if (normalizedQuery.length === 0) {
                return true;
            }

            return buildRepositorySearchIndex(repository).includes(
                normalizedQuery
            );
        });
    }, [
        categoryFilter,
        languageFilter,
        repositories,
        searchValue,
        showArchived,
        showForks,
    ]);

    const collectionSummaries = useMemo(
        () =>
            projectCollections.map((collection) => ({
                collection,
                count: baseFilteredRepositories.filter(
                    (repository) =>
                        getProjectCollectionId(repository) === collection.id
                ).length,
            })),
        [baseFilteredRepositories]
    );

    const filteredRepositories = useMemo(() => {
        if (collectionFilter === "all") {
            return baseFilteredRepositories;
        }

        return baseFilteredRepositories.filter(
            (repository) => getProjectCollectionId(repository) === collectionFilter
        );
    }, [baseFilteredRepositories, collectionFilter]);

    const visibleSections = useMemo(
        () => getProjectCollectionSections(filteredRepositories, sortKey),
        [filteredRepositories, sortKey]
    );

    return (
        <Layout
            title="Projects"
            description="Search, filter, and browse every public Nick2bad4u GitHub repository."
        >
            <main className={styles.page}>
                <section className={`container ${styles.heroSection}`}>
                    <div className={styles.heroHeader}>
                        <div>
                            <p className={styles.kicker}>Project directory</p>
                            <Heading as="h1" className={styles.title}>
                                Explore the full GitHub catalog
                            </Heading>
                            <p className={styles.subtitle}>
                                Search the public repositories behind this
                                portfolio, then filter by language, project
                                category, and repository state.
                            </p>
                        </div>
                        <div className={styles.heroActions}>
                            <Link
                                className="button button--primary button--lg"
                                href={githubProfile.repositoriesUrl}
                            >
                                Open on GitHub
                            </Link>
                            <Link
                                className="button button--secondary button--lg"
                                to="/docs/intro"
                            >
                                Read site overview
                            </Link>
                        </div>
                    </div>

                    <div className={styles.summaryGrid}>
                        <article className={styles.summaryCard}>
                            <p className={styles.summaryValue}>
                                {totals.totalRepositories}
                            </p>
                            <p className={styles.summaryLabel}>Repositories</p>
                        </article>
                        <article className={styles.summaryCard}>
                            <p className={styles.summaryValue}>
                                {totals.totalStars}
                            </p>
                            <p className={styles.summaryLabel}>Stars</p>
                        </article>
                        <article className={styles.summaryCard}>
                            <p className={styles.summaryValue}>
                                {totals.demos}
                            </p>
                            <p className={styles.summaryLabel}>Live demos</p>
                        </article>
                        <article className={styles.summaryCard}>
                            <p className={styles.summaryValue}>
                                {totals.packages}
                            </p>
                            <p className={styles.summaryLabel}>Packages</p>
                        </article>
                    </div>

                    <div className={styles.dataBanner}>
                        <p className={styles.dataBannerTitle}>
                            {source === "live"
                                ? "Showing live GitHub data."
                                : "Showing the bundled repository snapshot."}
                        </p>
                        <p className={styles.dataBannerDescription}>
                            {fetchStatus === "loading"
                                ? "Refreshing the catalog from the GitHub API..."
                                : errorMessage ??
                                  "The project explorer updates itself from the public GitHub API when it can."}
                        </p>
                    </div>

                    <div className={styles.collectionBrowser}>
                        <button
                            className={`${styles.collectionChip} ${
                                collectionFilter === "all"
                                    ? styles.collectionChipActive
                                    : ""
                            }`.trim()}
                            onClick={() => {
                                setCollectionFilter("all");
                            }}
                            type="button"
                        >
                            <span>All collections</span>
                            <span className={styles.collectionChipCount}>
                                {baseFilteredRepositories.length}
                            </span>
                        </button>
                        {collectionSummaries.map(({ collection, count }) => (
                            <button
                                key={collection.id}
                                className={`${styles.collectionChip} ${
                                    collectionFilter === collection.id
                                        ? styles.collectionChipActive
                                        : ""
                                }`.trim()}
                                disabled={count === 0}
                                onClick={() => {
                                    setCollectionFilter(collection.id);
                                }}
                                type="button"
                            >
                                <span>{collection.title}</span>
                                <span className={styles.collectionChipCount}>
                                    {count}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                <section className={`container ${styles.controlsSection}`}>
                    <div className={styles.controlsGrid}>
                        <label className={styles.controlField}>
                            <span className={styles.controlLabel}>Search</span>
                            <input
                                className={styles.controlInput}
                                onChange={(event) => {
                                    setSearchValue(event.currentTarget.value);
                                }}
                                placeholder="Repository name, topic, language..."
                                type="search"
                                value={searchValue}
                            />
                        </label>

                        <label className={styles.controlField}>
                            <span className={styles.controlLabel}>Collection</span>
                            <select
                                className={styles.controlInput}
                                onChange={(event) => {
                                    setCollectionFilter(
                                        event.currentTarget.value as
                                            | ProjectCollectionId
                                            | "all"
                                    );
                                }}
                                value={collectionFilter}
                            >
                                <option value="all">All collections</option>
                                {projectCollections.map((collection) => (
                                    <option
                                        key={collection.id}
                                        value={collection.id}
                                    >
                                        {collection.title}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className={styles.controlField}>
                            <span className={styles.controlLabel}>Language</span>
                            <select
                                className={styles.controlInput}
                                onChange={(event) => {
                                    setLanguageFilter(event.currentTarget.value);
                                }}
                                value={languageFilter}
                            >
                                <option value="all">All languages</option>
                                {languageOptions.map((language) => (
                                    <option key={language} value={language}>
                                        {language}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className={styles.controlField}>
                            <span className={styles.controlLabel}>Category</span>
                            <select
                                className={styles.controlInput}
                                onChange={(event) => {
                                    setCategoryFilter(event.currentTarget.value);
                                }}
                                value={categoryFilter}
                            >
                                <option value="all">All categories</option>
                                {categoryOptions.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className={styles.controlField}>
                            <span className={styles.controlLabel}>Sort</span>
                            <select
                                className={styles.controlInput}
                                onChange={(event) => {
                                    setSortKey(
                                        event.currentTarget.value as ProjectSortKey
                                    );
                                }}
                                value={sortKey}
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className={styles.toggleRow}>
                        <label className={styles.toggle}>
                            <input
                                checked={showArchived}
                                onChange={(event) => {
                                    setShowArchived(event.currentTarget.checked);
                                }}
                                type="checkbox"
                            />
                            <span>Show archived repositories</span>
                        </label>
                        <label className={styles.toggle}>
                            <input
                                checked={showForks}
                                onChange={(event) => {
                                    setShowForks(event.currentTarget.checked);
                                }}
                                type="checkbox"
                            />
                            <span>Show forks</span>
                        </label>
                    </div>

                    <p className={styles.resultsSummary}>
                        Showing {filteredRepositories.length} of
                        {` ${repositories.length} `}
                        repositories across {visibleSections.length} visible
                        {visibleSections.length === 1 ? " section" : " sections"}.
                    </p>
                </section>

                <section className={`container ${styles.gridSection}`}>
                    {visibleSections.length > 0 ? (
                        <div className={styles.collectionSectionList}>
                            {visibleSections.map((section) => (
                                <article
                                    key={section.collection.id}
                                    className={styles.collectionSection}
                                    id={section.collection.id}
                                >
                                    <div className={styles.collectionSectionHeader}>
                                        <div>
                                            <p
                                                className={
                                                    styles.collectionSectionKicker
                                                }
                                            >
                                                {section.collection.shortLabel}
                                            </p>
                                            <Heading
                                                as="h2"
                                                className={styles.collectionSectionTitle}
                                            >
                                                {section.collection.title}
                                            </Heading>
                                            <p
                                                className={
                                                    styles.collectionSectionDescription
                                                }
                                            >
                                                {section.collection.description}
                                            </p>
                                        </div>
                                        <span className={styles.collectionCountPill}>
                                            {section.repositories.length} repos
                                        </span>
                                    </div>

                                    <div className={styles.projectGrid}>
                                        {section.repositories.map((repository) => (
                                            <ProjectCard
                                                key={repository.name}
                                                repository={repository}
                                            />
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <article className={styles.emptyState}>
                            <Heading as="h2">No repositories matched</Heading>
                            <p>
                                Try clearing one of the filters or using a
                                broader search term.
                            </p>
                        </article>
                    )}
                </section>
            </main>
        </Layout>
    );
}
