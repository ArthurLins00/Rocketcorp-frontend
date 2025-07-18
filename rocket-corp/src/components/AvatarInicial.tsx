type AvatarInicialProps = {
    nome: string;
    tamanho?: number; 
  };
  
  export default function AvatarInicial({ nome, tamanho = 32 }: AvatarInicialProps) {
    const iniciais = nome
      .split(" ")
      .map((palavra) => palavra[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
  
    return (
      <div
        style={{
          width: tamanho,
          height: tamanho,
          minWidth: tamanho,
          minHeight: tamanho,
          maxWidth: tamanho,
          maxHeight: tamanho,
          borderRadius: "50%",
          backgroundColor: "#4B5563", 
          color: "white",
          fontWeight: "bold",
          fontSize: tamanho * 0.4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
        }}
      >
        {iniciais}
      </div>
    );
  }
