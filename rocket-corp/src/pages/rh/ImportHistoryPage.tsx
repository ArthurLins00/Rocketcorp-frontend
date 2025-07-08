import { useState } from "react";
import { Trash2 } from "lucide-react";
import Frame5 from "../../assets/Frame (9).svg";

type FileItem = {
  file: File;
  name: string;
  size: number;
};

export default function ImportarHistorico() {
  const [files, setFiles] = useState<FileItem[]>([]);

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files || []);
    const newFiles = selectedFiles.map(file => ({
      file,
      name: file.name,
      size: file.size
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files || []);
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

  function sendToBackend() {
    const formData = new FormData();
    files.forEach(({ file }) => {
      formData.append("files", file);
    });
    fetch("/api/importar-historico", {
      method: "POST",
      body: formData,
    })
      .then(res => {
        if (res.ok) alert("Arquivos enviados com sucesso!");
        else alert("Erro ao enviar arquivos.");
      })
      .catch(() => alert("Erro de rede."));
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
        <p className="text-sm">Clique ou arraste arquivos .xlsx ou .xls aqui</p>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          multiple
          className="hidden"
          id="fileInput"
        />
        <label htmlFor="fileInput" className="mt-4 px-4 py-2 bg-teal-700 text-white rounded cursor-pointer">
          Procurar Arquivos
        </label>
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
          className="mt-6 bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 px-6 rounded"
        >
          Enviar arquivos
        </button>
      )}
    </div>
  );
}
