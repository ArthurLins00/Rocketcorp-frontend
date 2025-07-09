import ReferenciasForm from "../../components/ReferenciasForm";

export default function ReferenciasPage() {
  const idCiclo = "2025.2";      // mockado
  const idAvaliador = "6";     // mockado

  return (
    <div className="p-4">
      <ReferenciasForm idCiclo={idCiclo} idAvaliador={idAvaliador} />
    </div>
  );
}