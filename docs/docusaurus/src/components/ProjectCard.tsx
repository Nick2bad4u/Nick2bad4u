import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";

import {
    getHomepageLabel,
    getProjectCategory,
    isFeaturedRepository,
    type PortfolioRepository,
} from "../lib/portfolio";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
    readonly repository: PortfolioRepository;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
});

const categoryBadgeClassName = (repository: PortfolioRepository): string => {
    const category = getProjectCategory(repository);

    switch (category) {
        case "Applications": {
            return styles.badgeApplications;
        }

        case "Automation": {
            return styles.badgeAutomation;
        }

        case "Fitness & Cycling": {
            return styles.badgeFitness;
        }

        case "Gaming & Mods": {
            return styles.badgeGaming;
        }

        case "PowerShell": {
            return styles.badgePowerShell;
        }

        case "Tooling": {
            return styles.badgeTooling;
        }
    }
};

export default function ProjectCard({ repository }: ProjectCardProps) {
    const isFeatured = isFeaturedRepository(repository);
    const homepageLabel = getHomepageLabel(repository);
    const hasHomepage =
        repository.homepageUrl !== null &&
        repository.homepageUrl !== repository.repositoryUrl;

    const ownerRepoMatch = /github\.com\/([^/]+)\/([^/]+)/.exec(repository.repositoryUrl);
    const owner = ownerRepoMatch?.[1] || "Nick2bad4u";
    const repo = ownerRepoMatch?.[2] || repository.name;
    const ogImageUrl = `https://opengraph.githubassets.com/1/${owner}/${repo}`;

    return (
        <article
            className={`${styles.card} ${isFeatured ? styles.featuredCard : ""}`.trim()}
        >
            <div className={styles.cardImageWrapper}>
                <img
                    src={ogImageUrl}
                    alt={`Preview of ${repository.name}`}
                    className={styles.cardImage}
                    loading="lazy"
                />
            </div>
            <div className={styles.cardContent}>
                <div className={styles.badgeRow}>
                {isFeatured ? (
                    <span className={`${styles.badge} ${styles.badgeFeatured}`}>
                        Featured
                    </span>
                ) : null}
                <span
                    className={`${styles.badge} ${categoryBadgeClassName(repository)}`}
                >
                    {getProjectCategory(repository)}
                </span>
                {repository.archived ? (
                    <span className={`${styles.badge} ${styles.badgeArchived}`}>
                        Archived
                    </span>
                ) : null}
                {repository.fork ? (
                    <span className={`${styles.badge} ${styles.badgeFork}`}>
                        Fork
                    </span>
                ) : null}
            </div>

            <header>
                <div className={styles.titleRow}>
                    <Heading as="h2" className={styles.title}>
                        {repository.name}
                    </Heading>
                    {repository.language !== null ? (
                        <p className={styles.language}>{repository.language}</p>
                    ) : null}
                </div>
                <p className={styles.description}>
                    {repository.description ??
                        "This repository does not currently have a GitHub description, but it is part of the portfolio index."}
                </p>
            </header>

            <div className={styles.metaList}>
                <p className={styles.metaItem}>★ {repository.stars} stars</p>
                <p className={styles.metaItem}>⑂ {repository.forks} forks</p>
                <p className={styles.metaItem}>
                    Updated {dateFormatter.format(new Date(repository.updatedAt))}
                </p>
            </div>

            {repository.topics.length > 0 ? (
                <ul className={styles.topicList}>
                    {repository.topics.slice(0, 5).map((topic) => (
                        <li key={topic} className={styles.topic}>
                            #{topic}
                        </li>
                    ))}
                </ul>
            ) : null}

                <div className={styles.actions}>
                    {hasHomepage ? (
                        <Link
                            className={styles.primaryAction}
                            href={repository.homepageUrl ?? repository.repositoryUrl}
                        >
                            {homepageLabel}
                        </Link>
                    ) : null}
                    <Link
                        className={hasHomepage ? styles.secondaryAction : styles.primaryAction}
                        href={repository.repositoryUrl}
                    >
                        GitHub Repository
                    </Link>
                </div>
            </div>
        </article>
    );
}
