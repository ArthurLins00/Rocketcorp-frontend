import Avaliacao360Form from "../../components/Avaliacao360Form";

export default function Avaliacao360() {
  const idCiclo = "2025.2";
  const idAvaliador = "6";

  return (
    <main className="p-6">
      <Avaliacao360Form idCiclo={idCiclo} idAvaliador={idAvaliador} />
    </main>
  );
}
