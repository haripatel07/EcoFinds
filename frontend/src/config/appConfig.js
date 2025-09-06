// Central app configuration & feature flags for enterprise-style clarity
export const APP_CONFIG = {
    appName: 'EcoFinds',
    features: {
        wishlist: true,
        wishlistGuestsCanPreview: false,
        reviews: true,
        flags: true,
        categorySections: true,
        sustainabilityBadge: true
    }
};

export function isFeatureEnabled(key) {
    return !!APP_CONFIG.features[key];
}
