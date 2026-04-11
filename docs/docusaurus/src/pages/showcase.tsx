import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import ProjectCard from '../components/ProjectCard';
import {
    usePortfolioRepositories,
    getProjectCollectionSections,
    isFeaturedRepository
} from '../lib/portfolio';
import styles from './showcase.module.css';
import Link from '@docusaurus/Link';

export default function Showcase() {
    const { fetchStatus, repositories } = usePortfolioRepositories();
    const [activeTab, setActiveTab] = useState('all');

    const collectionSections = getProjectCollectionSections(repositories, 'featured');

    // Fallback if collections are empty (e.g. data loading)
    if (!repositories || repositories.length === 0) {
        return (
            <Layout title="Project Showcase" description="A showcase of the best projects.">
                <main className={styles.showcaseContainer}>
                    <div className={styles.loadingState}>
                        <Heading as="h1">Loading Showcase...</Heading>
                        <p>{fetchStatus === 'loading' ? 'Fetching data from GitHub...' : 'Starting up...'}</p>
                    </div>
                </main>
            </Layout>
        );
    }

    const featuredRepos = repositories.filter(isFeaturedRepository);

    const tabs = [
        { id: 'all', label: 'All Featured' },
        ...collectionSections.map(c => ({ id: c.collection.id, label: c.collection.title }))
    ];

    const getItemsForTab = () => {
        if (activeTab === 'all') return featuredRepos;
        const section = collectionSections.find(c => c.collection.id === activeTab);
        return section ? section.repositories : [];
    };

    const itemsToShow = getItemsForTab();

    return (
        <Layout title="Project Showcase" description="A showcase of the best projects.">
            <main className={styles.showcaseContainer}>
                <div className={styles.showcaseHeader}>
                    <Heading as="h1" className={styles.showcaseTitle}>
                        Project Showcase
                    </Heading>
                    <p className={styles.showcaseSubtitle}>
                        A curated selection of the finest work and core projects.
                    </p>
                </div>

                <div className={styles.showcaseTabs}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={activeTab === tab.id ? styles.activeTab : styles.tab}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className={styles.showcaseGrid}>
                    {itemsToShow.length > 0 ? (
                        itemsToShow.map(repo => (
                            <ProjectCard key={repo.name} repository={repo} />
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <p>No projects found for this category.</p>
                        </div>
                    )}
                </div>

                <div className={styles.ctaSection}>
                    <Heading as="h2">Looking for more?</Heading>
                    <p>There are plenty of other projects and experiments to explore.</p>
                    <Link to="/projects" className="button button--primary button--lg">
                        View All Projects
                    </Link>
                </div>
            </main>
        </Layout>
    );
}
