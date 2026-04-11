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
            description="A Docusaurus-powered portfolio for Nick2bad4u's GitHub profile, showcasing public repositories with a focus on apps, tools, ESLint plugins, and more."
        >
            <header className={`${styles.heroBanner} hero-gradient`}>
                <div className={`container ${styles.heroLayout} glass-panel`}>
                    <div className={styles.heroCopy}>
                        <p className={styles.heroKicker}> GitHub portfolio</p>
                        <Heading as="h1" className={styles.heroTitle}>
                            A showcase of my public repositories 
                        </Heading>
                        <p className={styles.heroSubtitle}>
                            This site showcases public repositories by{" "}
                            <Link
                                className={styles.heroInlineLink}
                                href={githubProfile.profileUrl}
                            >
                                @{githubProfile.username}
                            </Link>
                            , curated to highlight the most interesting work across
                            different focus areas.
                        </p>

                        <div className={styles.heroActions}>
                            <Link
                                className="button button--primary button--lg"
                                to="/projects"
                            >
                                 Browse all projects
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
                                      "The site refreshes from the public GitHub API when available."}
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
                <section className={`container ${styles.featuredSection}`}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <p className={styles.sectionKicker}> Featured work</p>
                            <Heading as="h2" className={styles.sectionTitle}>
                                A curated selection of highlighted projects
                            </Heading>
                            <p className={styles.sectionDescription}>
                                A selection of my favorite projects across different
                                categories, showcasing the variety of work and the depth of
                                focus areas like ESLint plugins, PowerShell tools, apps, etc...
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

                {eslintSection !== undefined ? (
                    <section className={`container ${styles.eslintSection}`}>
                        <div className={styles.sectionHeader}>
                            <div>
                                <p className={styles.sectionKicker}>
                                    󰮍 ESLint plugin family
                                </p>
                                <Heading as="h2" className={styles.sectionTitle}>
                                    A body of work across many plugin packages
                                </Heading>
                                <p className={styles.sectionDescription}>
                                    This focus area within the portfolio is
                                    a collection of ESLint plugins. These are
                                    grouped together in the explorer and spotlighted
                                    here to show the breadth of work across the
                                    ecosystem, from popular style and utility
                                    plugins to smaller experiments.
                                </p>
                            </div>
                            <div className={styles.collectionSpotlightStats}>
                                <span className={styles.collectionSpotlightPill}>
                                    {eslintSection.repositories.length} ESLint plugins
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
                                .slice(0, 6)
                                .map((repository) => (
                                    <ProjectCard
                                        key={repository.name}
                                        repository={repository}
                                    />
                                ))}
                        </div>
                    </section>
                ) : null}

                <section className={`container ${styles.collectionsSection}`}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <p className={styles.sectionKicker}>󰠱 Grouped showcase</p>
                            <Heading as="h2" className={styles.sectionTitle}>
                                Browse the portfolio by project family
                            </Heading>
                            <p className={styles.sectionDescription}>
                                Many projects are part of a larger family of
                                related work, like a collection of tools for a
                                specific ecosystem, a set of demos for a particular
                                technology, or a group of experiments around a common
                                theme. These collections are highlighted in the
                                explorer and spotlighted here to show the different
                                focus areas across the portfolio.
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
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    );
}
