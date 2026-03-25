import { supabase } from '../lib/supabase';

/**
 * Service to handle review data storage in Supabase.
 */

/**
 * Create a new review record.
 * @param {Object} reviewData - High-level review metadata
 * @returns {Promise<string>} - The ID of the created review
 */
export const createReview = async (reviewData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in to create a review.');

    const { data, error } = await supabase
        .from('reviews')
        .insert([{
            user_id: user.id,
            repo_name: reviewData.repo_name,
            repo_url: reviewData.repo_url,
            overall_score: reviewData.score,
            status: 'completed',
            summary: reviewData.summary,
            language: reviewData.language
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating review:', error);
        throw error;
    }

    return data.id;
};

/**
 * Create granular review detail records.
 * @param {string} reviewId - The ID of the parent review
 * @param {Array} findings - List of findings from AI analysis
 */
export const createReviewDetails = async (reviewId, findings) => {
    const details = findings.map(f => ({
        review_id: reviewId,
        file_path: f.file_path,
        category: f.category,
        severity: f.severity,
        description: f.description,
        code_snippet: f.code_snippet,
        suggested_fix: f.suggested_fix,
        line_number: f.line_number
    }));

    const { error } = await supabase
        .from('review_details')
        .insert(details);

    if (error) {
        console.error('Error creating review details:', error);
        throw error;
    }
};

/**
 * Fetch reviews for the current user.
 * @returns {Promise<Array>} - List of reviews
 */
export const fetchUserReviews = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user.id)
        .order('review_date', { ascending: false });

    if (error) {
        console.error('Error fetching user reviews:', error);
        throw error;
    }

    return data;
};

/**
 * Fetch detailed findings for a specific review.
 * @param {string} reviewId - The ID of the review
 * @returns {Promise<Array>} - List of findings
 */
export const fetchReviewDetails = async (reviewId) => {
    const { data, error } = await supabase
        .from('review_details')
        .select('*')
        .eq('review_id', reviewId);

    if (error) {
        console.error('Error fetching review details:', error);
        throw error;
    }

    return data;
};

/**
 * Fetch statistics for the admin dashboard.
 * @returns {Promise<Object>} - Review statistics
 */
export const fetchReviewStats = async () => {
    const { data, error } = await supabase
        .from('reviews')
        .select('overall_score, status, language');

    if (error) {
        console.error('Error fetching review stats:', error);
        throw error;
    }

    // Process stats
    const total = data.length;
    const avgScore = total > 0 ? data.reduce((acc, curr) => acc + (curr.overall_score || 0), 0) / total : 0;
    
    return {
        totalReviews: total,
        averageScore: Math.round(avgScore),
        reviews: data
    };
};
