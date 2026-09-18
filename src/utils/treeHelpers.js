    /**
     * Transforms a flat array of comments into a nested tree structure.
     * 
     * @param {Array} flatComments - Array of comment objects with `id` and `parentId`.
     * @returns {Array} Array of root-level comment objects, each containing nested `replies`.
     */
    export function buildCommentTree(flatComments = []) {
    if (!Array.isArray(flatComments) || flatComments.length === 0) {
        return [];
    }

    const commentMap = {};
    const rootComments = [];

    // Step 1: Clone all comments and map them by ID with an empty replies array
    flatComments.forEach((comment) => {
        commentMap[comment.id] = {
        ...comment,
        replies: [],
        };
    });

    // Step 2: Assemble relationships
    flatComments.forEach((comment) => {
        const node = commentMap[comment.id];

        if (comment.parentId && commentMap[comment.parentId]) {
        // Attach to parent's replies array
        commentMap[comment.parentId].replies.push(node);
        } else {
        // Top-level root comment
        rootComments.push(node);
        }
    });

    return rootComments;
    }

    /**
     * Helper to count total comments in a tree (including all nested child replies).
     */
    export function countTotalComments(commentTree = []) {
    let count = 0;

    function recurse(list) {
        for (const item of list) {
        count++;
        if (item.replies && item.replies.length > 0) {
            recurse(item.replies);
        }
        }
    }

    recurse(commentTree);
    return count;
    }