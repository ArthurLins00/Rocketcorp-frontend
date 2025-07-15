import { useState } from "react";
import { Trash2 } from "lucide-react";
import Frame5 from "../../assets/Frame (9).svg";
import { importarHistorico } from "../../services/importarHistoricoService";

type FileItem = {
  file: File;
  name: string;
  size: number;
};

const MAX_FILES = 10;

export default function ImportarHistorico() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    setErrorMsg("");
    const selectedFiles = Array.from(event.target.files || []);
    if (files.length + selectedFiles.length > MAX_FILES) {
      setErrorMsg(`Você só pode anexar até ${MAX_FILES} arquivos.`);
      return;
    }
    const newFiles = selectedFiles.map(file => ({
      file,
      name: file.name,
      size: file.size
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setErrorMsg("");
    const droppedFiles = Array.from(event.dataTransfer.files || []);
    if (files.length + droppedFiles.length > MAX_FILES) {
      setErrorMsg(`Você só pode anexar até ${MAX_FILES} arquivos.`);
      return;
    }
    const newFiles = droppedFiles.map(file => ({
      file,
      name: file.name,
      size: file.size
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }

  function removeFile(index: number) {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }

  async function sendToBackend() {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await importarHistorico(files.map(f => f.file));
      setLoading(false);
      if (res.ok) {
        setShowSuccess(true);
        setFiles([]);
      } else {
        setErrorMsg("Erro ao enviar arquivos.");
      }
    } catch {
      setLoading(false);
      setErrorMsg("Erro de rede.");
    }
  }

  function handleSendMore() {
    setShowSuccess(false);
    setFiles([]);
    setErrorMsg("");
  }

  if (showSuccess) {
    return (
      <div className="mt-10 p-8 bg-white rounded-lg shadow-sm max-w-2xl mx-auto w-full flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-teal-700 mb-4">Arquivos enviados com sucesso!</h2>
        <p className="mb-6">Deseja enviar mais arquivos?</p>
        <div className="flex gap-4">
          <button
            onClick={handleSendMore}
            className="bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 px-6 rounded"
          >
            Enviar mais arquivos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 p-8 bg-white rounded-lg shadow-sm max-w-7xl mx-auto w-full">
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center text-center text-gray-500"
      >
        <img src={Frame5} alt="Frame 5" className="w-10 h-10 mb-2" />
        <p className="font-semibold">Escolha um arquivo</p>
        <p className="text-sm">Clique ou arraste arquivos .xlsx ou .xls aqui (máx. 10 arquivos)</p>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          multiple
          className="hidden"
          id="fileInput"
          disabled={files.length >= MAX_FILES}
        />
        <label htmlFor="fileInput" className={`mt-4 px-4 py-2 bg-teal-700 text-white rounded cursor-pointer ${files.length >= MAX_FILES ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Procurar Arquivos
        </label>
        {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
      </div>

      {files.length > 0 && (
      <div className="mt-6">
        {/* Cabeçalho */}
        <div className="grid grid-cols-[1fr_120px_60px] font-semibold text-gray-700 mb-2 px-4 gap-x-4">
          <div>Nome do arquivo</div>
          <div className="text-center">Tamanho</div>
          <div className="text-center">Ações</div>
        </div>

        {/* Lista de arquivos */}
        <div className="space-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_120px_60px] items-center bg-gray-50 border rounded px-4 py-2 gap-x-4"
          >
            <div className="truncate">{file.name}</div>
            <div className="text-center text-sm text-gray-600">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </div>
            <button
              onClick={() => removeFile(index)}
              className="text-red-500 hover:text-red-700 justify-self-center"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        </div>
      </div>
      )}

      {files.length > 0 && (
        <button
          onClick={sendToBackend}
          className="mt-6 bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 px-6 rounded flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <span>Enviando...</span>
          ) : (
            <span>Enviar arquivos</span>
          )}
        </button>
      )}
    </div>
  );
}
