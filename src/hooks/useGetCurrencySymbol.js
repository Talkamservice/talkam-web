import { useMemo } from 'react';

export const useGetCurrencySymbol = (currency) => {
    const currencySymbol = useMemo(() => {
        if (!currency) return '';

        const formatter = new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency,
        });

        const parts = formatter.formatToParts(1);
        return parts.find(part => part.type === 'currency')?.value || '';
    }, [currency]);

    return currencySymbol || '$';
};