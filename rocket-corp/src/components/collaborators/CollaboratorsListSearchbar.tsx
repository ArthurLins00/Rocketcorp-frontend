import { useState } from "react";
import { IoMdSearch } from "react-icons/io";

interface CollaboratorsListSearchbarProps {
    onSearch: (query: string) => void;
}

export const CollaboratorsListSearchbar: React.FC<CollaboratorsListSearchbarProps> = ({ onSearch }) => {
    const [searchText, setSearchText] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchText(value);
        onSearch(value);
    };

    return (
        <>
        <div className="flex flex-col w-full h-full">
            <div className="flex flex-row items-center space-x-[6px] bg-white rounded-xl py-[16px] px-[19px]">
                <div className="w-4 h-4">
                    < IoMdSearch size={"16px"} color="#1c1c1cbf"/>
                </div>
                <input
                    type="text"
                    value={searchText}
                    onChange={handleChange}
                    placeholder="Buscar por colaboradores"
                    className="flex-1 bg-transparent focus:outline-none [font-family:'Inter-Regular',Helvetica] font-normal text-[#1c1c1cbf] text-sm"
                />
            </div>
        </div>
        </>
    )
}