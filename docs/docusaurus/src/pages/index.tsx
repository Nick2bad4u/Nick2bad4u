import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import ProjectCard from "../components/ProjectCard";
import {
    getProjectCollectionSections,
    getProjectTotals,
    githubProfile,
    isEslintPluginRepository,
    isFeaturedRepository,
    usePortfolioRepositories,
} from "../lib/portfolio";
import styles from "./index.module.css";

export default function Home() {
    const { errorMessage, fetchStatus, repositories, source } =
        usePortfolioRepositories();
    const totals = getProjectTotals(repositories);
    const collectionSections = getProjectCollectionSections(
        repositories,
        "featured"
    );
    const eslintSection = collectionSections.find(
        (section) => section.collection.id === "eslint-plugins"
    );
    const featuredRepositories = collectionSections
        .flatMap((section) => section.repositories)
        .filter(
            (repository) =>
                isFeaturedRepository(repository) &&
                !isEslintPluginRepository(repository)
        )
        .slice(0, 6);

    return (
        <Layout
            title="GitHub project portfolio"
            description="A Docusaurus-powered portfolio for Nick2bad4u GitHub projects, demos, tools, and experiments."
        >
            <header className={styles.heroBanner}>
                <div className={`container ${styles.heroLayout}`}>
                    <div className={styles.heroCopy}>
                        <p className={styles.heroKicker}>GitHub portfolio</p>
                        <Heading as="h1" className={styles.heroTitle}>
                            Shipping tooling, apps, automation, and experiments.
                        </Heading>
                        <p className={styles.heroSubtitle}>
                            This site showcases the public repositories from{" "}
                            <Link
                                className={styles.heroInlineLink}
                                href={githubProfile.profileUrl}
                            >
                                @{githubProfile.username}
                            </Link>
                            , starting with featured projects and continuing into
                            a searchable explorer for the full catalog.
                        </p>

                        <div className={styles.heroActions}>
                            <Link
                                className="button button--primary button--lg"
                                to="/projects"
                            >
                                Browse all projects
                            </Link>
                            <Link
                                className="button button--secondary button--lg"
                                to="/docs/intro"
                            >
                                Read portfolio docs
                            </Link>
                        </div>

                        <div className={styles.heroStatus}>
                            <span className={styles.statusPill}>
                                {source === "live"
                                    ? "Live GitHub data"
                                    : "Bundled repository snapshot"}
                            </span>
                            <span className={styles.statusNote}>
                                {fetchStatus === "loading"
                                    ? "Refreshing from the GitHub API..."
                                    : errorMessage ??
                                      "The site refreshes from the public GitHub API when possible."}
                            </span>
                        </div>
                    </div>

                    <aside className={styles.profilePanel}>
                        <img
                            alt="Nick2bad4u GitHub avatar"
                            className={styles.avatar}
                            decoding="async"
                            height="192"
                            loading="eager"
                            src={githubProfile.avatarUrl}
                            width="192"
                        />
                        <Heading as="h2" className={styles.profileName}>
                            {githubProfile.displayName}
                        </Heading>
                        <p className={styles.profileHandle}>
                            @{githubProfile.username}
                        </p>
                        <div className={styles.profileStats}>
                            <div>
                                <p className={styles.profileStatValue}>
                                    {totals.totalRepositories}
                                </p>
                                <p className={styles.profileStatLabel}>
                                    repos tracked
                                </p>
                            </div>
                            <div>
                                <p className={styles.profileStatValue}>
                                    {totals.totalStars}
                                </p>
                                <p className={styles.profileStatLabel}>stars</p>
                            </div>
                            <div>
                                <p className={styles.profileStatValue}>
                                    {totals.demos + totals.packages}
                                </p>
                                <p className={styles.profileStatLabel}>
                                    external links
                                </p>
                            </div>
                        </div>
                        <div className={styles.languageList}>
                            {totals.topLanguages.map((language) => (
                                <span
                                    key={language.language}
                                    className={styles.languagePill}
                                >
                                    {language.language} · {language.count}
                                </span>
                            ))}
                        </div>
                    </aside>
                </div>
            </header>

            <main className={styles.mainContent}>
                <section className={`container ${styles.collectionsSection}`}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <p className={styles.sectionKicker}>Grouped showcase</p>
                            <Heading as="h2" className={styles.sectionTitle}>
                                Browse the portfolio by project family
                            </Heading>
                            <p className={styles.sectionDescription}>
                                Instead of a flat repo dump, the site groups your
                                work into clearer collections so the ESLint plugins,
                                apps, PowerShell work, and hobby projects each read
                                like part of a bigger body of work.
                            </p>
                        </div>
                        <Link className={styles.sectionLink} to="/projects">
                            Open grouped explorer →
                        </Link>
                    </div>

                    <div className={styles.collectionGrid}>
                        {collectionSections.map((section) => (
                            <article
                                key={section.collection.id}
                                className={styles.collectionCard}
                            >
                                <div className={styles.collectionMetaRow}>
                                    <p className={styles.collectionLabel}>
                                        {section.collection.shortLabel}
                                    </p>
                                    <span className={styles.collectionCount}>
                                        {section.repositories.length} repos
                                    </span>
                                </div>
                                <Heading
                                    as="h3"
                                    className={styles.collectionTitle}
                                >
                                    {section.collection.title}
                                </Heading>
                                <p className={styles.collectionDescription}>
                                    {section.collection.description}
                                </p>
                                <ul className={styles.collectionExampleList}>
                                    {section.repositories
                                        .slice(0, 3)
                                        .map((repository) => (
                                            <li
                                                key={repository.name}
                                                className={styles.collectionExample}
                                            >
                                                {repository.name}
                                            </li>
                                        ))}
                                </ul>
                                <Link
                                    className={styles.collectionLink}
                                    to={`/projects?collection=${section.collection.id}`}
                                >
                                    View collection →
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>

                {eslintSection !== undefined ? (
                    <section className={`container ${styles.eslintSection}`}>
                        <div className={styles.sectionHeader}>
                            <div>
                                <p className={styles.sectionKicker}>
                                    ESLint plugin family
                                </p>
                                <Heading as="h2" className={styles.sectionTitle}>
                                    Your ESLint plugins now live together as one showcase
                                </Heading>
                                <p className={styles.sectionDescription}>
                                    This collection groups the plugin work into a
                                    single visible lane, making it easier to see
                                    the breadth of your lint tooling instead of
                                    scattering each package across the whole site.
                                </p>
                            </div>
                            <div className={styles.collectionSpotlightStats}>
                                <span className={styles.collectionSpotlightPill}>
                                    {eslintSection.repositories.length} plugins
                                </span>
                                <Link
                                    className={styles.sectionLink}
                                    to="/projects?collection=eslint-plugins"
                                >
                                    Open full plugin group →
                                </Link>
                            </div>
                        </div>

                        <div className={styles.projectGrid}>
                            {eslintSection.repositories
                                .slice(0, 4)
                                .map((repository) => (
                                    <ProjectCard
                                        key={repository.name}
                                        repository={repository}
                                    />
                                ))}
                        </div>
                    </section>
                ) : null}

                <section className={`container ${styles.featuredSection}`}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <p className={styles.sectionKicker}>Featured work</p>
                            <Heading as="h2" className={styles.sectionTitle}>
                                Start with the projects that best represent the wider portfolio
                            </Heading>
                            <p className={styles.sectionDescription}>
                                These repositories span developer tooling,
                                utilities, dashboards, and experiments with the
                                clearest public-facing value.
                            </p>
                        </div>
                        <Link className={styles.sectionLink} to="/projects">
                            View the full explorer →
                        </Link>
                    </div>

                    <div className={styles.projectGrid}>
                        {featuredRepositories.map((repository) => (
                            <ProjectCard
                                key={repository.name}
                                repository={repository}
                            />
                        ))}
                    </div>
                </section>

                <section className={`container ${styles.ctaSection}`}>
                    <div className={styles.ctaCard}>
                        <div>
                            <p className={styles.sectionKicker}>Keep exploring</p>
                            <Heading as="h2" className={styles.sectionTitle}>
                                Want the whole picture?
                            </Heading>
                            <p className={styles.sectionDescription}>
                                Open the project explorer to search every public
                                repository, or read the docs to understand the
                                main focus areas behind the work.
                            </p>
                        </div>
                        <div className={styles.ctaActions}>
                            <Link className="button button--primary" to="/projects">
                                Open projects explorer
                            </Link>
                            <Link className="button button--secondary" to="/docs/focus-areas">
                                Read focus areas
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    );
}
