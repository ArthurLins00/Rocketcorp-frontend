import React from "react";

interface PopupLogoutProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const PopupLogout: React.FC<PopupLogoutProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Tem certeza de que você deseja sair?
        </h2>
        <div className="flex justify-center gap-4 mt-6">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded bg-[#08605F] text-white hover:bg-[#054947]"
            onClick={onConfirm}
          >
            Sim
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupLogout;
