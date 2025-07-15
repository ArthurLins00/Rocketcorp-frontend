import MentoringForm from "../../components/MentoringForm";

export default function Mentoring() {
  const idCiclo = "2025.2"; // mockado
  const idAvaliador = "16"; // mockado

  return (
    <main className="p-6">
      <MentoringForm idCiclo={idCiclo} idAvaliador={idAvaliador} />
    </main>
  );
}
