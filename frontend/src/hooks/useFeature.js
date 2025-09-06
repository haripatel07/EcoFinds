import { useMemo } from 'react';
import { isFeatureEnabled } from '../config/appConfig';

export function useFeature(key) {
    return useMemo(() => isFeatureEnabled(key), [key]);
}
