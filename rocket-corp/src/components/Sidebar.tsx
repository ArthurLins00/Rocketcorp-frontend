import { useSidebarController } from "../controllers/sidebarController";
import AvatarInicial from "./AvatarInicial";
import path from "path";
import { icons } from "lucide-react";

export const Sidebar = () => {
	const {
		navigate,
		location,
		showLogoutConfirm,
		setShowLogoutConfirm,
		handleLogout,
		userId,
		sidebarItems,
	} = useSidebarController();

	return (
		<aside className="w-[14.5rem] h-[64rem] bg-white border-r-2 border-[#CECDCD] flex flex-col justify-between py-8">
			<div>
				<div className="flex items-center justify-center h-16 mb-8">
					<span className="text-2xl font-bold text-[#08605F]">RPE</span>
				</div>
				<nav>
					<ul className="flex flex-col gap-2 pl-5">
						{sidebarItems.map(item => (
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
										src={item.icon}
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
					<AvatarInicial nome={localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).name : "Colaborador 1"} tamanho={32} />
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
