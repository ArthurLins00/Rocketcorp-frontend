import { useEffect, useState, useCallback } from 'react';
import { authenticatedFetch } from '../utils/auth';

export function use360controller(collaboratorId: string) {
    const [evaluations, setEvaluations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await authenticatedFetch(`/avaliacao/360/avaliado/${collaboratorId}`);
            if (!res) {
                setError('Erro ao buscar avaliações 360.');
                setLoading(false);
                return;
            }
            const data = await res.json();
            setEvaluations(data);
        } catch (err) {
            setError('Erro ao buscar avaliações 360.');
        } finally {
            setLoading(false);
        }
    }, [collaboratorId]);

    useEffect(() => {
        if (collaboratorId) fetchHistory();
    }, [collaboratorId, fetchHistory]);

    return {
        evaluations,
        loading,
        error,
        refreshData: fetchHistory,
    };
}
