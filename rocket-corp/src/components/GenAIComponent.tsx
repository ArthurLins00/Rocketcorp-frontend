import React from "react";
import Brilho from "../assets/Brilho.svg";

interface GenAIComponentProps {
  titulo: string;
  descricao: string;
}

const GenAIComponent: React.FC<GenAIComponentProps> = ({
  titulo,
  descricao,
}) => {
  return (
    <div className="border-l-4 border-teal-600 bg-gray-50 p-6 rounded-lg my-4 shadow-sm max-w-full flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <img src={Brilho} alt="Brilho" className="w-6 h-6" />
        <span className="font-semibold text-lg text-gray-800">{titulo}</span>
      </div>
      <span className="text-gray-600 text-base break-words">{descricao}</span>
    </div>
  );
};

export default GenAIComponent;
