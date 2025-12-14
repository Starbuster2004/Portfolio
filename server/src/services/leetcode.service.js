const axios = require('axios');
const cacheService = require('./cache.service');
const ApiError = require('../utils/apiError');
const { logger } = require('../utils/logger');
const { CACHE_TTL, CACHE_KEYS } = require('../utils/constants');

class LeetCodeService {
    constructor() {
        this.username = process.env.LEETCODE_USERNAME || 'sachin0614';
        this.baseUrl = 'https://leetcode.com/graphql';
    }

    async getStats() {
        const cacheKey = `${CACHE_KEYS.LEETCODE}:stats:${this.username}`;

        return cacheService.getOrSet(cacheKey, async () => {
            try {
                const query = `
                    query getUserProfile($username: String!) {
                        allQuestionsCount {
                            difficulty
                            count
                        }
                        matchedUser(username: $username) {
                            username
                            submitStats: submitStatsGlobal {
                                acSubmissionNum {
                                    difficulty
                                    count
                                    submissions
                                }
                            }
                            profile {
                                ranking
                                reputation
                            }
                            badges {
                                id
                                displayName
                                icon
                            }
                            contributions {
                                points
                            }
                        }
                    }
                `;

                const response = await axios.post(
                    this.baseUrl,
                    {
                        query,
                        variables: { username: this.username },
                    },
                    { timeout: 10000 }
                );

                if (response.data.errors) {
                    throw new Error(response.data.errors[0].message);
                }

                const data = response.data.data;
                if (!data.matchedUser) {
                    throw new ApiError(404, 'LeetCode user not found');
                }

                return {
                    username: data.matchedUser.username,
                    problems: {
                        total: data.matchedUser.submitStats.acSubmissionNum.find(s => s.difficulty === 'All').count,
                        easy: data.matchedUser.submitStats.acSubmissionNum.find(s => s.difficulty === 'Easy').count,
                        medium: data.matchedUser.submitStats.acSubmissionNum.find(s => s.difficulty === 'Medium').count,
                        hard: data.matchedUser.submitStats.acSubmissionNum.find(s => s.difficulty === 'Hard').count,
                    },
                    profile: {
                        ranking: data.matchedUser.profile.ranking,
                        reputation: data.matchedUser.profile.reputation,
                    },
                    badges: data.matchedUser.badges,
                    contributionPoints: data.matchedUser.contributions.points,
                    lastUpdated: new Date(),
                };
            } catch (error) {
                logger.error({ error: error.message }, 'LeetCode API Error');
                throw new ApiError(503, 'Failed to fetch LeetCode stats');
            }
        }, CACHE_TTL.HOUR);
    }

    async getRecentSubmissions(limit = 10) {
        const cacheKey = `${CACHE_KEYS.LEETCODE}:recent:${this.username}:${limit}`;

        return cacheService.getOrSet(cacheKey, async () => {
            try {
                const query = `
                    query getRecentSubmissions($username: String!, $limit: Int!) {
                        matchedUser(username: $username) {
                            recentSubmissionList(limit: $limit) {
                                title
                                titleSlug
                                timestamp
                                statusDisplay
                                lang
                            }
                        }
                    }
                `;

                const response = await axios.post(
                    this.baseUrl,
                    {
                        query,
                        variables: { username: this.username, limit },
                    },
                    { timeout: 10000 }
                );

                if (response.data.errors) {
                    throw new Error(response.data.errors[0].message);
                }

                const data = response.data.data;
                if (!data.matchedUser) {
                    throw new ApiError(404, 'LeetCode user not found');
                }

                return data.matchedUser.recentSubmissionList;
            } catch (error) {
                logger.error({ error: error.message }, 'LeetCode API Error');
                throw new ApiError(503, 'Failed to fetch LeetCode submissions');
            }
        }, CACHE_TTL.HOUR);
    }

    invalidateCache() {
        cacheService.invalidatePattern(CACHE_KEYS.LEETCODE);
    }
}

module.exports = new LeetCodeService();
