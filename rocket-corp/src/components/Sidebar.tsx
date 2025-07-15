import Frame from "../assets/Frame.svg";
import Frame1 from "../assets/Frame (1).svg";
import Frame2 from "../assets/Frame (2).svg";
import Frame3 from "../assets/Frame (7).svg";
import Frame4 from "../assets/Frame (8).svg";
import Frame5 from "../assets/Frame (9).svg";
import Frame6 from "../assets/Frame (10).svg";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserType } from "../contexts/UserTypeContext";
import { useSidebarController } from "../controllers/sidebarController";
import path from "path";
import { icons } from "lucide-react";

{/* 
	colocar os cargos necessários para seu item de sidebar aparecer no show,
	por exemplo, se quiser que o seu item só apareça para o gestor, coloque:
	show: ({ userType }: { userType: string[] }) => userType.includes("manager"),
	ou se quiser que apareça para o colaborador, coloque:
	show: ({ userType }: { userType: string[] }) => userType.includes("user")
*/}

const sidebarItems = [
	{
		label: "Dashboard do colaborador",
		path: "/employee-dashboard",
		icon: Frame,
		show: () => true,
	},
	{
		label: "Dashboard do gestor",
		path: "/gestor-dashboard",
		icon: Frame,
		show: ({ userType }: { userType: string[] }) =>
			userType.includes("manager"),
	},
	{
		label: "Dashboard do comitê",
		path: "/comite-dashboard",
		icon: Frame,
		show: ({ userType }: { userType: string[] }) => userType.includes("committee"),
	},
	{
		label: "Dashboard do RH",
		path: "/rh-dashboard",
		icon: Frame,
		show: ({ userType }: { userType: string[] }) => userType.includes("rh"),
	},
	{
		label: "Avaliação de ciclo",
		path: "/avaliacao/autoavaliacao",
		icon: Frame1,
		show: () => true,
	},
	{
		label: "Evolução",
		path: "/evolution",
		icon: Frame2,
		show: () => true,
	},
	{
		label: "Gestor - Colaboradores",
		path: "/gestor/collaborators",
		icon: Frame2,
		show: () => true,
	},
	{
		label: "Critérios de Avaliação",
		path: "/rh/criterios",
		icon: Frame3,
		show: () => true,
	},
	{
		label: "Equalizações",
		path: "/comite/equalizacoes",
		icon: Frame4,
		show: () => true,
	},
	{
		label: "Colaborador - Evolução",
		path: "/evolution-page",
		icon: Frame2,
		show: () => true,
	},
  {
    label: "Importação de Históric",
    path: "/rh/ImportHistoryPage",
    icon: Frame5,
    show: () => true,
  },
  {
    label: "Brutal Facts",
    path: "/gestor/brutal-facts",
    icon: Frame6,
    show: () => true,
  }

];

export const Sidebar = () => {
	const {
		navigate,
		location,
		userType,
		showLogoutConfirm,
		setShowLogoutConfirm,
		handleLogout,
	} = useSidebarController();

	return (
		<aside className="w-[14.5rem] h-[64rem] bg-white border-r-2 border-[#CECDCD] flex flex-col justify-between py-8">
			<div>
				<div className="flex items-center justify-center h-16 mb-8">
					<span className="text-2xl font-bold text-[#08605F]">RPE</span>
				</div>
				<nav>
					<ul className="flex flex-col gap-2 pl-5">
						{/* To enable filtering by userType, uncomment the next line and comment the one below */}
						{sidebarItems
              .filter(item => item.show({ userType }))
              .map(item => (
						<li key={item.path}>
							<span
								className={`flex items-center text-[#08605F] rounded-lg font-medium py-3 px-2 cursor-pointer w-[12rem] text-left ${
									location.pathname === item.path
										? "bg-[#08605F1F] font-bold"
										: "hover:bg-[#08605F1F]"
								}`}
								onClick={() => navigate(item.path)}
							>
								<img
									src={item.icon || item.icons} // fallback for both
									alt={item.label}
									className="mr-2 w-5 h-5"
								/>
								{item.label}
							</span>
						</li>
					))}
					</ul>
				</nav>
			</div>
			<div className="flex flex-col items-start pl-8">
				<div className="flex items-center mb-4">
					<span className="bg-[#CECDCD] text-[#1D1D1D] font-bold rounded-full w-8 h-8 flex items-center justify-center mr-2">
						CN
					</span>
					<span className="text-base text-[#1D1D1D]">{localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).name : "Colaborador 1"}</span>
				</div>
				<a
					href="#"
					className="text-[#08605F] text-base hover:underline"
					onClick={e => {
						e.preventDefault();
						setShowLogoutConfirm(true);
					}}
				>
					Logout
				</a>
				{showLogoutConfirm && (
					<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
						<div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
							<span className="text-lg font-semibold mb-4">
								Tem certeza que deseja sair?
							</span>
							<div className="flex gap-4">
								<button
									className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
									onClick={handleLogout}
								>
									Sair
								</button>
								<button
									className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
									onClick={() => setShowLogoutConfirm(false)}
								>
									Cancelar
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</aside>
	);
};
