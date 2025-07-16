"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  getAllCycles,
  editCycles,
  getAllUsers,
  getUsersByCycle,
} from "../../services/adminService";

// Definição do tipo dos ciclos
interface Cycle {
  id: number;
  name: string;
  status: "aberto" | "revisao_gestor" | "revisao_comite" | "finalizado";
  dataAberturaAvaliacao: string | null;
  dataFechamentoAvaliacao: string | null;
  dataAberturaRevisaoGestor: string | null;
  dataFechamentoRevisaoGestor: string | null;
  dataAberturaRevisaoComite: string | null;
  dataFechamentoRevisaoComite: string | null;
  dataFinalizacao: string | null;
  totalColaboradores: number;
  colaboradoresFinalizados: number;
  year: number;
  period: number;
}

interface EditData {
  dataAberturaAvaliacao: string;
  dataFechamentoAvaliacao: string;
  dataAberturaRevisaoGestor: string;
  dataFechamentoRevisaoGestor: string;
  dataAberturaRevisaoComite: string;
  dataFechamentoRevisaoComite: string;
  dataFinalizacao: string;
}

const statusConfig = {
  aberto: { label: "Aberto", color: "bg-blue-100 text-blue-800", icon: Clock },
  revisao_gestor: {
    label: "Revisão do Gestor",
    color: "bg-yellow-100 text-yellow-800",
    icon: AlertCircle,
  },
  revisao_comite: {
    label: "Revisão do Comitê",
    color: "bg-orange-100 text-orange-800",
    icon: AlertCircle,
  },
  finalizado: {
    label: "Finalizado",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
};

export default function AdminCycles() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCycle, setExpandedCycle] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingCycle, setEditingCycle] = useState<number | null>(null);
  const [editData, setEditData] = useState<EditData>({
    dataAberturaAvaliacao: "",
    dataFechamentoAvaliacao: "",
    dataAberturaRevisaoGestor: "",
    dataFechamentoRevisaoGestor: "",
    dataAberturaRevisaoComite: "",
    dataFechamentoRevisaoComite: "",
    dataFinalizacao: "",
  });
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [cycleUsers, setCycleUsers] = useState<{ [cycleId: number]: number }>(
    {}
  );

  useEffect(() => {
    async function fetchCycles() {
      setLoading(true);
      setError(null);
      try {
        const [data, users] = await Promise.all([
          getAllCycles(),
          getAllUsers(),
        ]);
        // Normaliza o status para usar underline
        const normalized = data.map((cycle: unknown) => {
          const c = cycle as Cycle;
          return {
            ...c,
            status:
              typeof c.status === "string"
                ? c.status.replace(/-/g, "_")
                : c.status,
          };
        });
        setCycles(normalized);
        setTotalUsers(Array.isArray(users) ? users.length : 0);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro ao buscar ciclos");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchCycles();
  }, []);

  const filteredCycles = cycles.filter((cycle) =>
    cycle.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const handleExpand = async (cycleId: number) => {
    if (expandedCycle === cycleId) {
      setExpandedCycle(null);
      return;
    }
    setExpandedCycle(cycleId);
    if (!cycleUsers[cycleId]) {
      try {
        const users = await getUsersByCycle(cycleId);
        setCycleUsers((prev) => ({
          ...prev,
          [cycleId]: Array.isArray(users) ? users.length : 0,
        }));
      } catch {
        setCycleUsers((prev) => ({ ...prev, [cycleId]: 0 }));
      }
    }
  };

  const startEditing = (cycle: Cycle) => {
    setEditingCycle(cycle.id);
    setEditData({
      dataAberturaAvaliacao: cycle.dataAberturaAvaliacao
        ? cycle.dataAberturaAvaliacao.slice(0, 10)
        : "",
      dataFechamentoAvaliacao: cycle.dataFechamentoAvaliacao
        ? cycle.dataFechamentoAvaliacao.slice(0, 10)
        : "",
      dataAberturaRevisaoGestor: cycle.dataAberturaRevisaoGestor
        ? cycle.dataAberturaRevisaoGestor.slice(0, 10)
        : "",
      dataFechamentoRevisaoGestor: cycle.dataFechamentoRevisaoGestor
        ? cycle.dataFechamentoRevisaoGestor.slice(0, 10)
        : "",
      dataAberturaRevisaoComite: cycle.dataAberturaRevisaoComite
        ? cycle.dataAberturaRevisaoComite.slice(0, 10)
        : "",
      dataFechamentoRevisaoComite: cycle.dataFechamentoRevisaoComite
        ? cycle.dataFechamentoRevisaoComite.slice(0, 10)
        : "",
      dataFinalizacao: cycle.dataFinalizacao
        ? cycle.dataFinalizacao.slice(0, 10)
        : "",
    });
  };

  const cancelEditing = () => {
    setEditingCycle(null);
    setEditData({
      dataAberturaAvaliacao: "",
      dataFechamentoAvaliacao: "",
      dataAberturaRevisaoGestor: "",
      dataFechamentoRevisaoGestor: "",
      dataAberturaRevisaoComite: "",
      dataFechamentoRevisaoComite: "",
      dataFinalizacao: "",
    });
  };

  const getStatusByDate = (editData: EditData) => {
    const today = new Date();
    const parse = (d: string) => (d ? new Date(d) : null);

    const dataAberturaAvaliacao = parse(editData.dataAberturaAvaliacao);
    const dataFechamentoAvaliacao = parse(editData.dataFechamentoAvaliacao);
    const dataAberturaRevisaoGestor = parse(editData.dataAberturaRevisaoGestor);
    const dataFechamentoRevisaoGestor = parse(
      editData.dataFechamentoRevisaoGestor
    );
    const dataAberturaRevisaoComite = parse(editData.dataAberturaRevisaoComite);
    const dataFechamentoRevisaoComite = parse(
      editData.dataFechamentoRevisaoComite
    );
    const dataFinalizacao = parse(editData.dataFinalizacao);

    if (
      dataAberturaAvaliacao &&
      dataFechamentoAvaliacao &&
      today >= dataAberturaAvaliacao &&
      today <= dataFechamentoAvaliacao
    ) {
      return "aberto";
    }
    if (
      dataAberturaRevisaoGestor &&
      dataFechamentoRevisaoGestor &&
      today >= dataAberturaRevisaoGestor &&
      today <= dataFechamentoRevisaoGestor
    ) {
      return "revisao_gestor";
    }
    if (
      dataAberturaRevisaoComite &&
      dataFechamentoRevisaoComite &&
      today >= dataAberturaRevisaoComite &&
      today <= dataFechamentoRevisaoComite
    ) {
      return "revisao_comite";
    }
    if (dataFinalizacao && today >= dataFinalizacao) {
      return "finalizado";
    }
    // Se não estiver em nenhum período, retorna o status anterior ou "aberto" como fallback
    return "aberto";
  };

  const saveChanges = async (cycleId: number) => {
    const original = cycles.find((c) => c.id === cycleId);
    if (!original) return;

    // Monta o payload só com os campos alterados
    const payload: Partial<EditData & { status?: string }> = {};
    (
      [
        "dataAberturaAvaliacao",
        "dataFechamentoAvaliacao",
        "dataAberturaRevisaoGestor",
        "dataFechamentoRevisaoGestor",
        "dataAberturaRevisaoComite",
        "dataFechamentoRevisaoComite",
        "dataFinalizacao",
      ] as const
    ).forEach((field) => {
      const originalValue = original[field]
        ? original[field]!.slice(0, 10)
        : "";
      const editedValue = editData[field];
      if (editedValue && editedValue !== originalValue) {
        payload[field] = new Date(editedValue).toISOString();
      }
    });

    // Atualiza o status conforme as datas
    const novoStatus = getStatusByDate(editData);
    editCycles(cycleId, { status: novoStatus });

    if (novoStatus !== original.status) {
      payload.status = novoStatus;
    }

    if (Object.keys(payload).length === 0) {
      setEditingCycle(null);
      setEditData({
        dataAberturaAvaliacao: "",
        dataFechamentoAvaliacao: "",
        dataAberturaRevisaoGestor: "",
        dataFechamentoRevisaoGestor: "",
        dataAberturaRevisaoComite: "",
        dataFechamentoRevisaoComite: "",
        dataFinalizacao: "",
      });
      return;
    }

    try {
      console.log("Payload enviado para editCycles:", payload);
      console.log("Id do ciclo:", cycleId);

      await editCycles(cycleId, payload);
      // Atualize a lista de ciclos após salvar
      const data = await getAllCycles();
      const normalized = data.map((cycle: Cycle) => ({
        ...cycle,
        status:
          typeof cycle.status === "string"
            ? cycle.status.replace(/-/g, "_")
            : cycle.status,
      }));
      setCycles(normalized);
      setEditingCycle(null);
      setEditData({
        dataAberturaAvaliacao: "",
        dataFechamentoAvaliacao: "",
        dataAberturaRevisaoGestor: "",
        dataFechamentoRevisaoGestor: "",
        dataAberturaRevisaoComite: "",
        dataFechamentoRevisaoComite: "",
        dataFinalizacao: "",
      });
      alert("Data alterada com sucesso!");
    } catch (err) {
      console.error("Erro real ao salvar:", err);
      alert("Erro ao salvar alterações!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-500 text-lg">Carregando ciclos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-red-500 text-lg">{error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Administração de Ciclos
          </h1>
          <p className="text-gray-600">
            Gerencie e monitore todos os ciclos de avaliação
          </p>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Buscar ciclo..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="max-w-md bg-white"
          />
        </div>

        <div className="space-y-4">
          {filteredCycles.map((cycle) => {
            const statusInfo =
              statusConfig[cycle.status as keyof typeof statusConfig];
            const isExpanded = expandedCycle === cycle.id;
            // Fallback para status desconhecido
            const StatusIcon = statusInfo?.icon || AlertCircle;
            const badgeColor = statusInfo?.color || "bg-gray-200 text-gray-700";
            const badgeLabel = statusInfo?.label || `Status: ${cycle.status}`;

            return (
              <Card
                key={cycle.id}
                className="bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-0">
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => handleExpand(cycle.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {`Ciclo ${cycle.year}.${cycle.period}`}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {cycleUsers[cycle.id]}/{totalUsers}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Badge className={`${badgeColor} border-0 font-medium`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {badgeLabel}
                        </Badge>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-100 p-6 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              Cronograma do Ciclo
                            </h4>
                            {editingCycle !== cycle.id && (
                              <button
                                onClick={() => startEditing(cycle)}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Editar Datas
                              </button>
                            )}
                          </div>

                          {editingCycle === cycle.id ? (
                            <div className="space-y-4 bg-white p-4 rounded-lg border">
                              <div className="space-y-3">
                                {/* Data Avaliação */}
                                <div className="flex justify-between items-center flex-wrap gap-2">
                                  <span className="text-sm text-gray-600">
                                    Data avaliação:
                                  </span>
                                  <span className="flex gap-2 flex-wrap">
                                    <input
                                      type="date"
                                      value={
                                        editData.dataAberturaAvaliacao
                                          ? editData.dataAberturaAvaliacao.slice(
                                              0,
                                              10
                                            )
                                          : ""
                                      }
                                      onChange={(e) =>
                                        setEditData({
                                          ...editData,
                                          dataAberturaAvaliacao: e.target.value,
                                        })
                                      }
                                      className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 max-w-full"
                                    />
                                    <span>-</span>
                                    <input
                                      type="date"
                                      value={
                                        editData.dataFechamentoAvaliacao
                                          ? editData.dataFechamentoAvaliacao.slice(
                                              0,
                                              10
                                            )
                                          : ""
                                      }
                                      onChange={(e) =>
                                        setEditData({
                                          ...editData,
                                          dataFechamentoAvaliacao:
                                            e.target.value,
                                        })
                                      }
                                      className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 max-w-full"
                                    />
                                  </span>
                                </div>
                                {/* Data Revisão Gestor */}
                                <div className="flex justify-between items-center flex-wrap gap-2">
                                  <span className="text-sm text-gray-600">
                                    Data revisão de gestor:
                                  </span>
                                  <span className="flex gap-2 flex-wrap">
                                    <input
                                      type="date"
                                      value={
                                        editData.dataAberturaRevisaoGestor
                                          ? editData.dataAberturaRevisaoGestor.slice(
                                              0,
                                              10
                                            )
                                          : ""
                                      }
                                      onChange={(e) =>
                                        setEditData({
                                          ...editData,
                                          dataAberturaRevisaoGestor:
                                            e.target.value,
                                        })
                                      }
                                      className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 max-w-full"
                                    />
                                    <span>-</span>
                                    <input
                                      type="date"
                                      value={
                                        editData.dataFechamentoRevisaoGestor
                                          ? editData.dataFechamentoRevisaoGestor.slice(
                                              0,
                                              10
                                            )
                                          : ""
                                      }
                                      onChange={(e) =>
                                        setEditData({
                                          ...editData,
                                          dataFechamentoRevisaoGestor:
                                            e.target.value,
                                        })
                                      }
                                      className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 max-w-full"
                                    />
                                  </span>
                                </div>
                                {/* Data Revisão Comitê */}
                                <div className="flex justify-between items-center flex-wrap gap-2">
                                  <span className="text-sm text-gray-600">
                                    Data revisão comitê:
                                  </span>
                                  <span className="flex gap-2 flex-wrap">
                                    <input
                                      type="date"
                                      value={
                                        editData.dataAberturaRevisaoComite
                                          ? editData.dataAberturaRevisaoComite.slice(
                                              0,
                                              10
                                            )
                                          : ""
                                      }
                                      onChange={(e) =>
                                        setEditData({
                                          ...editData,
                                          dataAberturaRevisaoComite:
                                            e.target.value,
                                        })
                                      }
                                      className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 max-w-full"
                                    />
                                    <span>-</span>
                                    <input
                                      type="date"
                                      value={
                                        editData.dataFechamentoRevisaoComite
                                          ? editData.dataFechamentoRevisaoComite.slice(
                                              0,
                                              10
                                            )
                                          : ""
                                      }
                                      onChange={(e) =>
                                        setEditData({
                                          ...editData,
                                          dataFechamentoRevisaoComite:
                                            e.target.value,
                                        })
                                      }
                                      className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 max-w-full"
                                    />
                                  </span>
                                </div>
                                {/* Data de Finalização */}
                                <div className="flex justify-between items-center flex-wrap gap-2">
                                  <span className="text-sm text-gray-600">
                                    Data finalização:
                                  </span>
                                  <span className="flex gap-2 flex-wrap">
                                    <input
                                      type="date"
                                      value={
                                        editData.dataFinalizacao
                                          ? editData.dataFinalizacao.slice(
                                              0,
                                              10
                                            )
                                          : ""
                                      }
                                      onChange={(e) =>
                                        setEditData({
                                          ...editData,
                                          dataFinalizacao: e.target.value,
                                        })
                                      }
                                      className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 max-w-full"
                                    />
                                    {/* Espaço vazio para alinhar com as outras colunas duplas */}
                                    <span className="w-32" />
                                  </span>
                                </div>
                              </div>
                              <div className="flex space-x-3 pt-4 border-t">
                                <button
                                  onClick={() => saveChanges(cycle.id)}
                                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-sm"
                                >
                                  Salvar Alterações
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium text-sm"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                  Data avaliação:
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {formatDate(cycle.dataAberturaAvaliacao)} -{" "}
                                  {formatDate(cycle.dataFechamentoAvaliacao)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                  Data revisão de gestor:
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {formatDate(cycle.dataAberturaRevisaoGestor)}{" "}
                                  -{" "}
                                  {formatDate(
                                    cycle.dataFechamentoRevisaoGestor
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                  Data revisão comitê:
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {formatDate(cycle.dataAberturaRevisaoComite)}{" "}
                                  -{" "}
                                  {formatDate(
                                    cycle.dataFechamentoRevisaoComite
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                  Data finalização:
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {formatDate(cycle.dataFinalizacao)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">
                            Status Atual
                          </h4>

                          <div className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center space-x-3 mb-3">
                              <StatusIcon className="w-5 h-5 text-gray-600" />
                              <span className="font-medium text-gray-900">
                                {badgeLabel}
                              </span>
                            </div>

                            <div className="text-sm text-gray-600">
                              Progresso:{" "}
                              {`${
                                cycleUsers[cycle.id] ?? 0
                              } de ${totalUsers} colaboradores`}
                            </div>

                            <div className="mt-2 bg-gray-200 rounded-full h-2">
                              {typeof cycleUsers[cycle.id] === "number" &&
                              totalUsers > 0 ? (
                                <div
                                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${
                                      (cycleUsers[cycle.id] / totalUsers) * 100
                                    }%`,
                                  }}
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredCycles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum ciclo encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
