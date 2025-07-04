type SuccessModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
  };
  
  export default function SuccessModal({
    isOpen,
    onClose,
    title = "Sucesso",
    description = "A operação foi concluída com sucesso.",
  }: SuccessModalProps) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-lg font-semibold mb-2">{title}</h2>
          <p className="text-gray-700 mb-4">{description}</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }
  