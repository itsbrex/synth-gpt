import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AiFillGithub } from "react-icons/ai";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { MdOutlineLogout } from "react-icons/md";
import { RiAddFill, RiCloseFill, RiVoiceprintFill } from "react-icons/ri";
import { RootStateType } from "../store";
import { newChatText } from "../constants";
import ChatOrganiser from "../features/chat/components/ChatOrganiser";

const Navbar = () => {
	const navigate = useNavigate();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const { title, messages } = useSelector((state: RootStateType) => state.chat);
	const { isAuthenticated, logout } = useAuth0();

	const handleLogout = async () => {
		await logout({
			logoutParams: {
				returnTo: window.location.origin + "/login",
			},
		});
	};

	return (
		<>
			<nav className="fixed top-0 z-50 w-full border-b bg-gray-800 border-gray-700 sm:hidden">
				<div className="px-3 py-3 lg:px-5 lg:pl-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<div className="flex items-center">
								<button
									type="button"
									className="inline-flex items-center p-2 text-sm rounded-lg focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
									onClick={() => setIsSidebarOpen(!isSidebarOpen)}
								>
									{isSidebarOpen ? (
										<>
											<span className="sr-only">Close sidebar</span>
											<RiCloseFill className="w-6 h-6" />
										</>
									) : (
										<>
											<span className="sr-only">Open sidebar</span>
											<HiOutlineMenuAlt2 className="w-6 h-6" />
										</>
									)}
								</button>
							</div>
						</div>
						<div className="flex items-center bg-gray-800">{title}</div>
						<div className="flex items-center">
							<button
								type="button"
								className="inline-flex items-center p-2 text-sm rounded-lg focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
								onClick={() => {
									navigate("../", { replace: messages.length === 0 });
								}}
							>
								<span className="sr-only">{newChatText}</span>
								<RiAddFill className="w-6 h-6" />
							</button>
						</div>
					</div>
				</div>
			</nav>

			<aside
				className={`fixed top-0 left-0 z-40 w-64 h-screen p-0 pt-2 transition-transform border-r sm:translate-x-0 bg-gray-800 border-gray-700 ${
					isSidebarOpen ? "transform-none" : "-translate-x-full"
				}`}
				aria-label="Sidebar"
			>
				<div className="p-4">
					<a href="/" className="flex gap-2">
						<RiVoiceprintFill className="text-blue-300 w-4 h-4 mt-1" />
						<span className="logo whitespace-nowrap text-white text-2xl">
							synth gpt
						</span>
					</a>
				</div>
				<div className="px-4 pb-4 overflow-y-auto bg-gray-800 h-full">
					{isAuthenticated && <ChatOrganiser />}
					<ul className="fixed bottom-0 w-[220px] py-4 mt-4 space-y-2 border-t border-white/20 z-10">
						<li>
							{isAuthenticated && (
								<a
									href="#"
									onClick={handleLogout}
									className="flex items-center p-2 text-base font-normal rounded-lg text-white bg-gray-800 hover:bg-gray-700"
								>
									<MdOutlineLogout className="w-6 h-6 text-gray-500" />
									<span className="flex-1 ml-3 whitespace-nowrap">Log out</span>
								</a>
							)}
						</li>
						<li>
							<a
								href="https://github.com/simoncragg/synth-gpt"
								target="_blank"
								className="flex items-center p-2 text-base font-normal rounded-lg text-white bg-gray-800 hover:bg-gray-700"
							>
								<AiFillGithub className="w-6 h-6 text-gray-500" />
								<span className="flex-1 ml-3 whitespace-nowrap">Github</span>
							</a>
						</li>
					</ul>
				</div>
			</aside>
		</>
	);
};

export default Navbar;
