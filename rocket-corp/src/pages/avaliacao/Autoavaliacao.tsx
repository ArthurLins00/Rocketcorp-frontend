import AutoavaliacaoForm from '../../components/AutoavaliacaoForm';

export default function Autovaliacao() {
  const idCiclo = "2025.2";
  const idAvaliador = "6";

  return (
    <main className="p-6">
      <AutoavaliacaoForm idCiclo={idCiclo} idAvaliador={idAvaliador} />
    </main>
  );
}