import Frame from "../assets/Frame.svg";
import Frame1 from "../assets/Frame (1).svg";
import Frame2 from "../assets/Frame (2).svg";

export const Sidebar = () => {
  return (
    <aside className="w-[14.5rem] h-[64rem] bg-white border-r-2 border-[#CECDCD] flex flex-col justify-between py-8">
      <div>
        <div className="flex items-center justify-center h-16 mb-8">
          <span className="text-2xl font-bold text-[#08605F]">RPE</span>
        </div>
        <nav>
          <ul className="flex flex-col gap-2 pl-5">
            <li>
              <span className="flex items-center text-[#08605F] rounded-lg font-medium py-3 px-2 cursor-pointer hover:bg-[#08605F1F] block w-[12rem] text-left">
                <img src={Frame} alt="Frame" className="mr-2 w-5 h-5" />
                Dashboard
              </span>
            </li>
            <li>
              <span className="flex items-center text-[#08605F] rounded-lg font-medium py-3 px-2 cursor-pointer hover:bg-[#08605F1F] block w-[12rem] text-left">
                <img src={Frame1} alt="Frame 1" className="mr-2 w-5 h-5" />
                Avaliação de ciclo
              </span>
            </li>
            <li>
              <span className="flex items-center text-[#08605F] rounded-lg font-medium py-3 px-2 cursor-pointer hover:bg-[#08605F1F] block w-[12rem] text-left">
                <img src={Frame2} alt="Frame 2" className="mr-2 w-5 h-5" />
                Evolução
              </span>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex flex-col items-start pl-8">
        <div className="flex items-center mb-4">
          <span className="bg-[#CECDCD] text-[#1D1D1D] font-bold rounded-full w-8 h-8 flex items-center justify-center mr-2">
            CN
          </span>
          <span className="text-base text-[#1D1D1D]">Colaborador 1</span>
        </div>
        <a href="#" className="text-[#08605F] text-base hover:underline">
          Logout
        </a>
      </div>
    </aside>
  );
};
