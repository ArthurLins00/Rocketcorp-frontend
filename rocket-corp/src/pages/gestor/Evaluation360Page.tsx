import type { Collaborator } from '../../models/collaborator';
import type { Cycle } from './EvaluationPage';

interface Avaliacao360PageProps {
  ciclo?: Cycle;
  collaborator?: Collaborator;
}

const Avaliacao360Page = (_props: Avaliacao360PageProps) => (
  <div className="p-4 text-center text-gray-500">
    Avaliação 360 (em desenvolvimento)
  </div>
);

export default Avaliacao360Page;