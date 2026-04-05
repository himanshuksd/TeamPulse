import Chat from "../components/Chat";
import { useTeam } from "../context/TeamContext";

export default function ChatPage() {
    const { activeTeamId, teamsLoading } = useTeam();

    if (teamsLoading) {
        return (
            <div className="p-6 text-gray-500">
                Loading team chat...
            </div>
        );
    }

    if (!activeTeamId) {
        return (
            <div className="p-6 text-gray-500">
                No team selected. Please create or select a team.
            </div>
        );
    }

    return (
        <div className="p-6">
            <Chat teamId={activeTeamId} />
        </div>
    );
}