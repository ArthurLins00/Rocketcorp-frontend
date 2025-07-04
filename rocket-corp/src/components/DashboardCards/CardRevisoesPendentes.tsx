type Props = {
  porcentagemPendentes: number;
};

export const CardRevisoesPendentes = ({ porcentagemPendentes }: Props) => (
  <div className="card-revisoes-pendentes">
    <span className="font-bold text-black">
      {porcentagemPendentes}% dos mentorados já fizeram avaliação 360 do gestor
    </span>
    {/* ...restante do card... */}
  </div>
);
